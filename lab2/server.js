// server.js

// Entry point for the application.
// Creates the Express server, registers middleware, mounts routes,
// and starts listening on the configured port.

import "dotenv/config";
import express from "express";
import helmet from "helmet";
import itemsRoutes from "#routes/itemsRoutes";

// Fail fast on startup if required secrets or database settings are missing.
const requiredEnvVars = [
  "API_KEY",
  "JWT_SECRET",
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
];

for (const envVarName of requiredEnvVars) {
  if (!process.env[envVarName]) {
    throw new Error(`Missing required environment variable: ${envVarName}`);
  }
}

const app = express();
const PORT = 3000;

app.disable("x-powered-by");

// Helmet adds common HTTP security headers for the whole application.
app.use(helmet());

// Middleware: parse incoming requests with JSON payloads.
// This makes req.body available for POST and PUT requests.
app.use(express.json());

// Format JSON responses with indentation.
// Makes API output easier to read in the browser.
app.set("json spaces", 2);

// Mount the items router under /api/items.
// All routes in itemsRoutes.js are now relative to this path.
app.use("/api/items", itemsRoutes);

function logServerStartup() {
  /*
  """short description

  Print startup information so API routes and curl examples are visible on boot.
  """
  */
  console.log("================================================");
  console.log("  Lab 2 - Secured REST API");
  console.log("================================================");
  console.log(`\nServer running:\nhttp://localhost:${PORT}\n`);
  console.log("API");
  console.log(`GET    /api/items`);
  console.log(`GET    /api/items/:id`);
  console.log(`POST   /api/items`);
  console.log(`PUT    /api/items/:id`);
  console.log(`DELETE /api/items/:id`);
  console.log(`GET    /api/items/status/:status`);
  console.log(`GET    /api/items/search/:title`);
  console.log(`POST   /api/items/login`);
  console.log(`GET    /api/items/secure/api-key`);
  console.log(`GET    /api/items/secure/jwt`);
  console.log("\nCURL EXAMPLES");
  console.log(`curl http://localhost:${PORT}/api/items`);
  console.log(`curl http://localhost:${PORT}/api/items/1`);
  console.log(`curl http://localhost:${PORT}/api/items/status/pending`);
  console.log(`curl http://localhost:${PORT}/api/items/search/task`);
  console.log(`curl http://localhost:${PORT}/api/items/secure/api-key?apiKey=<your-api-key>`);
  console.log(`curl -X POST http://localhost:${PORT}/api/items/login -H "Content-Type: application/json" -d "{\\"username\\":\\"doe\\",\\"password\\":\\"doe\\"}"`);
  console.log(`curl http://localhost:${PORT}/api/items/secure/jwt -H "Authorization: Bearer <token>"`);
  console.log(`curl -X POST http://localhost:${PORT}/api/items -H "Content-Type: application/json" -d "{\\"title\\":\\"New item\\",\\"description\\":\\"Created from curl\\",\\"status\\":\\"pending\\"}"`);
  console.log(`curl -X PUT http://localhost:${PORT}/api/items/1 -H "Content-Type: application/json" -d "{\\"title\\":\\"Updated item\\",\\"description\\":\\"Updated from curl\\",\\"status\\":\\"in_progress\\"}"`);
  console.log(`curl -X DELETE http://localhost:${PORT}/api/items/1`);
  console.log("\n================================================\n");
}

// Start the HTTP server and begin listening for incoming connections
app.listen(PORT, logServerStartup);