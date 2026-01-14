import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};


export const isSeller = (req, res, next) => {
    if (!req.user || req.user.role !== "seller") {
        return res.status(403).json({ error: "Seller access only" });
    }
    next();
};

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access only" });
    }
    next();
};
