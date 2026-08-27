import Product from "../models/product.js";

// Add a new product (Seller only)
export const AddProduct = async (req, res) => {
    try {
        const {
            productName,
            productCode,
            productPrice,
            productImage,
            productImageUrl,
            productDescription,
            productDiscount,
            productDisscount,
            productCategory,
            productStock
        } = req.body;

        const imageUrl = productImageUrl || (typeof productImage === "string" ? productImage : productImage?.Image_url || productImage?.url);
        const imageId = (typeof productImage === "object" && productImage !== null) ? (productImage.Image_id || productImage.id || "") : "";

        if (!productName || !productCode || productPrice === undefined || !imageUrl || !productDescription || !productCategory || productStock === undefined) {
            return res.status(400).json({ success: false, message: "Please fill all required fields (productName, productCode, productPrice, productImage/productImageUrl, productDescription, productCategory, productStock)" });
        }

        const existingCode = await Product.findOne({ productCode });
        if (existingCode) {
            return res.status(400).json({ success: false, message: "Product code already exists" });
        }

        const discount = productDiscount !== undefined ? productDiscount : (productDisscount !== undefined ? productDisscount : 0);

        const product = await Product.create({
            productName,
            productCode,
            productPrice,
            productImage: {
                Image_id: imageId,
                Image_url: imageUrl
            },
            productDescription,
            productDisscount: discount,
            productCategory,
            productStock,
            sellerId: req.user.id
        });

        return res.status(201).json({ success: true, message: "Product added successfully", product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get all products (Public route)
export const getAllProducts = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;
        const query = {};

        if (category) {
            query.productCategory = { $regex: category, $options: "i" };
        }

        if (search) {
            query.$or = [
                { productName: { $regex: search, $options: "i" } },
                { productDescription: { $regex: search, $options: "i" } },
                { productCode: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const products = await Product.find(query)
            .populate("sellerId", "name username email")
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(query);

        return res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            products
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get single product details by ID (Public route)
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("sellerId", "name username email");
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get seller's own products (Seller only)
export const myProducts = async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: products.length, products });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// // product.controller.js
// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const sellerId = req.user.id;

//     // Ensure seller can only edit their own product
//     const product = await Product.findOne({ _id: id, sellerId });
//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
//     }

//     // Exclude productCode from updates if desired
//     const { productCode, ...updateData } = req.body;

//     const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
//     return res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// Update product (Seller only)
export const updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const sellerId = req.user.id;
         const product = await Product.findOne({ _id: id, sellerId });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
        }
        const {
            productName,
            productCode,
            productPrice,
            productImage,
            productImageUrl,
            productDescription,
            productDiscount,
            productDisscount,
            productCategory,
            productStock
        } = req.body;

       

        if (productName !== undefined) product.productName = productName;
        if (productCode !== undefined) product.productCode = productCode;
        if (productPrice !== undefined) product.productPrice = productPrice;

        const imageUrl = productImageUrl || (typeof productImage === "string" ? productImage : productImage?.Image_url || productImage?.url);
        if (imageUrl !== undefined) {
            product.productImage.Image_url = imageUrl;
        }
        if (typeof productImage === "object" && productImage !== null && (productImage.Image_id || productImage.id)) {
            product.productImage.Image_id = productImage.Image_id || productImage.id;
        }

        if (productDescription !== undefined) product.productDescription = productDescription;

        const discount = productDiscount !== undefined ? productDiscount : productDisscount;
        if (discount !== undefined) product.productDisscount = discount;

        if (productCategory !== undefined) product.productCategory = productCategory;
        if (productStock !== undefined) product.productStock = productStock;

        await product.save();

        return res.status(200).json({ success: true, message: "Product updated successfully", product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Delete product (Seller only)
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id, sellerId: req.user.id });
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
        }
        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};