import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { sellerVerify } from '../middlewares/sellerVerify.js';
import { cancelOrder, createOrder, getOrders, getSellerOrders, singleOrder, statusUpdate } from '../controllers/order.controller.js';

const router = express.Router();

router.post("/create", verifyToken, createOrder);
router.get("/my-orders", verifyToken, getOrders);
router.get("/seller-orders", verifyToken, sellerVerify, getSellerOrders);
router.get("/:id", verifyToken, singleOrder);
router.patch("/:id/cancel", verifyToken, cancelOrder);
router.patch("/:id/status", verifyToken, sellerVerify, statusUpdate);

export default router;
