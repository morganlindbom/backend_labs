function verifyAPIKey(req, res, next) {
  // API key can be sent either as query parameter (?apiKey=...) or as header (x-api-key).
  const queryApiKey = req.query.apiKey;
  const headerApiKey = req.get("x-api-key");

  // Prefer whichever value the client supplied.
  const suppliedApiKey = queryApiKey || headerApiKey;

  // Expected key is loaded from environment variables.
  const expectedApiKey = process.env.API_KEY;

  // Reject when key is missing or does not match configured key.
  if (!suppliedApiKey || suppliedApiKey !== expectedApiKey) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  // Key is valid, continue to the protected route handler.
  return next();
}

export default verifyAPIKey;