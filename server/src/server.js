import dotenv from 'dotenv';
import app from "./app.js";
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

//Database Connect
// connectDB();

const startServer = async () => {
    await connectDB();


app.listen(PORT, () =>{
console.log(`Server is Running on Port ${PORT}`);    
});
};

startServer()