// auth.routes.js

// This file defines all routes for the /auth resource.
// Each route maps an HTTP method + path to the corresponding
// controller function that handles the request.

import { Router } from "express";
import AuthController from "#controllers/auth.controller";

const router = Router();

// POST /auth/login — authenticate a user and receive a JWT token
router.post("/login", AuthController.login);

export default router;
