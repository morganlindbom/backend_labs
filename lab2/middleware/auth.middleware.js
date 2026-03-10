// auth.middleware.js

// Middleware that protects routes by requiring a valid JWT token.
// The token must be sent in the Authorization header as a Bearer token.

import jwt from "jsonwebtoken";

// Secret key used to verify JWT tokens.
// In a real application this would be stored in an environment variable.
export const JWT_SECRET = "super-secret-jwt-key-lab2";

function authMiddleware(req, res, next) {
  /*
  Validate the JWT token provided in the Authorization header.

  Reads the "Authorization" header and extracts the Bearer token.
  Responds with 403 Forbidden if the token is missing or invalid.
  Attaches the decoded payload to req.user and calls next() if valid.
  */
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

export default authMiddleware;
