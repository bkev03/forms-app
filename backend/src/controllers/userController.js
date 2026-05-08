import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function createToken(_id) {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' });
}

export async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;
        
        const user = await User.login(email, password);

        const token = createToken(user._id);

        res.status(200).json({email, token, message: "Successful login."});
    } catch (error) {
        console.error("Error in loginUser controller:\n", error);
        res.status(400).json({ error: error.message });
    }
}

export async function signupUser(req, res) {
    try {
        const { username, email, password } = req.body;
        
        const newUser = await User.signup(username, email, password);

        const token = createToken(newUser._id);

        res.status(201).json({email, token, message: "Successful signup."});
    } catch (error) {
        console.error("Error in signupUser controller:\n", error);
        res.status(400).json({ error: error.message });
    }
}

export async function getCurrentUser(req, res) {
    // TODO
}


// currently just for testing purposes:

export async function getUserById(req, res) {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getUserById controller:\n", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers controller:\n", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function createUser(req, res) {
    try {
        const { username, email, password, role } = req.body;

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
                return res.status(400).json({ message: "This username and email is already in use!" });
            } else if (usernameAlreadyInUse) {
                return res.status(400).json({ message: "This username is already in use!" });
            } else {
                return res.status(400).json({ message: "This email is already in use!" });
            }
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hash, role });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error in createUser controller:\n", error);
        res.status(500).json({ message: "Internal server error." });
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
                return res.status(400).json({ message: "This username and email is already in use!" });
            } else if (usernameAlreadyInUse) {
                return res.status(400).json({ message: "This username is already in use!" });
            } else {
                return res.status(400).json({ message: "This email is already in use!" });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { username, email, password, role });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in updateUser controller:\n", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error in deleteUser controller:\n", error);
        res.status(500).json({ message: "Internal server error." });
    }
}