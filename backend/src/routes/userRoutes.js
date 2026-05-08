import express from "express";
import { loginUser, signupUser, getCurrentUser, getAllUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/profile", requireAuth, getCurrentUser);

// currently just for testing purposes (admin-like, restricted to editors):
router.get("/", requireAuth, requireRole('editor'), getAllUsers);
router.post("/", requireAuth, requireRole('editor'), createUser);
router.put("/:id", requireAuth, requireRole('editor'), updateUser);
router.delete("/:id", requireAuth, requireRole('editor'), deleteUser);

export default router;
