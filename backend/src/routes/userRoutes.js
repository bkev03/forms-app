import express from "express";
import { loginUser, signupUser, getCurrentUser } from "../controllers/userController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/profile", requireAuth, getCurrentUser);

export default router;
