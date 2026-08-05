export const sellerVerify = (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "seller") {
            return res.status(403).json({ success: false, message: "Access denied. Seller role required." });
        }
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};