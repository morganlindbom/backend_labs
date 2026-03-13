// controllers/itemsController.js

import itemsModel from "#models/itemsModel";

const validStatuses = ["pending", "in_progress", "done"];

function validateItemPayload(body) {
  /*
  """short description

  Validate and normalize item payload fields, returning a sanitized object or an error message.
  """
  */
  const { title, description = null, status = "pending" } = body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return { error: "Title is required and must be a non-empty string" };
  }

  // Description maps to a TEXT column and must be string or null.
  if (description !== null && typeof description !== "string") {
    return { error: "Description must be a string or null" };
  }

  if (typeof status !== "string" || !validStatuses.includes(status)) {
    return {
      error: "Status must be one of: pending, in_progress, done",
    };
  }

  return {
    data: {
      title: title.trim(),
      description,
      status,
    },
  };
}

async function getAllItems(req, res) {
  /*
  """short description

  Return all items from the database and respond with a consistent JSON payload.
  """
  */
  try {
    const items = await itemsModel.getAllItems();
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getItemById(req, res) {
  /*
  """short description

  Return one item by id and send a not found response when the item does not exist.
  """
  */
  try {
    const id = Number(req.params.id);
    const item = await itemsModel.getItemById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function createItem(req, res) {
  /*
  """short description

  Validate request input and create a new item row, then return the created record.
  """
  */
  try {
    const validation = validateItemPayload(req.body);
    if (validation.error) {
      return res.status(400).json({ success: false, message: validation.error });
    }

    const createdItem = await itemsModel.createItem(
      validation.data.title,
      validation.data.description,
      validation.data.status
    );

    return res.status(201).json({ success: true, data: createdItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function updateItem(req, res) {
  /*
  """short description

  Validate update input, apply changes to the item row, and return the updated record.
  """
  */
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid item id" });
    }

    const validation = validateItemPayload(req.body);
    if (validation.error) {
      return res.status(400).json({ success: false, message: validation.error });
    }

    const updatedItem = await itemsModel.updateItem(
      id,
      validation.data.title,
      validation.data.description,
      validation.data.status
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    return res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteItem(req, res) {
  /*
  """short description

  Delete an item by id and return a success message when deletion succeeds.
  """
  */
  try {
    const id = Number(req.params.id);
    const wasDeleted = await itemsModel.deleteItem(id);

    if (!wasDeleted) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    return res.status(200).json({ success: true, message: "Item deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export default {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};