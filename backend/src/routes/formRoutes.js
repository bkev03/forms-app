import express from "express";
import { createForm, getAllOpenForms, getMyForms, getFormById, updateForm, deleteForm, changeStatus } from "../controllers/formController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = express.Router();

router.get("/", getAllOpenForms);
router.post("/", requireAuth, requireRole('editor'), createForm);
router.get("/my-forms", requireAuth, requireRole('editor'), getMyForms);
router.get("/:id", optionalAuth, getFormById);
router.put("/:id", requireAuth, requireRole('editor'), updateForm);
router.delete("/:id", requireAuth, requireRole('editor'), deleteForm);
router.patch("/:id/status", requireAuth, requireRole('editor'), changeStatus);

export default router;
