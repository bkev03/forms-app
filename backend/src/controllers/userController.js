import User from "../models/User.js";
import jwt from "jsonwebtoken";

function createToken(_id) {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.login(email, password);
        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, email, role: user.role, token, message: "Successful login." });
    } catch (error) {
        console.error("Error in loginUser controller:\n", error);
        res.status(400).json({ error: error.message });
    }
}

export async function signupUser(req, res) {
    try {
        const { username, email, password, role } = req.body;

        const newUser = await User.signup(username, email, password, role);
        const token = createToken(newUser._id);

        res.status(201).json({ _id: newUser._id, email, role: newUser.role, token, message: "Successful signup." });
    } catch (error) {
        console.error("Error in signupUser controller:\n", error);
        res.status(400).json({ error: error.message });
    }
}

export async function getCurrentUser(req, res) {
    res.status(200).json(req.user);
}
