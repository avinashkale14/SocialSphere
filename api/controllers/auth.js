import { db } from "../connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "socialsphere_secret_key";

// Register
export const register = (req, res) => {
  const q = `
    SELECT *
    FROM users
    WHERE username = ?
  `;

  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      console.log("REGISTER ERROR:", err);
      return res.status(500).json(err);
    }

    if (data.length > 0) {
      return res.status(409).json("User already exists!");
    }

    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(
      req.body.password,
      salt
    );

    const insertQuery = `
      INSERT INTO users
      (
        username,
        email,
        password,
        name
      )
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    db.query(insertQuery, values, (err, data) => {
      if (err) {
        console.log("REGISTER INSERT ERROR:", err);
        return res.status(500).json(err);
      }

      return res.status(201).json(
        "User has been created successfully!"
      );
    });
  });
};

// Login
export const login = (req, res) => {
  const q = `
    SELECT *
    FROM users
    WHERE username = ?
  `;

  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      console.log("LOGIN DATABASE ERROR:", err);
      return res.status(500).json(err);
    }

    if (data.length === 0) {
      return res.status(404).json("User not found!");
    }

    const user = data[0];

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!checkPassword) {
      return res.status(400).json("Wrong password!");
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const { password, ...userWithoutPassword } = user;

    // Set JWT cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log(
      "LOGIN SUCCESS - Cookie created for user:",
      user.id
    );

    return res.status(200).json(
      userWithoutPassword
    );
  });
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.status(200).json(
    "User has been logged out successfully!"
  );
};