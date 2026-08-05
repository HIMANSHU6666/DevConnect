import express from 'express';

import { registerUser, loginUser,getMe, logoutUser} from '../controllers/auth.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js';


const router = express.Router();


router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/me",verifyToken,getMe);
router.post("/logout",logoutUser);

export default router;

