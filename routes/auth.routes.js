import { Router } from "express";
import { registerUser, loginUser, logoutUser, updateProfile, changePassword } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.put("/update-profile", auth, updateProfile);
authRouter.put("/change-password", auth, changePassword);


authRouter.get("/me", auth, async (req, res) => {
    try {
        res.json({ user: req.user });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

export default authRouter;