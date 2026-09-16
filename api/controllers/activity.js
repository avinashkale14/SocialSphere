import { db } from "../connect.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "socialsphere_secret_key";

// ======================================================
// CREATE ACTIVITY
// ======================================================
// userId       = actor
// type         = post | story | follow | like | comment
// targetUserId = user who should receive targeted activity
// postId       = related post
// commentId    = related comment
// storyId      = related story
//
// POST / STORY  -> global activity
// FOLLOW        -> only target user
// LIKE/COMMENT  -> only post owner
// ======================================================

export const createActivity = (
  userId,
  type,
  targetUserId = null,
  postId = null,
  commentId = null,
  storyId = null
) => {
  const q = `
    INSERT INTO activities
    (
      userId,
      type,
      targetUserId,
      postId,
      commentId,
      storyId,
      createdAt
    )
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    q,
    [
      userId,
      type,
      targetUserId,
      postId,
      commentId,
      storyId,
    ],
    (err) => {
      if (err) {
        console.log("CREATE ACTIVITY ERROR:", err);
      }
    }
  );
};

// ======================================================
// GET LATEST ACTIVITIES / NOTIFICATIONS
// ======================================================

export const getActivities = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const currentUserId = Number(userInfo.id);

    // ==================================================
    // VISIBILITY RULES
    // ==================================================
    //
    // 1. POST / STORY
    //    Global activity.
    //    Every other user can see it.
    //
    // 2. FOLLOW
    //    Targeted activity.
    //    Only the user being followed can see it.
    //
    // 3. LIKE / COMMENT
    //    Targeted activity.
    //    Only the owner of the post can see it.
    //
    // 4. Own activities
    //    Never show them to the actor himself.
    //
    // ==================================================

    const q = `
      SELECT
        a.id AS activityId,
        a.userId,
        a.type AS activityType,
        a.targetUserId,
        a.postId,
        a.commentId,
        a.storyId,
        a.createdAt AS activityTime,

        actor.name AS name,
        actor.username AS username,
        actor.profilePic AS profilePic,

        target.name AS targetName,
        target.username AS targetUsername,
        target.profilePic AS targetProfilePic

      FROM activities AS a

      JOIN users AS actor
        ON actor.id = a.userId

      LEFT JOIN users AS target
        ON target.id = a.targetUserId

      WHERE
        (
          a.type IN ('post', 'story')
          AND a.userId != ?
        )

        OR

        (
          a.type IN ('follow', 'like', 'comment')
          AND a.targetUserId = ?
          AND a.userId != ?
        )

      ORDER BY a.createdAt DESC
      LIMIT 20
    `;

    db.query(
      q,
      [
        currentUserId,
        currentUserId,
        currentUserId,
      ],
      (err, data) => {
        if (err) {
          console.log("GET ACTIVITIES ERROR:", err);
          return res.status(500).json(err);
        }

        const activities = data.map((activity) => {
          let activityText = "";

          switch (activity.activityType) {
            case "follow":
              activityText = `${activity.name} followed you`;
              break;

            case "like":
              activityText = `${activity.name} liked your post`;
              break;

            case "comment":
              activityText = `${activity.name} commented on your post`;
              break;

            case "post":
              activityText = `${activity.name} created a post`;
              break;

            case "story":
              activityText = `${activity.name} uploaded a story`;
              break;

            default:
              activityText = "";
          }

          return {
            ...activity,
            activityText,
          };
        });

        return res.status(200).json(activities);
      }
    );
  });
};
