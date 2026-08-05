import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { deleteAccount, getProfile, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/profile",verifyToken,getProfile);
router.patch("/updateprofile",verifyToken,updateProfile);
router.delete("/DeleteAccount",verifyToken,deleteAccount);

export default router;