import Response from "../models/Response.js";
import Form from "../models/Form.js";


export async function submitResponse(req, res) {
    try {
        const { formId, userId, answers } = req.body;
        const newResponse = new Response({ formId, userId, answers });
        await newResponse.save();
        res.status(201).json(newResponse);
    } catch (error) {
        console.error("Error in submitResponse controller:\n", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function getMyResponses(req, res) {
    // TODO
}

export async function getResponseDetails(req, res) {
    try {
        const responseId = req.params.id;
        const response = await Response.findById(responseId);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getResponseDetails controller:\n", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function getFormResponses(req, res) {
    try {
        const formId = req.params.formId;
        const formResponses = await Response.find({ formId: formId });
        res.status(200).json(formResponses);
    } catch (error) {
        console.error("Error in getFormResponses controller:\n", error);
        res.status(500).json({ message: "Internal server error." });
    }
}