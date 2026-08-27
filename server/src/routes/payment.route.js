import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { createPaymentOrder, verifyPayment } from '../controllers/payment.controller.js';

const router = express.Router();

router.post("/create-payment",verifyToken,createPaymentOrder);
router.post("/verify-payment",verifyToken,verifyPayment);

export default router;