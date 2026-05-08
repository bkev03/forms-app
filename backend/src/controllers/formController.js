import Form from "../models/Form.js"

export async function createForm(req, res) {
    try {
        const { title, description, owner, isOpen, questions } = req.body;
        const newForm = new Form({ title, description, owner, isOpen, questions });
        await newForm.save();
        res.status(201).json(newForm);
    } catch (error) {
        console.error("Error in createForm controller:\n", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function getAllOpenForms(req, res) {
    try {
        const openForms = await Form.find({ isOpen: true });
        res.status(200).json(openForms);
    } catch (error) {
        console.error("Error in getAllOpenForms controller:\n", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function getFormById(req, res) {
    try {
        const formId = req.params.id;
        const form = await Form.findById(formId);
        res.status(200).json(form);
    } catch (error) {
        console.error("Error in getFormById controller:\n", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function getMyForms(req, res) {
    // TODO
}

export async function updateForm(req, res) {
    try {
        const formId = req.params.id;
        const { title, description, owner, isOpen, questions } = req.body;
        
        const updatedForm = await Form.findByIdAndUpdate(formId, { title, description, owner, isOpen, questions })
        res.status(200).json(updatedForm);
    } catch (error) {
        console.error("Error in updateForm controller:\n", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function deleteForm(req, res) {
    try {
        const formId = req.params.id;
        const deletedForm = await Form.findByIdAndDelete(formId);
        if (!deleteForm) {
            return res.status(404).json({ message: "Form not found." });
        }
        res.status(200).json({ message: "Form deleted successfully." });
    } catch (error) {
        console.error("Error in deleteForm controller:\n", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function changeStatus(req, res) {
    try {
        const formId = req.params.id;
        const form = await Form.findById(formId);

        if (form.isOpen) {
            await Form.findByIdAndUpdate(formId, { $set: { isOpen: false } });
        } else {
            await Form.findByIdAndUpdate(formId, { $set: { isOpen: true } });
        }

        const updatedForm = await Form.findById(formId).lean();
        res.status(200).json(updatedForm);
    } catch (error) {
        console.error("Error in changeStatus controller:\n", error);
        res.status(500).json({ message: "Internal server error." });
    }
}
