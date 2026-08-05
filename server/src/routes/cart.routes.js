import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { addCart, getCart, removeCart, updateCart, clearCart } from '../controllers/cart.controller.js';

const router = express.Router();

router.post("/add", verifyToken, addCart);
router.get("/", verifyToken, getCart);
router.patch("/update", verifyToken, updateCart);
router.delete("/remove", verifyToken, removeCart);
router.delete("/clear", verifyToken, clearCart);

export default router;