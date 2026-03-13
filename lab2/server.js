// server.js

// Entry point for the application.
// Creates the Express server, registers middleware, mounts routes,
// and starts listening on the configured port.

import express from "express";
import itemsRoutes from "#routes/itemsRoutes";

const app = express();
const PORT = 3000;

// Middleware: parse incoming requests with JSON payloads.
// This makes req.body available for POST and PUT requests.
app.use(express.json());

// Format JSON responses with indentation.
// Makes API output easier to read in the browser.
app.set("json spaces", 2);

// Mount the items router under /items.
// All routes in itemsRoutes.js are now relative to this path.
app.use("/items", itemsRoutes);

function logServerStartup() {
  /*
  """short description

  Print startup information so API routes and curl examples are visible on boot.
  """
  */
  console.log("================================================");
  console.log("  Lab 1 - REST API");
  console.log("================================================");
  console.log(`\nServer running:\nhttp://localhost:${PORT}\n`);
  console.log("API");
  console.log(`GET    /items`);
  console.log(`GET    /items/:id`);
  console.log(`POST   /items`);
  console.log(`PUT    /items/:id`);
  console.log(`DELETE /items/:id`);
  console.log("\nCURL EXAMPLES");
  console.log(`curl http://localhost:${PORT}/items`);
  console.log(`curl http://localhost:${PORT}/items/1`);
  console.log(`curl -X POST http://localhost:${PORT}/items -H "Content-Type: application/json" -d "{\\"title\\":\\"New item\\",\\"description\\":\\"Created from curl\\",\\"status\\":\\"pending\\"}"`);
  console.log(`curl -X PUT http://localhost:${PORT}/items/1 -H "Content-Type: application/json" -d "{\\"title\\":\\"Updated item\\",\\"description\\":\\"Updated from curl\\",\\"status\\":\\"in_progress\\"}"`);
  console.log(`curl -X DELETE http://localhost:${PORT}/items/1`);
  console.log("\n================================================\n");
}

// Start the HTTP server and begin listening for incoming connections
app.listen(PORT, logServerStartup);