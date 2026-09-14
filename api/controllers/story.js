import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import { createActivity } from "./activity.js";

const JWT_SECRET =
  "socialsphere_secret_key";

// ======================================================
// GET ACTIVE STORIES
// ======================================================

export const getStories = (req, res) => {
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
        return res
          .status(403)
          .json("Token is not valid!");
      }

      const deleteExpiredQuery = `
        DELETE FROM stories
        WHERE expireAt IS NOT NULL
        AND expireAt <= NOW()
      `;

      db.query(
        deleteExpiredQuery,
        (deleteErr) => {
          if (deleteErr) {
            console.log(
              "DELETE EXPIRED STORIES ERROR:",
              deleteErr
            );

            return res
              .status(500)
              .json(deleteErr);
          }

          const getStoriesQuery = `
            SELECT
              s.id,
              s.img,
              s.userId,
              s.createdAt,
              s.expireAt,
              u.name,
              u.profilePic
            FROM stories AS s
            JOIN users AS u
              ON u.id = s.userId
            WHERE s.expireAt > NOW()
            ORDER BY s.createdAt ASC
          `;

          db.query(
            getStoriesQuery,
            (err, data) => {
              if (err) {
                console.log(
                  "GET STORIES ERROR:",
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
        }
      );
    }
  );
};


// ======================================================
// ADD STORY
// ======================================================

export const addStory = (req, res) => {
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
        return res
          .status(403)
          .json("Token is not valid!");
      }

      const img =
        req.body.img;

      if (!img) {
        return res
          .status(400)
          .json(
            "Story image is required!"
          );
      }

      const query = `
        INSERT INTO stories
        (
          img,
          userId,
          createdAt,
          expireAt
        )
        VALUES
        (
          ?,
          ?,
          NOW(),
          DATE_ADD(NOW(), INTERVAL 24 HOUR)
        )
      `;

      db.query(
        query,
        [
          img,
          userInfo.id,
        ],
        (err, data) => {
          if (err) {
            console.log(
              "ADD STORY ERROR:",
              err
            );

            return res
              .status(500)
              .json(err);
          }

          // ------------------------------------------
          // CREATE STORY ACTIVITY
          // ------------------------------------------

          createActivity(
            userInfo.id,
            "story"
          );

          return res
            .status(201)
            .json({
              message:
                "Story uploaded successfully!",

              storyId:
                data.insertId,
            });
        }
      );
    }
  );
};


// ======================================================
// DELETE STORY
// ======================================================

export const deleteStory = (req, res) => {
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
        return res
          .status(403)
          .json("Token is not valid!");
      }

      const storyId =
        req.params.id;

      const checkQuery = `
        SELECT userId
        FROM stories
        WHERE id = ?
      `;

      db.query(
        checkQuery,
        [storyId],
        (err, data) => {
          if (err) {
            console.log(
              "CHECK STORY ERROR:",
              err
            );

            return res
              .status(500)
              .json(err);
          }

          if (data.length === 0) {
            return res
              .status(404)
              .json("Story not found!");
          }

          if (
            Number(data[0].userId) !==
            Number(userInfo.id)
          ) {
            return res
              .status(403)
              .json(
                "You can delete only your own story!"
              );
          }

          const deleteQuery = `
            DELETE FROM stories
            WHERE id = ?
          `;

          db.query(
            deleteQuery,
            [storyId],
            (err) => {
              if (err) {
                console.log(
                  "DELETE STORY ERROR:",
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
                    "Story deleted successfully!",
                });
            }
          );
        }
      );
    }
  );
};


// ======================================================
// ADD STORY VIEW
// ======================================================

export const addStoryView = (
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
        return res
          .status(403)
          .json("Token is not valid!");
      }

      const storyId =
        req.params.id;

      const viewerId =
        userInfo.id;

      const storyQuery = `
        SELECT userId
        FROM stories
        WHERE id = ?
      `;

      db.query(
        storyQuery,
        [storyId],
        (err, storyData) => {
          if (err) {
            console.log(
              "CHECK STORY FOR VIEW ERROR:",
              err
            );

            return res
              .status(500)
              .json(err);
          }

          if (
            storyData.length === 0
          ) {
            return res
              .status(404)
              .json(
                "Story not found!"
              );
          }

          if (
            Number(
              storyData[0].userId
            ) === Number(viewerId)
          ) {
            return res
              .status(200)
              .json({
                message:
                  "Story owner view ignored.",
              });
          }

          const viewQuery = `
            INSERT IGNORE INTO story_views
            (
              storyId,
              userId,
              viewedAt
            )
            VALUES
            (
              ?,
              ?,
              NOW()
            )
          `;

          db.query(
            viewQuery,
            [
              storyId,
              viewerId,
            ],
            (err) => {
              if (err) {
                console.log(
                  "ADD STORY VIEW ERROR:",
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
                    "Story view recorded.",
                });
            }
          );
        }
      );
    }
  );
};


// ======================================================
// GET STORY VIEWERS
// ======================================================

export const getStoryViewers = (
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
        return res
          .status(403)
          .json("Token is not valid!");
      }

      const storyId =
        req.params.id;

      const query = `
        SELECT
          sv.id,
          sv.storyId,
          sv.userId,
          sv.viewedAt,
          u.name,
          u.username,
          u.profilePic

        FROM story_views AS sv

        JOIN users AS u
          ON u.id = sv.userId

        JOIN stories AS s
          ON s.id = sv.storyId

        WHERE
          sv.storyId = ?
          AND s.userId = ?

        ORDER BY
          sv.viewedAt DESC
      `;

      db.query(
        query,
        [
          storyId,
          userInfo.id,
        ],
        (err, data) => {
          if (err) {
            console.log(
              "GET STORY VIEWERS ERROR:",
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
    }
  );
};