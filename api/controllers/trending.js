import { db } from "../connect.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "socialsphere_secret_key";

export const getTrendingPosts = (req, res) => {
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
      SELECT
        p.id,
        p.desc,
        p.img,
        p.video,
        p.userId,
        p.createdAt,

        u.name,
        u.username,
        u.profilePic,

        COUNT(DISTINCT l.id) AS likesCount,
        COUNT(DISTINCT c.id) AS commentsCount,

        (
          (COUNT(DISTINCT l.id) * 3) +
          (COUNT(DISTINCT c.id) * 2) +
          GREATEST(
            0,
            24 - TIMESTAMPDIFF(HOUR, p.createdAt, NOW())
          )
        ) AS trendingScore

      FROM posts AS p

      JOIN users AS u
        ON u.id = p.userId

      LEFT JOIN likes AS l
        ON l.postId = p.id

      LEFT JOIN comments AS c
        ON c.postId = p.id

      WHERE p.userId != ?

      GROUP BY
        p.id,
        p.desc,
        p.img,
        p.video,
        p.userId,
        p.createdAt,
        u.name,
        u.username,
        u.profilePic

      ORDER BY
        trendingScore DESC,
        p.createdAt DESC

      LIMIT 5
    `;

    db.query(q, [currentUserId], (err, data) => {
      if (err) {
        console.log("GET TRENDING POSTS ERROR:", err);
        return res.status(500).json(err);
      }

      return res.status(200).json(data);
    });
  });
};