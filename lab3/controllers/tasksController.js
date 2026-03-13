import tasksModel from "#models/tasksModel";

async function listTasks(req, res) {
  try {
    const tasks = await tasksModel.getAll();
    return res.render("tasks/list", { tasks });
  } catch {
    req.flash("error", "Could not load tasks");
    return res.render("tasks/list", { tasks: [] });
  }
}

async function viewTask(req, res) {
  try {
    const id = Number(req.params.id);
    const task = await tasksModel.getById(id);

    if (!task) {
      req.flash("error", "Task not found");
      return res.redirect("/tasks");
    }

    return res.render("tasks/view", { task });
  } catch {
    req.flash("error", "Could not load task");
    return res.redirect("/tasks");
  }
}

function renderNewTaskForm(req, res) {
  return res.render("tasks/new");
}

async function createTask(req, res) {
  try {
    await tasksModel.create(req.body);
    req.flash("success", "Task created");
    return res.redirect("/tasks");
  } catch {
    req.flash("error", "Could not create task");
    return res.redirect("/tasks/new");
  }
}

async function renderEditTaskForm(req, res) {
  try {
    const id = Number(req.params.id);
    const task = await tasksModel.getById(id);

    if (!task) {
      req.flash("error", "Task not found");
      return res.redirect("/tasks");
    }

    return res.render("tasks/edit", { task });
  } catch {
    req.flash("error", "Could not load task");
    return res.redirect("/tasks");
  }
}

async function updateTask(req, res) {
  try {
    const id = Number(req.params.id);
    const updated = await tasksModel.update(id, req.body);

    if (!updated) {
      req.flash("error", "Task not found");
      return res.redirect("/tasks");
    }

    req.flash("success", "Task updated");
    return res.redirect("/tasks");
  } catch {
    req.flash("error", "Could not update task");
    return res.redirect(`/tasks/${req.params.id}/edit`);
  }
}

async function deleteTask(req, res) {
  try {
    const id = Number(req.params.id);
    await tasksModel.remove(id);
    req.flash("success", "Task deleted");
    return res.redirect("/tasks");
  } catch {
    req.flash("error", "Could not delete task");
    return res.redirect("/tasks");
  }
}

export default {
  listTasks,
  viewTask,
  renderNewTaskForm,
  createTask,
  renderEditTaskForm,
  updateTask,
  deleteTask,
};
