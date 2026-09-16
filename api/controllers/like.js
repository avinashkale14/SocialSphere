import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import { createActivity } from "./activity.js";

const JWT_SECRET = "socialsphere_secret_key";

// ======================================================
// GET LIKES
// ======================================================

export const getLikes = (req, res) => {
  const postId = Number(req.query.postId);

  if (!postId) {
    return res.status(400).json("Post ID is required!");
  }

  const q = `
    SELECT userId
    FROM likes
    WHERE postId = ?
  `;

  db.query(q, [postId], (err, data) => {
    if (err) {
      console.log("GET LIKES ERROR:", err);
      return res.status(500).json(err);
    }

    return res.status(200).json(data);
  });
};

// ======================================================
// ADD LIKE
// ======================================================

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const postId = Number(req.body.postId);

    if (!postId) {
      return res.status(400).json("Post ID is required!");
    }

    const postQuery = `
      SELECT userId
      FROM posts
      WHERE id = ?
    `;

    db.query(postQuery, [postId], (err, postData) => {
      if (err) {
        console.log("GET POST OWNER ERROR:", err);
        return res.status(500).json(err);
      }

      if (postData.length === 0) {
        return res.status(404).json("Post not found!");
      }

      const postOwnerId = Number(postData[0].userId);

      const checkQuery = `
        SELECT id
        FROM likes
        WHERE userId = ?
        AND postId = ?
        LIMIT 1
      `;

      db.query(
        checkQuery,
        [
          userInfo.id,
          postId,
        ],
        (err, existing) => {
          if (err) {
            console.log("CHECK LIKE ERROR:", err);
            return res.status(500).json(err);
          }

          if (existing.length > 0) {
            return res.status(200).json(
              "Post already liked."
            );
          }

          const insertQuery = `
            INSERT INTO likes
            (
              userId,
              postId
            )
            VALUES (?, ?)
          `;

          db.query(
            insertQuery,
            [
              userInfo.id,
              postId,
            ],
            (err, result) => {
              if (err) {
                console.log("ADD LIKE ERROR:", err);
                return res.status(500).json(err);
              }

              // Only the post owner receives the like
              // notification. Self-like creates no notification.
              if (Number(userInfo.id) !== postOwnerId) {
                createActivity(
                  userInfo.id,
                  "like",
                  postOwnerId,
                  postId,
                  null,
                  null
                );
              }

              return res.status(200).json({
                message: "Post liked.",
                likeId: result.insertId,
              });
            }
          );
        }
      );
    });
  });
};

// ======================================================
// DELETE LIKE / UNLIKE
// ======================================================

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const postId = Number(req.query.postId);

    if (!postId) {
      return res.status(400).json("Post ID is required!");
    }

    const deleteLikeQuery = `
      DELETE FROM likes
      WHERE userId = ?
      AND postId = ?
    `;

    db.query(
      deleteLikeQuery,
      [
        userInfo.id,
        postId,
      ],
      (err, result) => {
        if (err) {
          console.log("DELETE LIKE ERROR:", err);
          return res.status(500).json(err);
        }

        if (result.affectedRows > 0) {
          // Remove only this user's notification for this post.
          const deleteActivityQuery = `
            DELETE FROM activities
            WHERE type = 'like'
            AND userId = ?
            AND postId = ?
          `;

          db.query(
            deleteActivityQuery,
            [
              userInfo.id,
              postId,
            ],
            (activityErr) => {
              if (activityErr) {
                console.log(
                  "DELETE LIKE ACTIVITY ERROR:",
                  activityErr
                );
              }
            }
          );
        }

        return res.status(200).json(
          "Post unliked."
        );
      }
    );
  });
};
