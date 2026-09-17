import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import { createActivity } from "./activity.js";

const JWT_SECRET = "socialsphere_secret_key";

// Get comments
export const getComments = (req, res) => {
  const postId = Number(req.query.postId);

  if (!postId) {
    return res.status(400).json("Post ID is required!");
  }

  const q = `
    SELECT
      c.id,
      c.desc,
      c.createdAt,
      c.userId,
      c.postId,
      u.name,
      u.profilePic
    FROM comments AS c
    JOIN users AS u
      ON u.id = c.userId
    WHERE c.postId = ?
    ORDER BY c.createdAt DESC
  `;

  db.query(q, [postId], (err, data) => {
    if (err) {
      console.log("GET COMMENTS ERROR:", err);
      return res.status(500).json(err);
    }

    return res.status(200).json(data);
  });
};

// Add comment
export const addComment = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const commentText = req.body.desc?.trim() || "";
    const postId = Number(req.body.postId);

    if (!commentText || !postId) {
      return res.status(400).json(
        "Comment and postId are required!"
      );
    }

    const postOwnerQuery = `
      SELECT userId
      FROM posts
      WHERE id = ?
    `;

    db.query(
      postOwnerQuery,
      [postId],
      (err, postData) => {
        if (err) {
          console.log("GET POST OWNER ERROR:", err);
          return res.status(500).json(err);
        }

        if (postData.length === 0) {
          return res.status(404).json("Post not found!");
        }

        const postOwnerId = Number(postData[0].userId);

        const insertQuery = `
          INSERT INTO comments
          (
            \`desc\`,
            createdAt,
            userId,
            postId
          )
          VALUES (?, NOW(), ?, ?)
        `;

        db.query(
          insertQuery,
          [
            commentText,
            userInfo.id,
            postId,
          ],
          (err, data) => {
            if (err) {
              console.log("ADD COMMENT ERROR:", err);
              return res.status(500).json(err);
            }

            if (Number(userInfo.id) !== postOwnerId) {
              createActivity(
                userInfo.id,
                "comment",
                postOwnerId,
                postId,
                data.insertId,
                null
              );
            }

            return res.status(201).json({
              message: "Comment added successfully!",
              commentId: data.insertId,
            });
          }
        );
      }
    );
  });
};

// Delete comment
export const deleteComment = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const commentId = Number(req.params.id);

    if (!commentId) {
      return res.status(400).json("Comment ID is required!");
    }

    const checkQuery = `
      SELECT
        userId,
        postId
      FROM comments
      WHERE id = ?
    `;

    db.query(checkQuery, [commentId], (err, data) => {
      if (err) {
        console.log("CHECK COMMENT ERROR:", err);
        return res.status(500).json(err);
      }

      if (data.length === 0) {
        return res.status(404).json("Comment not found!");
      }

      const commentOwnerId = Number(data[0].userId);

      if (commentOwnerId !== Number(userInfo.id)) {
        return res.status(403).json(
          "You can delete only your own comment!"
        );
      }

      const deleteActivityQuery = `
        DELETE FROM activities
        WHERE type = 'comment'
        AND commentId = ?
        AND userId = ?
      `;

      db.query(
        deleteActivityQuery,
        [
          commentId,
          userInfo.id,
        ],
        (activityErr) => {
          if (activityErr) {
            console.log(
              "DELETE COMMENT ACTIVITY ERROR:",
              activityErr
            );
            return res.status(500).json(activityErr);
          }

          const deleteQuery = `
            DELETE FROM comments
            WHERE id = ?
          `;

          db.query(
            deleteQuery,
            [commentId],
            (err) => {
              if (err) {
                console.log("DELETE COMMENT ERROR:", err);
                return res.status(500).json(err);
              }

              return res.status(200).json(
                "Comment deleted successfully!"
              );
            }
          );
        }
      );
    });
  });
};