import Cart from "../models/cart.js";
import Product from "../models/product.js";

// Add item to cart
export const addCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || quantity === undefined) {
            return res.status(400).json({ success: false, message: "Please select product and quantity" });
        }
        const qty = Number(quantity);
        if (qty < 1) {
            return res.status(400).json({ success: false, message: "Minimum 1 quantity is required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        if (qty > product.productStock) {
            return res.status(400).json({ success: false, message: `Product out of stock. Only ${product.productStock} pcs available` });
        }

        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                userId: req.user.id,
                items: [{ productId, quantity: qty }]
            });
        } else {
            const existingItem = cart.items.find(
                item => item.productId.toString() === productId
            );

            if (existingItem) {
                if (existingItem.quantity + qty > product.productStock) {
                    return res.status(400).json({
                        success: false,
                        message: `Only ${product.productStock} pieces available`
                    });
                }
                existingItem.quantity += qty;
            } else {
                cart.items.push({ productId, quantity: qty });
            }
            await cart.save();
        }

        const populatedCart = await Cart.findById(cart._id).populate("items.productId");
        return res.status(200).json({ success: true, message: "Product added to cart successfully", cart: populatedCart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get current user's cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        let cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: { userId, items: [] }
            });
        }

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update item quantity in cart
export const updateCart = async (req, res) => {
    try {
        const { productId, action } = req.body;
        const userId = req.user.id;

        if (!productId || !action) {
            return res.status(400).json({ success: false, message: "productId and action ('increase' or 'decrease') are required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (!existingItem) {
            return res.status(404).json({ success: false, message: "Product is not in your cart" });
        }

        if (action === "increase") {
            if (existingItem.quantity < product.productStock) {
                existingItem.quantity += 1;
            } else {
                return res.status(400).json({ success: false, message: `Product out of stock. Only ${product.productStock} pcs available` });
            }
        } else if (action === "decrease") {
            if (existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                return res.status(400).json({ success: false, message: "Minimum quantity is 1" });
            }
        } else {
            return res.status(400).json({ success: false, message: "Invalid action. Use 'increase' or 'decrease'" });
        }

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate("items.productId");
        return res.status(200).json({ success: true, message: "Cart updated successfully", cart: populatedCart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Remove item from cart
export const removeCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({ success: false, message: "productId is required" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (!existingItem) {
            return res.status(404).json({ success: false, message: "Product is not in your cart" });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate("items.productId");
        return res.status(200).json({ success: true, message: "Product removed from cart", cart: populatedCart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Clear entire cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        return res.status(200).json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
