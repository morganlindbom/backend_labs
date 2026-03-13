import { Router } from "express";
import webController from "#controllers/webController";
import tasksController from "#controllers/tasksController";

const router = Router();

router.get("/", webController.renderLandingPage);
router.get("/friday", webController.renderFridayPage);

router.get("/tasks", tasksController.listTasks);
router.get("/tasks/new", tasksController.renderNewTaskForm);
router.post("/tasks", tasksController.createTask);
router.get("/tasks/:id/edit", tasksController.renderEditTaskForm);
router.put("/tasks/:id", tasksController.updateTask);
router.delete("/tasks/:id", tasksController.deleteTask);
router.get("/tasks/:id", tasksController.viewTask);

export default router;
