import express from "express";
import { createForm, getAllOpenForms, getMyForms, getFormById, updateForm, deleteForm, changeStatus } from "../controllers/formController.js";

const router = express.Router();

router.post("/", createForm);
router.get("/", getAllOpenForms);
router.get("/my-forms", getMyForms);
router.get("/:id", getFormById);
router.put("/:id", updateForm);
router.delete("/:id", deleteForm);
router.patch("/:id/status", changeStatus);

export default router;