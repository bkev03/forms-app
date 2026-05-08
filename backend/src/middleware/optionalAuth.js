import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const optionalAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next();
    }

    const token = authorization.split(" ")[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(_id).select("-password");
        if (user) {
            req.user = user;
        }
    } catch (error) {
        // Invalid or expired token: continue without req.user
    }
    next();
};
