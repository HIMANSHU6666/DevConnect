import User from '../models/User.js';

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const profile = await User.findById(req.user.id).select("-password");
        if (!profile) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user: profile });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update profile details
export const updateProfile = async (req, res) => {
    try {
        const { name, username, bio, email, role, avatar } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (username && username.toLowerCase() !== user.username) {
            const existingUsername = await User.findOne({ username: username.toLowerCase() });
            if (existingUsername) {
                return res.status(400).json({ success: false, message: "Username is already taken" });
            }
            user.username = username.toLowerCase();
        }

        if (email && email.toLowerCase() !== user.email) {
            const existingEmail = await User.findOne({ email: email.toLowerCase() });
            if (existingEmail) {
                return res.status(400).json({ success: false, message: "Email is already in use" });
            }
            user.email = email.toLowerCase();
        }

        if (name !== undefined) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (role !== undefined && ["buyer", "seller"].includes(role)) user.role = role;

        if (avatar !== undefined) {
            if (typeof avatar === "string") {
                user.avatar.url = avatar;
            } else if (typeof avatar === "object" && avatar !== null) {
                if (avatar.url) user.avatar.url = avatar.url;
                if (avatar.public_id) user.avatar.public_id = avatar.public_id;
            }
        }

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;

        return res.status(200).json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Delete account
export const deleteAccount = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user.id);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        return res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};