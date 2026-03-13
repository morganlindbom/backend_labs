// models/itemsModel.js

import pool from "#db/database";

async function getAllItems() {
  /*
  """short description

  Fetch all items from the MySQL items table and return every row ordered by id.
  """
  */
  const [rows] = await pool.query("SELECT * FROM items ORDER BY id ASC");
  return rows;
}

async function getItemById(id) {
  /*
  """short description

  Fetch one item by its id and return null when no matching row exists.
  """
  */
  const [rows] = await pool.query("SELECT * FROM items WHERE id = ?", [id]);
  return rows[0] || null;
}

async function createItem(title, description, status) {
  /*
  """short description

  Insert a new item row and then fetch the created row so the API returns full data.
  """
  */
  const [result] = await pool.query(
    "INSERT INTO items (title, description, status) VALUES (?, ?, ?)",
    [title, description, status]
  );

  return getItemById(result.insertId);
}

async function updateItem(id, title, description, status) {
  /*
  """short description

  Update the selected item fields for the given id and return the updated row or null.
  """
  */
  const [result] = await pool.query(
    "UPDATE items SET title = ?, description = ?, status = ? WHERE id = ?",
    [title, description, status, id]
  );

  // When affectedRows is zero, no record matched the provided id.
  if (result.affectedRows === 0) {
    return null;
  }

  return getItemById(id);
}

async function deleteItem(id) {
  /*
  """short description

  Delete one item by id and return true when a row was removed, otherwise false.
  """
  */
  const [result] = await pool.query("DELETE FROM items WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

export default {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};