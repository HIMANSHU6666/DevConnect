import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { sellerVerify } from '../middlewares/sellerVerify.js';
import { AddProduct, deleteProduct, getAllProducts, getProductById, myProducts, updateProduct } from '../controllers/product.controller.js';

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/detail/:id", getProductById);

// Protected Seller routes
router.post("/", verifyToken, sellerVerify, AddProduct);
router.get("/My-Products", verifyToken, sellerVerify, myProducts);
router.patch("/:id", verifyToken, sellerVerify, updateProduct);
router.delete("/:id", verifyToken, sellerVerify, deleteProduct);

export default router;