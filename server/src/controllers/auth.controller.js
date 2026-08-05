import User from "../models/User.js";

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { name, username, email, password, role = "buyer" } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all required fields (name, username, email, password)" });
        }

        const validRoles = ["buyer", "seller"];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: `Invalid role. Allowed roles are: ${validRoles.join(", ")}` });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (existingUser) {
            const isEmailMatch = existingUser.email === email.toLowerCase();
            return res.status(409).json({
                success: false,
                message: isEmailMatch ? "Email is already registered. Please try logging in." : "Username is already taken. Please choose another."
            });
        }

        const user = await User.create({ name, email, username, password, role });

        const token = user.generateToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: Number(process.env.COOKIE_EXPIRE) || 7 * 24 * 60 * 60 * 1000,
        });

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(201).json({
            success: true,
            message: "Registered successfully",
            token,
            user: userObj
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const identifier = email || username;

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: "Username/Email and password are required" });
        }

        const user = await User.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { username: identifier.toLowerCase() }
            ]
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials or user not registered" });
        }

        const isCorrectPassword = await user.comparePassword(password);
        if (!isCorrectPassword) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = user.generateToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: Number(process.env.COOKIE_EXPIRE) || 7 * 24 * 60 * 60 * 1000,
        });

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userObj
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get current user profile (Auth check)
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Logout user
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};