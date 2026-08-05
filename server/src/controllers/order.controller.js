import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';

// Create an order from buyer's cart
export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Your cart is empty" });
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart.items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product with ID ${item.productId} not found` });
            }
            if (item.quantity > product.productStock) {
                return res.status(400).json({ success: false, message: `Product "${product.productName}" is out of stock. Only ${product.productStock} pcs left` });
            }

            const price = product.productPrice;

            orderItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: price
            });

            totalAmount += price * item.quantity;
            product.productStock -= item.quantity;
            await product.save();
        }

        const order = await Order.create({
            userId,
            items: orderItems,
            totalAmount
        });

        cart.items = [];
        await cart.save();

        const populatedOrder = await Order.findById(order._id).populate("items.productId");

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: populatedOrder
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get all orders for current buyer
export const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId }).populate("items.productId").sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get single order details
export const singleOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.id;

        const order = await Order.findById(orderId).populate("items.productId").populate("userId", "name email username");
        if (!order) {
            return res.status(404).json({ success: false, message: "Order details not found" });
        }

        // Allow if buyer is owner or if seller owns any product in the order
        const isOwner = order.userId._id.toString() === userId || order.userId.toString() === userId;
        const isSeller = order.items.some(item => item.productId && item.productId.sellerId?.toString() === userId);

        if (!isOwner && !isSeller) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        return res.status(200).json({ success: true, order });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Cancel order (Buyer)
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.status !== "pending") {
            return res.status(400).json({ success: false, message: `Cannot cancel order with status '${order.status}'` });
        }

        order.status = "cancelled";
        await order.save();

        // Restore product stock
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.productStock += item.quantity;
                await product.save();
            }
        }

        return res.status(200).json({ success: true, message: "Order cancelled successfully", order });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update order status (Seller only)
export const statusUpdate = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Valid options are: ${validStatuses.join(", ")}` });
        }

        const order = await Order.findById(req.params.id).populate("items.productId");
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Verify seller owns at least one product in this order
        const isSellerProductInOrder = order.items.some(
            item => item.productId && item.productId.sellerId && item.productId.sellerId.toString() === req.user.id
        );

        if (!isSellerProductInOrder) {
            return res.status(403).json({ success: false, message: "Unauthorized. None of your products are in this order" });
        }

        if (order.status === status) {
            return res.status(400).json({ success: false, message: `Order status is already '${status}'` });
        }

        // If status changes to cancelled by seller, restore stock
        if (status === "cancelled" && order.status !== "cancelled") {
            for (const item of order.items) {
                if (item.productId) {
                    const product = await Product.findById(item.productId._id);
                    if (product) {
                        product.productStock += item.quantity;
                        await product.save();
                    }
                }
            }
        }

        order.status = status;
        await order.save();

        return res.status(200).json({ success: true, message: `Order status updated to '${order.status}'`, order });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get orders containing seller's products (Seller only)
export const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const sellerProducts = await Product.find({ sellerId }).select("_id");
        const productIds = sellerProducts.map(p => p._id);

        const orders = await Order.find({ "items.productId": { $in: productIds } })
            .populate("items.productId")
            .populate("userId", "name email username")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, count: orders.length, orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};