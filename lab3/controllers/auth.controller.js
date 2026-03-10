// auth.controller.js

// Controller for authentication routes.
// Handles login and issues JWT tokens to valid users.

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "#middleware/auth.middleware";

// Hardcoded credentials for demonstration purposes.
// In a real application users would be stored in a database.
const VALID_USER = {
  username: "admin",
  password: "password",
};

function login(req, res) {
  /*
  Authenticate a user and return a JWT token.

  Reads username and password from the request body.
  Responds with 400 if fields are missing, 401 if credentials are wrong,
  and 200 with a signed JWT token if credentials are valid.
  */
  const { username, password } = req.body;

  // Reject the request if required fields are missing
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Fields 'username' and 'password' are required",
    });
  }

  // Validate credentials against the predefined user
  if (username !== VALID_USER.username || password !== VALID_USER.password) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password",
    });
  }

  // Sign a JWT token valid for 1 hour
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({
    success: true,
    token,
  });
}

export default { login };
