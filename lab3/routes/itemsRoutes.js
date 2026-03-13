// routes/itemsRoutes.js

import { Router } from "express";
import itemsController from "#controllers/itemsController";
import verifyAPIKey from "../middleware/apiKey.middleware.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

// Login must stay public so clients can obtain a token.
router.post("/login", itemsController.loginUser);

// All remaining Lab2 routes require a valid JWT token.
router.use(verifyJWT);

router.get("/", itemsController.getAllItems);
router.get("/secure/api-key", verifyAPIKey, itemsController.getAPIKeyProtectedMessage);
router.get("/secure/jwt", itemsController.getJWTProtectedMessage);
router.get("/status/:status", itemsController.getItemsByStatus);
router.get("/search/:title", itemsController.searchItemsByTitle);
router.get("/:id", itemsController.getItemById);
router.post("/", itemsController.createItem);
router.put("/:id", itemsController.updateItem);
router.delete("/:id", itemsController.deleteItem);

export default router;