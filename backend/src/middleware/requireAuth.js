import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Authorization token required." });
    }

    const token = authorization.split(" ")[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(_id).select("-password");
        if (!user) {
            return res.status(401).json({ error: "User not found." });
        }
        req.user = user;
        next();
    } catch (error) {
        const isJwtError = ["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(error.name);
        if (!isJwtError) {
            console.error("Unexpected error in requireAuth middleware:\n", error);
        }
        return res.status(401).json({ error: "Request not authorized." });
    }
};
