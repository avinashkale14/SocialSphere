import { db } from "../connect.js";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  "socialsphere_secret_key";

// ======================================================
// GET LIKES
// ======================================================

export const getLikes = (
  req,
  res
) => {
  const q = `
    SELECT userId
    FROM likes
    WHERE postId = ?
  `;

  db.query(
    q,
    [req.query.postId],
    (err, data) => {
      if (err) {
        console.log(
          "GET LIKES ERROR:",
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

// ======================================================
// ADD LIKE
// ======================================================

export const addLike = (
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
    JWT_SECRET,
    (err, userInfo) => {
      if (err) {
        console.log(
          "LIKE JWT ERROR:",
          err.message
        );

        return res
          .status(403)
          .json(
            "Token is not valid!"
          );
      }

      const q = `
        SELECT *
        FROM likes
        WHERE userId = ?
        AND postId = ?
      `;

      db.query(
        q,
        [
          userInfo.id,
          req.body.postId,
        ],
        (err, existing) => {
          if (err) {
            return res
              .status(500)
              .json(err);
          }

          // Already liked
          if (
            existing.length > 0
          ) {
            return res
              .status(200)
              .json(
                "Post already liked."
              );
          }

          const insertQuery = `
            INSERT INTO likes
            (userId, postId)
            VALUES (?, ?)
          `;

          db.query(
            insertQuery,
            [
              userInfo.id,
              req.body.postId,
            ],
            (err) => {
              if (err) {
                console.log(
                  "ADD LIKE ERROR:",
                  err
                );

                return res
                  .status(500)
                  .json(err);
              }

              return res
                .status(200)
                .json(
                  "Post liked."
                );
            }
          );
        }
      );
    }
  );
};

// ======================================================
// DELETE LIKE
// ======================================================

export const deleteLike = (
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
    JWT_SECRET,
    (err, userInfo) => {
      if (err) {
        console.log(
          "UNLIKE JWT ERROR:",
          err.message
        );

        return res
          .status(403)
          .json(
            "Token is not valid!"
          );
      }

      const q = `
        DELETE FROM likes
        WHERE userId = ?
        AND postId = ?
      `;

      db.query(
        q,
        [
          userInfo.id,
          req.query.postId,
        ],
        (err) => {
          if (err) {
            console.log(
              "DELETE LIKE ERROR:",
              err
            );

            return res
              .status(500)
              .json(err);
          }

          return res
            .status(200)
            .json(
              "Post unliked."
            );
        }
      );
    }
  );
};