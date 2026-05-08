import express from "express";
import { submitResponse, getMyResponses, getResponseDetails, getFormResponses } from "../controllers/responseController.js";

const router = express.Router();

router.post("/", submitResponse);
router.get("/my-responses", getMyResponses);
router.get("/:id", getResponseDetails);
router.get("/form/:formId", getFormResponses);

export default router;