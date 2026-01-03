import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.userId).select("-password");

        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export const isSeller = (req, res, next) => {
    if (!req.user || req.user.role !== "seller") {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
};
