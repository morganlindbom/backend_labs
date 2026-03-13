import pool from "#db/database";

async function getAll() {
  const [rows] = await pool.query("SELECT * FROM items ORDER BY id ASC");
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query("SELECT * FROM items WHERE id = ?", [id]);
  return rows[0] || null;
}

async function create(taskInput) {
  const title = (taskInput.title || "").trim();
  const description = (taskInput.description || "").trim() || null;
  const status = taskInput.status || "pending";

  const [result] = await pool.query(
    "INSERT INTO items (title, description, status) VALUES (?, ?, ?)",
    [title, description, status]
  );

  return getById(result.insertId);
}

async function update(id, taskInput) {
  const title = (taskInput.title || "").trim();
  const description = (taskInput.description || "").trim() || null;
  const status = taskInput.status || "pending";

  const [result] = await pool.query(
    "UPDATE items SET title = ?, description = ?, status = ? WHERE id = ?",
    [title, description, status, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query("DELETE FROM items WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
