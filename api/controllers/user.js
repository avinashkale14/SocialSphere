import { db } from "../connect.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "socialsphere_secret_key";

// Get user by ID
export const getUser = (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json("User ID is required!");
  }

  const q = `
    SELECT
      id,
      username,
      email,
      name,
      coverPic,
      profilePic,
      city,
      website,
      instagram,
      linkedin,
      github
    FROM users
    WHERE id = ?
  `;

  db.query(q, [userId], (err, data) => {
    if (err) {
      console.log("GET USER ERROR:", err);
      return res.status(500).json(err);
    }

    if (data.length === 0) {
      return res.status(404).json("User not found!");
    }

    return res.status(200).json(data[0]);
  });
};

// Get all users for RightBar
export const getUsers = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const q = `
      SELECT
        u.id,
        u.username,
        u.name,
        u.profilePic,
        u.city,

        CASE
          WHEN r.followerUserId IS NOT NULL
          THEN true
          ELSE false
        END AS following

      FROM users AS u

      LEFT JOIN relationships AS r
        ON r.followedUserId = u.id
        AND r.followerUserId = ?

      WHERE u.id != ?

      ORDER BY u.name ASC

      LIMIT 10
    `;

    db.query(
      q,
      [userInfo.id, userInfo.id],
      (err, data) => {
        if (err) {
          console.log("GET USERS ERROR:", err);
          return res.status(500).json(err);
        }

        return res.status(200).json(data);
      }
    );
  });
};

// Get latest activities
export const getActivities = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const currentUserId = userInfo.id;

    const q = `
      SELECT *
      FROM (

        SELECT
          u.id AS activityId,
          u.id AS userId,
          u.name,
          u.profilePic,
          'profile' AS activityType,
          CONCAT(
            u.name,
            ' updated their profile'
          ) AS activityText,
          u.updatedAt AS activityTime

        FROM users AS u

        WHERE u.updatedAt IS NOT NULL


        UNION ALL


        SELECT
          p.id AS activityId,
          p.userId,
          u.name,
          u.profilePic,
          'post' AS activityType,
          CONCAT(
            u.name,
            ' created a post'
          ) AS activityText,
          p.createdAt AS activityTime

        FROM posts AS p

        JOIN users AS u
          ON u.id = p.userId


        UNION ALL


        SELECT
          s.id AS activityId,
          s.userId,
          u.name,
          u.profilePic,
          'story' AS activityType,
          CONCAT(
            u.name,
            ' uploaded a story'
          ) AS activityText,
          s.createdAt AS activityTime

        FROM stories AS s

        JOIN users AS u
          ON u.id = s.userId

        WHERE s.expireAt > NOW()


        UNION ALL


        SELECT
          c.id AS activityId,
          c.userId,
          u.name,
          u.profilePic,
          'comment' AS activityType,
          CONCAT(
            u.name,
            ' commented on a post'
          ) AS activityText,
          c.createdAt AS activityTime

        FROM comments AS c

        JOIN users AS u
          ON u.id = c.userId


        UNION ALL


        SELECT
          r.followerUserId AS activityId,
          r.followerUserId AS userId,
          u.name,
          u.profilePic,
          'follow' AS activityType,
          CONCAT(
            u.name,
            ' followed you'
          ) AS activityText,
          r.createdAt AS activityTime

        FROM relationships AS r

        JOIN users AS u
          ON u.id = r.followerUserId

        WHERE r.followedUserId = ?

      ) AS activities

      ORDER BY activityTime DESC

      LIMIT 10
    `;

    db.query(q, [currentUserId], (err, data) => {
      if (err) {
        console.log("GET ACTIVITIES ERROR:", err);
        return res.status(500).json(err);
      }

      return res.status(200).json(data);
    });
  });
};

// Update user
export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, JWT_SECRET, (err, userInfo) => {
    if (err) {
      console.log("UPDATE USER JWT ERROR:", err);
      return res.status(403).json("Token is not valid!");
    }

    const userId = req.params.id;

    if (Number(userId) !== Number(userInfo.id)) {
      return res
        .status(403)
        .json("You can update only your own profile!");
    }

    const getUserQuery = `
      SELECT
        profilePic,
        coverPic
      FROM users
      WHERE id = ?
    `;

    db.query(
      getUserQuery,
      [userId],
      (err, userData) => {
        if (err) {
          console.log("GET EXISTING USER ERROR:", err);
          return res.status(500).json(err);
        }

        if (userData.length === 0) {
          return res.status(404).json("User not found!");
        }

        const existingProfilePic =
          userData[0].profilePic;

        const existingCoverPic =
          userData[0].coverPic;

        const profilePic =
          req.body.profilePic ||
          existingProfilePic ||
          null;

        const coverPic =
          req.body.coverPic ||
          existingCoverPic ||
          null;

        const q = `
          UPDATE users
          SET
            name = ?,
            city = ?,
            website = ?,
            instagram = ?,
            linkedin = ?,
            github = ?,
            profilePic = ?,
            coverPic = ?,
            updatedAt = NOW()
          WHERE id = ?
        `;

        const values = [
          req.body.name?.trim() || "",
          req.body.city?.trim() || null,
          req.body.website?.trim() || null,

          req.body.instagram?.trim() || null,
          req.body.linkedin?.trim() || null,
          req.body.github?.trim() || null,

          profilePic,
          coverPic,

          userId,
        ];

        db.query(q, values, (err) => {
          if (err) {
            console.log("UPDATE USER ERROR:", err);
            return res.status(500).json(err);
          }

          return res
            .status(200)
            .json(
              "Profile has been updated successfully."
            );
        });
      }
    );
  });
};