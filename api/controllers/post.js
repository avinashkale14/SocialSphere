import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import { createActivity } from "./activity.js";

const JWT_SECRET = "socialsphere_secret_key";

// ======================================================
// GET ALL POSTS
// ======================================================

export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    let q = `
      SELECT
        p.*,
        u.id AS userId,
        u.name,
        u.profilePic
      FROM posts AS p
      JOIN users AS u
        ON u.id = p.userId
    `;

    const values = [];

    if (req.query.userId) {
      q += ` WHERE p.userId = ? `;
      values.push(req.query.userId);
    }

    q += ` ORDER BY p.createdAt DESC `;

    db.query(q, values, (err, data) => {
      if (err) {
        console.log("GET POSTS ERROR:", err);
        return res.status(500).json(err);
      }

      return res.status(200).json(data);
    });
  });
};

// ======================================================
// ADD POST
// ======================================================

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const desc = req.body.desc?.trim() || "";
    const img = req.body.img || null;
    const video = req.body.video || null;
    const location = req.body.location?.trim() || null;
    const feeling = req.body.feeling || null;

    if (!desc && !img && !video && !location && !feeling) {
      return res.status(400).json("Post cannot be empty!");
    }

    const q = `
      INSERT INTO posts
      (
        \`desc\`,
        img,
        video,
        location,
        feeling,
        userId,
        createdAt
      )
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      desc,
      img,
      video,
      location,
      feeling,
      userInfo.id,
    ];

    db.query(q, values, (err, data) => {
      if (err) {
        console.log("ADD POST ERROR:", err);
        return res.status(500).json(err);
      }

      // POST activity is global.
      createActivity(
        userInfo.id,
        "post",
        null,
        data.insertId,
        null,
        null
      );

      return res.status(201).json({
        message: "Post created successfully!",
        postId: data.insertId,
      });
    });
  });
};

// ======================================================
// EDIT POST
// ======================================================

export const editPost = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const postId = Number(req.params.id);
    const desc = req.body.desc;

    if (desc === undefined || desc === null) {
      return res.status(400).json(
        "Post description is required!"
      );
    }

    const checkQuery = `
      SELECT userId
      FROM posts
      WHERE id = ?
    `;

    db.query(checkQuery, [postId], (err, data) => {
      if (err) {
        console.log("CHECK EDIT POST ERROR:", err);
        return res.status(500).json(err);
      }

      if (data.length === 0) {
        return res.status(404).json("Post not found!");
      }

      if (Number(data[0].userId) !== Number(userInfo.id)) {
        return res.status(403).json(
          "You can edit only your own post!"
        );
      }

      const updateQuery = `
        UPDATE posts
        SET \`desc\` = ?
        WHERE id = ?
      `;

      db.query(
        updateQuery,
        [
          desc.trim(),
          postId,
        ],
        (err) => {
          if (err) {
            console.log("EDIT POST ERROR:", err);
            return res.status(500).json(err);
          }

          return res.status(200).json({
            message: "Post updated successfully!",
          });
        }
      );
    });
  });
};

// ======================================================
// DELETE POST
// ======================================================
// Deletes:
// - all comments
// - all likes
// - post activity
// - like activities
// - comment activities
// - finally the post
// ======================================================

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const postId = Number(req.params.id);

    if (!postId) {
      return res.status(400).json("Post ID is required!");
    }

    const checkQuery = `
      SELECT userId
      FROM posts
      WHERE id = ?
    `;

    db.query(checkQuery, [postId], (err, data) => {
      if (err) {
        console.log("CHECK DELETE POST ERROR:", err);
        return res.status(500).json(err);
      }

      if (data.length === 0) {
        return res.status(404).json("Post not found!");
      }

      if (Number(data[0].userId) !== Number(userInfo.id)) {
        return res.status(403).json(
          "You can delete only your own post!"
        );
      }

      // First remove every activity connected to this post.
      // This includes:
      // post + like + comment activities.
      const deleteActivitiesQuery = `
        DELETE FROM activities
        WHERE postId = ?
      `;

      db.query(
        deleteActivitiesQuery,
        [postId],
        (activityErr) => {
          if (activityErr) {
            console.log(
              "DELETE POST ACTIVITIES ERROR:",
              activityErr
            );
            return res.status(500).json(activityErr);
          }

          // Remove comments.
          const deleteCommentsQuery = `
            DELETE FROM comments
            WHERE postId = ?
          `;

          db.query(
            deleteCommentsQuery,
            [postId],
            (commentErr) => {
              if (commentErr) {
                console.log(
                  "DELETE POST COMMENTS ERROR:",
                  commentErr
                );
                return res.status(500).json(commentErr);
              }

              // Remove likes.
              const deleteLikesQuery = `
                DELETE FROM likes
                WHERE postId = ?
              `;

              db.query(
                deleteLikesQuery,
                [postId],
                (likeErr) => {
                  if (likeErr) {
                    console.log(
                      "DELETE POST LIKES ERROR:",
                      likeErr
                    );
                    return res.status(500).json(likeErr);
                  }

                  // Finally remove the post.
                  const deletePostQuery = `
                    DELETE FROM posts
                    WHERE id = ?
                  `;

                  db.query(
                    deletePostQuery,
                    [postId],
                    (err) => {
                      if (err) {
                        console.log(
                          "DELETE POST ERROR:",
                          err
                        );
                        return res.status(500).json(err);
                      }

                      return res.status(200).json({
                        message:
                          "Post and related activities deleted successfully!",
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
};
