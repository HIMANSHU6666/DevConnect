import Cart from '../models/cart.js';
import Product from '../models/product.js';
import Order from '../models/order.js';

export const getContext = async (message,userId) => {
    if(message.toLowerCase().includes("cart")){
    
        const cartDetail = await Cart.findOne({userId})
        .populate("items.productId")
        return cartDetail
        
    }
   else if(message.toLowerCase().includes("order")){
    
        const orderDetail = await Order.find({userId})
        .populate("items.productId")
        return orderDetail;
        
    }
    else if(message.toLowerCase().includes("product")){
    
        const productDetail = await Product.find({
            sellerId:userId
        });
        return productDetail;
        
    }
    else{
        return null;
    }
    
}

export const formatContext = (context,message) => {
    if(!context){
        return "No relevant database context available."
    }
    else if(message.toLowerCase().includes("cart")){
        let text = "Cart Details: \n\n";

        if (context.items.length === 0){
            return "Your cart is empty";
        }
        for (const item of context.items){
            text += `Product: ${item.productId.productName}\n`;
            text += `Quantity: ${item.quantity}\n`;
            text += `Price: ${item.productId.productPrice}\n\n`;
            text += `Total Amount: ${item.quantity * item.productId.productPrice}\n\n`;
        }
        return text;

    }
    else if(message.toLowerCase().includes("order")){
        let text = "Your Orders : \n\n";
        if(context.length === 0){
            return "You don't have any Order"
        }
        let orderNumber =1;
        for (const order of context){
            text += `Order #${orderNumber}\n`;

            text += `Order Status : ${order.status}\n`;
            text += `Total Amount : ${order.totalAmount}\n\n`;
            text += `Products: \n`;
            for (const item of order.items){

                text +=`- ${item.productId.productName}\n`;
                text += `Quantity: ${item.quantity}\n`;
                text += `Price: ${item.productId.productPrice}\n`;
                text += `Total Price : ${item.quantity * item.productId.productPrice}\n\n`

            }
            text += "----------------------------------------- \n\n";
            orderNumber++;
            
        }
        return text;

    }
    else if(message.toLowerCase().includes("product")){
        let text ="Your Products : \n\n";
        if(context.length === 0){
            return "You don't have any Products"
        }
        for (const product of context){
            text += `${product.productName}\n`;
            text += `Price : ${product.productPrice}\n`;
            text += `Stock : ${product.productStock}\n\n`;
        }
        return text;
    }
    else{
        return "No relevant database context available.";
}
}