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

    let values = [];

    // Profile page request
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

    // ------------------------------------------
    // GET POST DATA
    // ------------------------------------------

    const desc =
      req.body.desc?.trim() || "";

    const img =
      req.body.img || null;

    const video =
      req.body.video || null;

    const location =
      req.body.location?.trim() || null;

    const feeling =
      req.body.feeling || null;

    // ------------------------------------------
    // EMPTY POST CHECK
    // ------------------------------------------

    if (
      !desc &&
      !img &&
      !video &&
      !location &&
      !feeling
    ) {
      return res
        .status(400)
        .json("Post cannot be empty!");
    }

    // ------------------------------------------
    // INSERT POST
    // ------------------------------------------

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
        console.log(
          "ADD POST ERROR:",
          err
        );

        return res
          .status(500)
          .json(err);
      }

      // ------------------------------------------
      // CREATE ACTIVITY
      // ------------------------------------------

      createActivity(
        userInfo.id,
        "post",
        null,
        data.insertId
      );

      return res.status(201).json({
        message:
          "Post created successfully!",

        postId:
          data.insertId,
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
      return res
        .status(403)
        .json("Token is not valid!");
    }

    const postId =
      req.params.id;

    const desc =
      req.body.desc;

    // ------------------------------------------
    // DESCRIPTION CHECK
    // ------------------------------------------

    if (
      desc === undefined ||
      desc === null
    ) {
      return res
        .status(400)
        .json(
          "Post description is required!"
        );
    }

    // ------------------------------------------
    // CHECK POST OWNER
    // ------------------------------------------

    const checkQuery = `
      SELECT userId
      FROM posts
      WHERE id = ?
    `;

    db.query(
      checkQuery,
      [postId],
      (err, data) => {
        if (err) {
          console.log(
            "CHECK EDIT POST ERROR:",
            err
          );

          return res
            .status(500)
            .json(err);
        }

        if (data.length === 0) {
          return res
            .status(404)
            .json("Post not found!");
        }

        if (
          Number(data[0].userId) !==
          Number(userInfo.id)
        ) {
          return res
            .status(403)
            .json(
              "You can edit only your own post!"
            );
        }

        // --------------------------------------
        // UPDATE POST
        // --------------------------------------

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
              console.log(
                "EDIT POST ERROR:",
                err
              );

              return res
                .status(500)
                .json(err);
            }

            return res
              .status(200)
              .json({
                message:
                  "Post updated successfully!",
              });
          }
        );
      }
    );
  });
};


// ======================================================
// DELETE POST
// ======================================================

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res
        .status(403)
        .json("Token is not valid!");
    }

    const postId =
      req.params.id;

    // ------------------------------------------
    // CHECK POST OWNER
    // ------------------------------------------

    const checkQuery = `
      SELECT userId
      FROM posts
      WHERE id = ?
    `;

    db.query(
      checkQuery,
      [postId],
      (err, data) => {
        if (err) {
          console.log(
            "CHECK DELETE POST ERROR:",
            err
          );

          return res
            .status(500)
            .json(err);
        }

        if (data.length === 0) {
          return res
            .status(404)
            .json("Post not found!");
        }

        if (
          Number(data[0].userId) !==
          Number(userInfo.id)
        ) {
          return res
            .status(403)
            .json(
              "You can delete only your own post!"
            );
        }

        // --------------------------------------
        // DELETE COMMENTS
        // --------------------------------------

        const deleteCommentsQuery = `
          DELETE FROM comments
          WHERE postId = ?
        `;

        db.query(
          deleteCommentsQuery,
          [postId],
          (err) => {
            if (err) {
              console.log(
                "DELETE COMMENTS ERROR:",
                err
              );

              return res
                .status(500)
                .json(err);
            }

            // ----------------------------------
            // DELETE LIKES
            // ----------------------------------

            const deleteLikesQuery = `
              DELETE FROM likes
              WHERE postId = ?
            `;

            db.query(
              deleteLikesQuery,
              [postId],
              (err) => {
                if (err) {
                  console.log(
                    "DELETE LIKES ERROR:",
                    err
                  );

                  return res
                    .status(500)
                    .json(err);
                }

                // ------------------------------
                // DELETE ACTIVITIES
                // ------------------------------

                const deleteActivityQuery = `
                  DELETE FROM activities
                  WHERE postId = ?
                  AND type = 'post'
                `;

                db.query(
                  deleteActivityQuery,
                  [postId],
                  (err) => {
                    if (err) {
                      console.log(
                        "DELETE POST ACTIVITY ERROR:",
                        err
                      );

                      return res
                        .status(500)
                        .json(err);
                    }

                    // ------------------------------
                    // DELETE POST
                    // ------------------------------

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

                          return res
                            .status(500)
                            .json(err);
                        }

                        return res
                          .status(200)
                          .json({
                            message:
                              "Post deleted successfully!",
                          });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};