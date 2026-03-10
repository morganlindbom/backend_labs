// server.js

// Entry point for the application.
// Creates the Express server, registers middleware, mounts routes,
// and starts listening on the configured port.

import express from "express";
import helmet from "helmet";
import taskRoutes from "#routes/tasks.routes";
import authRoutes from "#routes/auth.routes";
import apiKeyMiddleware from "#middleware/apiKey.middleware";
import authMiddleware from "#middleware/auth.middleware";

const app = express();
const PORT = 3000;

// Apply Helmet to set secure HTTP response headers.
app.use(helmet());

// Disable the Express signature header to avoid leaking server info.
app.disable("x-powered-by");

// Middleware: parse incoming requests with JSON payloads.
// This makes req.body available for POST and PUT requests.
app.use(express.json());

// Format JSON responses with indentation.
// Makes API output easier to read in the browser.
app.set("json spaces", 2);

// Mount the auth router under /auth.
// Login does not require an API key or JWT.
app.use("/auth", authRoutes);

// Mount the tasks router under /api/tasks.
// All task routes require a valid API key.
app.use("/api/tasks", apiKeyMiddleware, taskRoutes);

// Protected example route — requires a valid JWT token.
app.get("/api/protected", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Hello ${req.user.username}, you have access to this protected route.`,
  });
});

// Start the HTTP server and begin listening for incoming connections
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Tasks endpoint:     http://localhost:${PORT}/api/tasks`);
  console.log(`Auth endpoint:      http://localhost:${PORT}/auth/login`);
  console.log(`Protected endpoint: http://localhost:${PORT}/api/protected`);
});