// apiKey.middleware.js

// Middleware that protects routes by requiring a valid API key.
// The key must be sent in the request header "x-api-key".

// Predefined valid API key.
// In a real application this would be stored in an environment variable.
const VALID_API_KEY = "secret-api-key-1234";

function apiKeyMiddleware(req, res, next) {
  /*
  Validate the API key provided in the request header.

  Reads the "x-api-key" header and compares it with the predefined key.
  Responds with 401 Unauthorized if the key is missing or incorrect.
  Calls next() if the key is valid.
  */
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== VALID_API_KEY) {
    return res.status(401).json({
      success: false,
      message: "Invalid or missing API key",
    });
  }

  next();
}

export default apiKeyMiddleware;
