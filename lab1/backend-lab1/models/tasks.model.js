// tasks.model.js

// The model layer is responsible for all data operations.
// It reads from and writes to the in-memory data store (tasks.data.js).
import tasks from "../data/tasks.data.js";

// Tracks the next id to assign when a new task is created.
// Calculated once from the existing data to avoid id collisions.
let nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

function getAll() {
  /*
  Return all tasks.

  This function retrieves the full array of tasks from the data store
  and returns it to the caller (the controller layer).
  */
  return tasks;
}

function getById(id) {
  /*
  Return a single task by its id.

  This function searches the tasks array for a task whose id matches
  the provided id. Returns undefined if no match is found.
  */
  // Convert id to a number because URL params arrive as strings
  return tasks.find((task) => task.id === Number(id));
}

function create(taskData) {
  /*
  Create and persist a new task.

  Assigns a unique incremental id to the new task, appends it to the
  in-memory store, and returns the created task object.
  */
  const newTask = {
    id: nextId++,
    title: taskData.title,
    completed: taskData.completed ?? false, // Default to false if not provided
  };

  tasks.push(newTask);
  return newTask;
}

function update(id, taskData) {
  /*
  Update an existing task by its id.

  Finds the task with the given id, applies the provided fields, and
  returns the updated task. Returns null if no task with that id exists.
  */
  const index = tasks.findIndex((task) => task.id === Number(id));

  // Return null to signal "not found" to the controller
  if (index === -1) return null;

  // Merge only the fields that were provided in the request body
  tasks[index] = { ...tasks[index], ...taskData };
  return tasks[index];
}

function remove(id) {
  /*
  Delete a task by its id.

  Removes the task with the given id from the in-memory store.
  Returns the deleted task, or null if it did not exist.
  */
  const index = tasks.findIndex((task) => task.id === Number(id));

  // Return null to signal "not found" to the controller
  if (index === -1) return null;

  // splice removes the element at 'index' and returns it in an array
  const [deletedTask] = tasks.splice(index, 1);
  return deletedTask;
}

export default { getAll, getById, create, update, remove };
