import jwt from "jsonwebtoken";

function verifyJWT(req, res, next) {
  // Client must send token in Authorization header with Bearer format.
  const authHeader = req.get("authorization");

  // Stop immediately if header is missing or malformed.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  // Remove "Bearer " prefix and keep only the raw JWT.
  const token = authHeader.substring(7);

  try {
    // Verify signature and expiration using secret from environment.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload to request so route handlers can use user data.
    req.user = decoded;
    return next();
  } catch {
    // Verification failed (invalid signature, expired token, etc.).
    return res.status(401).json({ error: "Invalid token" });
  }
}

export default verifyJWT;