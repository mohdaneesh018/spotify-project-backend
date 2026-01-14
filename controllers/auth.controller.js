import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        let { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        email = email.toLowerCase().trim(); // ✅ ADD THIS

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({
                success: false,
                message: "User already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


export const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        email = email.toLowerCase().trim();

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token, // ✅ IMPORTANT
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

export const logoutUser = async (req, res) => {
    // res.clearCookie("token", {
    //     httpOnly: true,
    //     sameSite: "none",
    //     secure: true,
    //     path: "/",
    //     partitioned: true,
    //     maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    return res.json({
        success: true,
        message: "Logged out successfully"
    });
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and Email are required"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { name, email },
            { new: true }
        );

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Both fields are required" });
        }

        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);

        user.password = hashed;
        await user.save();

        res.json({
            success: true,
            message: "Password updated successfully",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};