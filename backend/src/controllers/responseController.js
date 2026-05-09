import Response from "../models/Response.js";
import Form from "../models/Form.js";
import { handleError } from "../utils/handleError.js";

export async function submitResponse(req, res) {
    try {
        const { formId, answers } = req.body;

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ error: "Form not found." });
        }
        if (!form.isOpen) {
            return res.status(403).json({ error: "This form is no longer accepting responses." });
        }

        const existing = await Response.findOne({ formId, userId: req.user._id });
        if (existing) {
            return res.status(409).json({ error: "You have already submitted a response to this form." });
        }

        const answerMap = new Map(
            (answers || []).map(a => [a.questionId.toString(), a.value])
        );
        for (const question of form.questions) {
            if (question.required) {
                const value = answerMap.get(question._id.toString());
                const isEmpty =
                    value === undefined ||
                    value === null ||
                    value === '' ||
                    (Array.isArray(value) && value.length === 0);
                if (isEmpty) {
                    return res.status(400).json({
                        error: `Required question "${question.label}" is not answered.`
                    });
                }
            }
        }

        const newResponse = new Response({
            formId,
            userId: req.user._id,
            answers
        });
        await newResponse.save();
        res.status(201).json(newResponse);
    } catch (error) {
        return handleError(error, res, "submitResponse controller");
    }
}

export async function getMyResponses(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Response.find({ userId: req.user._id })
                .populate('formId', 'title')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Response.countDocuments({ userId: req.user._id })
        ]);

        res.status(200).json({ data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
    } catch (error) {
        return handleError(error, res, "getMyResponses controller");
    }
}

export async function getResponseDetails(req, res) {
    try {
        const responseId = req.params.id;
        const response = await Response.findById(responseId);
        if (!response) {
            return res.status(404).json({ error: "Response not found." });
        }

        const isResponseOwner = response.userId.toString() === req.user._id.toString();
        let isFormOwner = false;
        if (!isResponseOwner) {
            const form = await Form.findById(response.formId);
            if (form && form.owner.toString() === req.user._id.toString()) {
                isFormOwner = true;
            }
        }

        if (!isResponseOwner && !isFormOwner) {
            return res.status(403).json({ error: "You do not have access to this response." });
        }

        res.status(200).json(response);
    } catch (error) {
        return handleError(error, res, "getResponseDetails controller");
    }
}

export async function getFormResponses(req, res) {
    try {
        const formId = req.params.formId;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ error: "Form not found." });
        }
        if (form.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You do not own this form." });
        }

        const [data, total] = await Promise.all([
            Response.find({ formId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Response.countDocuments({ formId })
        ]);

        res.status(200).json({ data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
    } catch (error) {
        return handleError(error, res, "getFormResponses controller");
    }
}
