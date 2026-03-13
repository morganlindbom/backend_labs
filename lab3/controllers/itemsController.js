// controllers/itemsController.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import itemsModel from "#models/itemsModel";

const validStatuses = ["pending", "in_progress", "done"];
const JWT_SECRET = process.env.JWT_SECRET;
const defaultUser = {
  username: "doe",
  passwordHash: "$2b$10$JsgmnJmam2570zqjSFEn9e7CdFOTAPgxaANQ04fD3z.t1Aw.B.VXm",
};

function validateItemPayload(body) {
  const { title, description = null, status = "pending" } = body;

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return { error: "Invalid input" };
  }

  if (description !== null && typeof description !== "string") {
    return { error: "Invalid input" };
  }

  if (typeof status !== "string" || !validStatuses.includes(status)) {
    return { error: "Invalid input" };
  }

  return {
    data: {
      title: title.trim(),
      description,
      status,
    },
  };
}

function isValidId(id) {
  return Number.isInteger(id) && id > 0;
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    if (username !== defaultUser.username || typeof password !== "string") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the plain-text login password against the stored bcrypt hash.
    const passwordMatches = await bcrypt.compare(password, defaultUser.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Sign a short-lived JWT that the client can use for protected routes.
    const token = jwt.sign({ username: defaultUser.username }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

function getAPIKeyProtectedMessage(req, res) {
  return res.status(200).json({
    message: "Valid API key. Protected route accessed.",
  });
}

function getJWTProtectedMessage(req, res) {
  return res.status(200).json({
    message: "Valid JWT token. Protected route accessed.",
    user: req.user,
  });
}

async function getAllItems(req, res) {
  try {
    const items = await itemsModel.getAllItems();
    return res.status(200).json({ success: true, data: items });
  } catch {
    return res.status(500).json({ success: false, error: "Database error" });
  }
}

async function getItemById(req, res) {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, error: "Invalid input" });
    }

    const item = await itemsModel.getItemById(id);

    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    return res.status(200).json({ success: true, data: item });
  } catch {
    return res.status(500).json({ success: false, error: "Database error" });
  }
}

async function createItem(req, res) {
  try {
    const validation = validateItemPayload(req.body);
    if (validation.error) {
      return res.status(400).json({ success: false, error: "Invalid input" });
    }

    const createdItem = await itemsModel.createItem(
      validation.data.title,
      validation.data.description,
      validation.data.status
    );

    return res.status(201).json({ success: true, data: createdItem });
  } catch {
    return res.status(500).json({ success: false, error: "Database error" });
  }
}

async function updateItem(req, res) {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, error: "Invalid input" });
    }

    const validation = validateItemPayload(req.body);
    if (validation.error) {
      return res.status(400).json({ success: false, error: "Invalid input" });
    }

    const existingItem = await itemsModel.getItemById(id);
    if (!existingItem) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    const updatedItem = await itemsModel.updateItem(
      id,
      validation.data.title,
      validation.data.description,
      validation.data.status
    );

    return res.status(200).json({ success: true, data: updatedItem });
  } catch {
    return res.status(500).json({ success: false, error: "Database error" });
  }
}

async function deleteItem(req, res) {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, error: "Invalid input" });
    }

    const existingItem = await itemsModel.getItemById(id);
    if (!existingItem) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    await itemsModel.deleteItem(id);

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch {
    return res.status(500).json({ success: false, error: "Database error" });
  }
}

async function getItemsByStatus(req, res) {
  try {
    const status = req.params.status;

    const items = await itemsModel.getItemsByStatus(status);
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function searchItemsByTitle(req, res) {
  try {
    const title = req.params.title;

    const items = await itemsModel.searchItemsByTitle(title);
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default {
  loginUser,
  getAPIKeyProtectedMessage,
  getJWTProtectedMessage,
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getItemsByStatus,
  searchItemsByTitle,
};