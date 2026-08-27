import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import productRoute from './routes/product.routes.js';
import cartRoute from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import chatRoutes from  './routes/chat.routes.js';
import paymentRoutes from './routes/payment.route.js'

const app = express();

// Middlewares
app.use(cors({
    origin: "https://himanshu6666.github.io",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/ai",chatRoutes);
app.use("/api/payment",paymentRoutes)

// Base route for testing and cron-job ping
app.get('/', (req, res) => {
    res.status(200).json({
        success: true, 
        message: "DevConnect Backend is successfully running!" 
    });
});
// Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "DevConnect API is running smoothly",
        success: true,
        timestamp: new Date().toISOString()
    });
});

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.stack || err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

export default app;