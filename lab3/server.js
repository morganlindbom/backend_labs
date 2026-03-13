// server.js

// Entry point for the application.
// Creates the Express server, registers middleware, mounts routes,
// and starts listening on the configured port.

import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import helmet from "helmet";
import session from "express-session";
import flash from "connect-flash";
import methodOverride from "method-override";
import itemsRoutes from "#routes/itemsRoutes";
import webRoutes from "#routes/webRoutes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("json spaces", 2);

app.use(
  session({
    secret: "lab3secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", webRoutes);

// Keep existing Lab2 REST API endpoints.
app.use("/api/items", itemsRoutes);

function logServerStartup() {
  /*
  """short description

  Print startup information so API routes and curl examples are visible on boot.
  """
  */
  console.log("================================================");
  console.log("  Lab 3 - Express + EJS + CRUD + Sessions");
  console.log("================================================");
  console.log(`\nServer running:\nhttp://localhost:${PORT}\n`);
  console.log("WEB");
  console.log(`GET    /`);
  console.log(`GET    /friday`);
  console.log(`GET    /tasks`);
  console.log(`GET    /tasks/new`);
  console.log(`POST   /tasks`);
  console.log(`GET    /tasks/:id`);
  console.log(`GET    /tasks/:id/edit`);
  console.log(`PUT    /tasks/:id`);
  console.log(`DELETE /tasks/:id`);
  console.log("\nAPI");
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