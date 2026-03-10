// server.js

// Entry point for the application.
// Creates the Express server, registers middleware, mounts routes,
// and starts listening on the configured port.

import express from "express";
import taskRoutes from "./routes/tasks.routes.js";

const app = express();
const PORT = 3000;

// Middleware: parse incoming requests with JSON payloads.
// This makes req.body available for POST and PUT requests.
app.use(express.json());

// Format JSON responses with indentation.
// Makes API output easier to read in the browser.
app.set("json spaces", 2);

// Mount the tasks router under /api/tasks.
// All routes defined in tasks.routes.js are now relative to this path.
app.use("/api/tasks", taskRoutes);

// Start the HTTP server and begin listening for incoming connections
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Tasks endpoint: http://localhost:${PORT}/api/tasks`);
});