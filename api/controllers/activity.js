import { db } from "../connect.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "socialsphere_secret_key";

// ========================================
// CREATE ACTIVITY
// ========================================

export const createActivity = (
  userId,
  type,
  targetUserId = null,
  postId = null
) => {
  const q = `
    INSERT INTO activities
    (
      userId,
      type,
      targetUserId,
      postId,
      createdAt
    )
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(
    q,
    [
      userId,
      type,
      targetUserId,
      postId,
    ],
    (err) => {
      if (err) {
        console.log(
          "CREATE ACTIVITY ERROR:",
          err
        );
      }
    }
  );
};


// ========================================
// GET LATEST ACTIVITIES
// ========================================

export const getActivities = (
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

      const currentUserId =
        userInfo.id;

      const q = `
        SELECT
          a.id AS activityId,
          a.userId,
          a.type AS activityType,
          a.targetUserId,
          a.postId,
          a.createdAt AS activityTime,

          actor.name AS name,
          actor.profilePic AS profilePic,

          target.name AS targetName

        FROM activities AS a

        JOIN users AS actor
          ON actor.id = a.userId

        LEFT JOIN users AS target
          ON target.id = a.targetUserId

        WHERE
          a.type IN (
            'follow',
            'post',
            'story',
            'comment'
          )

        ORDER BY a.createdAt DESC

        LIMIT 10
      `;

      db.query(
        q,
        [],
        (err, data) => {
          if (err) {
            console.log(
              "GET ACTIVITIES ERROR:",
              err
            );

            return res
              .status(500)
              .json(err);
          }

          const activities =
            data.map(
              (activity) => {

                let activityText = "";

                switch (
                  activity.activityType
                ) {
                  case "follow":
                    activityText =
                      `${activity.name} followed you`;
                    break;

                  case "post":
                    activityText =
                      `${activity.name} created a post`;
                    break;

                  case "story":
                    activityText =
                      `${activity.name} uploaded a story`;
                    break;

                  case "comment":
                    activityText =
                      `${activity.name} commented on a post`;
                    break;

                  default:
                    activityText = "";
                }

                return {
                  ...activity,
                  activityText,
                };
              }
            );

          return res
            .status(200)
            .json(activities);
        }
      );
    }
  );
};