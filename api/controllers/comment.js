import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import { createActivity } from "./activity.js";

// ==========================================
// GET COMMENTS
// ==========================================

export const getComments = (
  req,
  res
) => {
  const postId =
    req.query.postId;

  if (!postId) {
    return res
      .status(400)
      .json(
        "Post ID is required!"
      );
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

  db.query(
    q,
    [postId],
    (err, data) => {
      if (err) {
        console.log(
          "GET COMMENTS ERROR:",
          err
        );

        return res
          .status(500)
          .json(err);
      }

      return res
        .status(200)
        .json(data);
    }
  );
};


// ==========================================
// ADD COMMENT
// ==========================================

export const addComment = (
  req,
  res
) => {
  const token =
    req.cookies.accessToken;

  if (!token) {
    return res
      .status(401)
      .json("Not logged in!");
  }

  jwt.verify(
    token,
    "socialsphere_secret_key",
    (err, userInfo) => {
      if (err) {
        return res
          .status(403)
          .json("Token is not valid!");
      }

      if (
        !req.body.desc ||
        !req.body.postId
      ) {
        return res
          .status(400)
          .json(
            "Comment and postId are required!"
          );
      }

      const q = `
        INSERT INTO comments
        (
          \`desc\`,
          createdAt,
          userId,
          postId
        )
        VALUES (?, NOW(), ?, ?)
      `;

      const values = [
        req.body.desc.trim(),
        userInfo.id,
        req.body.postId,
      ];

      db.query(
        q,
        values,
        (err, data) => {
          if (err) {
            console.log(
              "ADD COMMENT ERROR:",
              err
            );

            return res
              .status(500)
              .json(err);
          }

          // ------------------------------------------
          // CREATE COMMENT ACTIVITY
          // ------------------------------------------

          createActivity(
            userInfo.id,
            "comment",
            null,
            req.body.postId
          );

          return res
            .status(200)
            .json({
              message:
                "Comment added successfully!",

              commentId:
                data.insertId,
            });
        }
      );
    }
  );
};


// ==========================================
// DELETE COMMENT
// ==========================================

export const deleteComment = (
  req,
  res
) => {
  const token =
    req.cookies.accessToken;

  if (!token) {
    return res
      .status(401)
      .json("Not logged in!");
  }

  jwt.verify(
    token,
    "socialsphere_secret_key",
    (err, userInfo) => {
      if (err) {
        return res
          .status(403)
          .json("Token is not valid!");
      }

      const commentId =
        req.params.id;

      // ------------------------------------------
      // CHECK COMMENT
      // ------------------------------------------

      const checkQuery = `
        SELECT userId, postId
        FROM comments
        WHERE id = ?
      `;

      db.query(
        checkQuery,
        [commentId],
        (err, data) => {
          if (err) {
            console.log(
              "CHECK COMMENT ERROR:",
              err
            );

            return res
              .status(500)
              .json(err);
          }

          if (
            data.length === 0
          ) {
            return res
              .status(404)
              .json(
                "Comment not found!"
              );
          }

          // ------------------------------------------
          // CHECK OWNER
          // ------------------------------------------

          if (
            Number(data[0].userId) !==
            Number(userInfo.id)
          ) {
            return res
              .status(403)
              .json(
                "You can delete only your own comment!"
              );
          }

          // ------------------------------------------
          // DELETE COMMENT ACTIVITY
          // ------------------------------------------

          const deleteActivityQuery = `
            DELETE FROM activities
            WHERE type = 'comment'
            AND userId = ?
            AND postId = ?
          `;

          db.query(
            deleteActivityQuery,
            [
              userInfo.id,
              data[0].postId,
            ],
            (activityErr) => {
              if (activityErr) {
                console.log(
                  "DELETE COMMENT ACTIVITY ERROR:",
                  activityErr
                );

                return res
                  .status(500)
                  .json(activityErr);
              }

              // ------------------------------------------
              // DELETE COMMENT
              // ------------------------------------------

              const deleteQuery = `
                DELETE FROM comments
                WHERE id = ?
              `;

              db.query(
                deleteQuery,
                [commentId],
                (err) => {
                  if (err) {
                    console.log(
                      "DELETE COMMENT ERROR:",
                      err
                    );

                    return res
                      .status(500)
                      .json(err);
                  }

                  return res
                    .status(200)
                    .json(
                      "Comment deleted successfully!"
                    );
                }
              );
            }
          );
        }
      );
    }
  );
};