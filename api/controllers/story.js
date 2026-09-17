import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import { createActivity } from "./activity.js";

const JWT_SECRET = "socialsphere_secret_key";

// Get active stories
export const getStories = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const deleteExpiredActivitiesQuery = `
      DELETE a
      FROM activities AS a
      INNER JOIN stories AS s
        ON s.id = a.storyId
      WHERE a.type = 'story'
      AND s.expireAt IS NOT NULL
      AND s.expireAt <= NOW()
    `;

    db.query(
      deleteExpiredActivitiesQuery,
      (activityErr) => {
        if (activityErr) {
          console.log(
            "DELETE EXPIRED STORY ACTIVITIES ERROR:",
            activityErr
          );
          return res.status(500).json(activityErr);
        }

        // Delete expired stories
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
              return res.status(500).json(deleteErr);
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
                  return res.status(500).json(err);
                }

                return res.status(200).json(data);
              }
            );
          }
        );
      }
    );
  });
};

// Add story
export const addStory = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const img = req.body.img;

    if (!img) {
      return res.status(400).json(
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
          console.log("ADD STORY ERROR:", err);
          return res.status(500).json(err);
        }

        createActivity(
          userInfo.id,
          "story",
          null,
          null,
          null,
          data.insertId
        );

        return res.status(201).json({
          message:
            "Story uploaded successfully!",
          storyId:
            data.insertId,
        });
      }
    );
  });
};

// Delete story
export const deleteStory = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const storyId = Number(req.params.id);

    if (!storyId) {
      return res.status(400).json(
        "Story ID is required!"
      );
    }

    const checkQuery = `
      SELECT userId
      FROM stories
      WHERE id = ?
    `;

    db.query(checkQuery, [storyId], (err, data) => {
      if (err) {
        console.log("CHECK STORY ERROR:", err);
        return res.status(500).json(err);
      }

      if (data.length === 0) {
        return res.status(404).json("Story not found!");
      }

      if (Number(data[0].userId) !== Number(userInfo.id)) {
        return res.status(403).json(
          "You can delete only your own story!"
        );
      }

      const deleteActivityQuery = `
        DELETE FROM activities
        WHERE type = 'story'
        AND storyId = ?
      `;

      db.query(
        deleteActivityQuery,
        [storyId],
        (activityErr) => {
          if (activityErr) {
            console.log(
              "DELETE STORY ACTIVITY ERROR:",
              activityErr
            );
            return res.status(500).json(activityErr);
          }

          // Remove story views
          const deleteViewsQuery = `
            DELETE FROM story_views
            WHERE storyId = ?
          `;

          db.query(
            deleteViewsQuery,
            [storyId],
            (viewErr) => {
              if (viewErr) {
                console.log(
                  "DELETE STORY VIEWS ERROR:",
                  viewErr
                );
                return res.status(500).json(viewErr);
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
                    return res.status(500).json(err);
                  }

                  return res.status(200).json({
                    message:
                      "Story and related activity deleted successfully!",
                  });
                }
              );
            }
          );
        }
      );
    });
  });
};

// Add story view
export const addStoryView = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const storyId = Number(req.params.id);
    const viewerId = Number(userInfo.id);

    if (!storyId) {
      return res.status(400).json(
        "Story ID is required!"
      );
    }

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
          return res.status(500).json(err);
        }

        if (storyData.length === 0) {
          return res.status(404).json(
            "Story not found!"
          );
        }

        if (
          Number(storyData[0].userId) === viewerId
        ) {
          return res.status(200).json({
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
          VALUES (?, ?, NOW())
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
              return res.status(500).json(err);
            }

            return res.status(200).json({
              message:
                "Story view recorded.",
            });
          }
        );
      }
    );
  });
};

// Get story viewers
export const getStoryViewers = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const storyId = Number(req.params.id);

    if (!storyId) {
      return res.status(400).json(
        "Story ID is required!"
      );
    }

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
      ORDER BY sv.viewedAt DESC
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
          return res.status(500).json(err);
        }

        return res.status(200).json(data);
      }
    );
  });
};