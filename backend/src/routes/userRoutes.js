import express from "express";
import { loginUser, signupUser, getCurrentUser, getAllUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/profile", getCurrentUser)

// currently just for testing purposes:
router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;