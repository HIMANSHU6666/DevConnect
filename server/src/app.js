import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

//Middlewares

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Health Check

app.get("/api/health",(req,res) => {
    res.status(200).json({
        message:"DevConnect Api is running",
        success:true
    });
});

export default app;