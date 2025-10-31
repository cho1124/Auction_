import express from "express";
import { getProfile } from "../controllers/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);

export default router;
