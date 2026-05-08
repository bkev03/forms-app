import express from "express";
import { submitResponse, getMyResponses, getResponseDetails, getFormResponses } from "../controllers/responseController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

router.post("/", requireAuth, submitResponse);
router.get("/my-responses", requireAuth, getMyResponses);
router.get("/:id", requireAuth, getResponseDetails);
router.get("/form/:formId", requireAuth, requireRole('editor'), getFormResponses);

export default router;
