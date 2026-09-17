import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import { createActivity } from "./activity.js";

const JWT_SECRET = "socialsphere_secret_key";

// Get relationships
export const getRelationships = (req, res) => {
  const userId = Number(req.query.userId);

  if (!userId) {
    return res.status(400).json("User ID is required!");
  }

  const q = `
    SELECT
      followerUserId,
      followedUserId
    FROM relationships
    WHERE followedUserId = ?
  `;

  db.query(q, [userId], (err, data) => {
    if (err) {
      console.log("GET RELATIONSHIPS ERROR:", err);
      return res.status(500).json(err);
    }

    return res.status(200).json(data);
  });
};

// Add relationship / follow
export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  const followedUserId = Number(req.body.userId);

  if (!followedUserId) {
    return res.status(400).json("User ID is required!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const followerUserId = Number(userInfo.id);

    if (followerUserId === followedUserId) {
      return res.status(400).json(
        "You cannot follow yourself!"
      );
    }

    const checkUserQuery = `
      SELECT id
      FROM users
      WHERE id = ?
    `;

    db.query(
      checkUserQuery,
      [followedUserId],
      (err, userData) => {
        if (err) {
          console.log("CHECK USER ERROR:", err);
          return res.status(500).json(err);
        }

        if (userData.length === 0) {
          return res.status(404).json(
            "User not found!"
          );
        }

        const checkRelationshipQuery = `
          SELECT id
          FROM relationships
          WHERE followerUserId = ?
          AND followedUserId = ?
          LIMIT 1
        `;

        db.query(
          checkRelationshipQuery,
          [
            followerUserId,
            followedUserId,
          ],
          (err, existingData) => {
            if (err) {
              console.log(
                "CHECK RELATIONSHIP ERROR:",
                err
              );
              return res.status(500).json(err);
            }

            if (existingData.length > 0) {
              return res.status(409).json(
                "You are already following this user!"
              );
            }

            const insertQuery = `
              INSERT INTO relationships
              (
                followerUserId,
                followedUserId
              )
              VALUES (?, ?)
            `;

            db.query(
              insertQuery,
              [
                followerUserId,
                followedUserId,
              ],
              (err, result) => {
                if (err) {
                  console.log(
                    "ADD RELATIONSHIP ERROR:",
                    err
                  );
                  return res.status(500).json(err);
                }

                createActivity(
                  followerUserId,
                  "follow",
                  followedUserId,
                  null,
                  null,
                  null
                );

                return res.status(200).json({
                  message:
                    "User has been followed.",
                  relationshipId:
                    result.insertId,
                });
              }
            );
          }
        );
      }
    );
  });
};

// Delete relationship / unfollow
export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  const targetUserId = Number(req.query.userId);

  if (!targetUserId) {
    return res.status(400).json(
      "User ID is required!"
    );
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const followerUserId = Number(userInfo.id);

    const deleteRelationshipQuery = `
      DELETE FROM relationships
      WHERE followerUserId = ?
      AND followedUserId = ?
    `;

    db.query(
      deleteRelationshipQuery,
      [
        followerUserId,
        targetUserId,
      ],
      (err, result) => {
        if (err) {
          console.log(
            "DELETE RELATIONSHIP ERROR:",
            err
          );
          return res.status(500).json(err);
        }

        if (result.affectedRows > 0) {
          const deleteActivityQuery = `
            DELETE FROM activities
            WHERE type = 'follow'
            AND userId = ?
            AND targetUserId = ?
          `;

          db.query(
            deleteActivityQuery,
            [
              followerUserId,
              targetUserId,
            ],
            (activityErr) => {
              if (activityErr) {
                console.log(
                  "DELETE FOLLOW ACTIVITY ERROR:",
                  activityErr
                );
              }
            }
          );
        }

        return res.status(200).json({
          message:
            "User has been unfollowed.",
          deleted:
            result.affectedRows > 0,
        });
      }
    );
  });
};