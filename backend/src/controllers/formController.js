import Form from "../models/Form.js";
import Response from "../models/Response.js";
import { handleError } from "../utils/handleError.js";

export async function createForm(req, res) {
    try {
        const { title, description, isOpen, questions } = req.body;
        const newForm = new Form({
            title,
            description,
            owner: req.user._id,
            isOpen,
            questions
        });
        await newForm.save();
        res.status(201).json(newForm);
    } catch (error) {
        return handleError(error, res, "createForm controller");
    }
}

export async function getAllOpenForms(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Form.find({ isOpen: true }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Form.countDocuments({ isOpen: true })
        ]);

        res.status(200).json({ data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
    } catch (error) {
        return handleError(error, res, "getAllOpenForms controller");
    }
}

export async function getFormById(req, res) {
    try {
        const formId = req.params.id;
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ error: "Form not found." });
        }
        if (!form.isOpen) {
            const isOwner = req.user && form.owner.toString() === req.user._id.toString();
            if (!isOwner) {
                return res.status(404).json({ error: "Form not found." });
            }
        }
        res.status(200).json(form);
    } catch (error) {
        return handleError(error, res, "getFormById controller");
    }
}

export async function getMyForms(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Form.find({ owner: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Form.countDocuments({ owner: req.user._id })
        ]);

        res.status(200).json({ data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
    } catch (error) {
        return handleError(error, res, "getMyForms controller");
    }
}

export async function updateForm(req, res) {
    try {
        const formId = req.params.id;
        const { title, description, isOpen, questions } = req.body;

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ error: "Form not found." });
        }
        if (form.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You do not own this form." });
        }

        if (title !== undefined) form.title = title;
        if (description !== undefined) form.description = description;
        if (isOpen !== undefined) form.isOpen = isOpen;
        if (questions !== undefined) form.questions = questions;

        const updatedForm = await form.save();
        res.status(200).json(updatedForm);
    } catch (error) {
        return handleError(error, res, "updateForm controller");
    }
}

export async function deleteForm(req, res) {
    try {
        const formId = req.params.id;

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ error: "Form not found." });
        }
        if (form.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You do not own this form." });
        }

        await Form.findByIdAndDelete(formId);
        await Response.deleteMany({ formId });
        res.status(200).json({ message: "Form deleted successfully." });
    } catch (error) {
        return handleError(error, res, "deleteForm controller");
    }
}

export async function changeStatus(req, res) {
    try {
        const formId = req.params.id;
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ error: "Form not found." });
        }
        if (form.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You do not own this form." });
        }

        const updatedForm = await Form.findByIdAndUpdate(
            formId,
            { $set: { isOpen: !form.isOpen } },
            { new: true }
        );
        res.status(200).json(updatedForm);
    } catch (error) {
        return handleError(error, res, "changeStatus controller");
    }
}
