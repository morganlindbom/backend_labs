// tasks.routes.js

// This file defines all routes for the /api/tasks resource.
// Each route maps an HTTP method + path to the corresponding
// controller function that handles the request.
import { Router } from "express";
import TaskController from "#controllers/tasks.controller";

const router = Router();

// GET /api/tasks — retrieve the full list of tasks
router.get("/", TaskController.getAllTasks);

// GET /api/tasks/:id — retrieve a single task by id
router.get("/:id", TaskController.getTaskById);

// POST /api/tasks — create a new task
router.post("/", TaskController.createTask);

// PUT /api/tasks/:id — update an existing task by id
router.put("/:id", TaskController.updateTask);

// DELETE /api/tasks/:id — delete a task by id
router.delete("/:id", TaskController.deleteTask);

export default router;
