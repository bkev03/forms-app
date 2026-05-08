import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { handleError } from "../utils/handleError.js";

function createToken(_id) {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' });
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


// currently just for testing purposes:

export async function getAllUsers(req, res) {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        return handleError(error, res, "getAllUsers controller");
    }
}

export async function createUser(req, res) {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields must be filled!" });
        }

        const alreadyInUse = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (alreadyInUse) {
            const usernameAlreadyInUse = alreadyInUse.username === username;
            const emailAlreadyInUse = alreadyInUse.email === email;

            if (usernameAlreadyInUse && emailAlreadyInUse) {
                return res.status(400).json({ error: "This username and email is already in use!" });
            } else if (usernameAlreadyInUse) {
                return res.status(400).json({ error: "This username is already in use!" });
            } else {
                return res.status(400).json({ error: "This email is already in use!" });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hash, role });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        return handleError(error, res, "createUser controller");
    }
}

export async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        const { username, email, password, role } = req.body;

        const alreadyInUse = await User.findOne({
            _id: { $ne: userId },
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (alreadyInUse) {
            const usernameAlreadyInUse = alreadyInUse.username === username;
            const emailAlreadyInUse = alreadyInUse.email === email;

            if (usernameAlreadyInUse && emailAlreadyInUse) {
                return res.status(400).json({ error: "This username and email is already in use!" });
            } else if (usernameAlreadyInUse) {
                return res.status(400).json({ error: "This username is already in use!" });
            } else {
                return res.status(400).json({ error: "This email is already in use!" });
            }
        }

        const updateData = { username, email, role };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        return handleError(error, res, "updateUser controller");
    }
}

export async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        return handleError(error, res, "deleteUser controller");
    }
}
