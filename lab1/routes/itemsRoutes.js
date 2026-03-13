// routes/itemsRoutes.js

import { Router } from "express";
import itemsController from "#controllers/itemsController";

const router = Router();

router.get("/", itemsController.getAllItems);
router.get("/:id", itemsController.getItemById);
router.post("/", itemsController.createItem);
router.put("/:id", itemsController.updateItem);
router.delete("/:id", itemsController.deleteItem);

export default router;