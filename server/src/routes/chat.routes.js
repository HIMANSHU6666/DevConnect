import express from 'express';
import {verifyToken} from '../middlewares/verifyToken.js'
import {chat} from '../controllers/chat.controller.js'

const router = express.Router();

router.post("/chat",verifyToken,chat);

export default router;

