// tasks.controller.js

// The controller layer sits between the routes and the model.
// It handles HTTP request/response logic and delegates data operations
// to the model layer. It never accesses the data store directly.
import TaskModel from "../models/tasks.model.js";

function getAllTasks(req, res) {
  /*
  Return all tasks.

  This function retrieves all tasks from the model layer
  and returns them in JSON format to the client.
  */
  const tasks = TaskModel.getAll();

  res.status(200).json({
    success: true,
    data: tasks,
  });
}

function getTaskById(req, res) {
  /*
  Return a single task identified by its id.

  Reads the id from the URL parameter, asks the model for the matching
  task, and responds with 404 if no task is found.
  */
  const { id } = req.params;
  const task = TaskModel.getById(id);

  // Respond with 404 when the requested task does not exist
  if (!task) {
    return res.status(404).json({
      success: false,
      data: null,
      message: `Task with id ${id} not found`,
    });
  }

  res.status(200).json({
    success: true,
    data: task,
  });
}

function createTask(req, res) {
  /*
  Create a new task from the request body.

  Validates that a title is present before delegating creation to the
  model. Responds with 400 Bad Request if validation fails, otherwise
  201 Created with the new task.
  */
  const { title, completed } = req.body;

  // Title is required — reject the request if it is missing or empty
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Field 'title' is required and must be a non-empty string",
    });
  }

  const newTask = TaskModel.create({ title: title.trim(), completed });

  res.status(201).json({
    success: true,
    data: newTask,
  });
}

function updateTask(req, res) {
  /*
  Update an existing task by its id.

  Reads the id from the URL parameter and applies the fields provided
  in the request body. Responds with 404 if the task does not exist and
  400 if the request body contains no valid updatable fields.
  */
  const { id } = req.params;
  const { title, completed } = req.body;

  // Reject the request if neither updatable field is provided
  if (title === undefined && completed === undefined) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Request body must include at least 'title' or 'completed'",
    });
  }

  // Build an update object with only the fields that were supplied
  const updateFields = {};
  if (title !== undefined) updateFields.title = title.trim();
  if (completed !== undefined) updateFields.completed = completed;

  const updatedTask = TaskModel.update(id, updateFields);

  // Model returns null when the id does not match any task
  if (!updatedTask) {
    return res.status(404).json({
      success: false,
      data: null,
      message: `Task with id ${id} not found`,
    });
  }

  res.status(200).json({
    success: true,
    data: updatedTask,
  });
}

function deleteTask(req, res) {
  /*
  Delete a task by its id.

  Reads the id from the URL parameter and asks the model to remove the
  matching task. Responds with 404 if the task does not exist.
  */
  const { id } = req.params;
  const deletedTask = TaskModel.remove(id);

  // Model returns null when the id does not match any task
  if (!deletedTask) {
    return res.status(404).json({
      success: false,
      data: null,
      message: `Task with id ${id} not found`,
    });
  }

  res.status(200).json({
    success: true,
    data: deletedTask,
  });
}

export default {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
