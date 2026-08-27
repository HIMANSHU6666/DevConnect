import Order from "../models/order.js";
import Payment from '../models/payment.js';
import razorpay from "../config/razorpay.js";
import { verifyPaymentSignature } from "../services/payment.service.js";
import Cart from '../models/cart.js';
export const createPaymentOrder = async (req , res) => {
    try{
        const {orderId}  = req.body;
        if(!orderId){
            return res.status(404).json({success:false,message:"Please provide order id"});
        }
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(400).json({success:false,message:"Order not found"})
        }
        if(order.status === "cancelled"){
            return res.status(400).json({success:false,message:"Order is cancelled , cannot make payment"});
        }
        const payment = await Payment.findOne({orderId});

        if(payment && payment.status === "paid"){
            return res.status(400).json({success:false,message:"payment is already done"});

        }
        const userId = req.user.id;
        const amount = order.totalAmount;

        const razorpayOrderId = await razorpay.orders.create({
            amount:amount *100,
            currency:"INR",
            receipt:order._id.toString(),
        });
        await Payment.findOneAndUpdate({orderId},{

        
            userId,
            orderId,
            razorpayOrderId:razorpayOrderId.id,
            amount,
            status:"created"
        },
    {upsert:true, new:true}
);
        return res.json({key:process.env.RAZORPAY_KEY_ID,orderId:razorpayOrderId.id,amount});
    }
    catch(err){
        return res.status(500).json({success:false,message:err.message});
    }
}

export const verifyPayment = async (req,res) => {
    try{
        const {paymentId,orderId,signature} = req.body;

        if(!paymentId || !orderId || !signature){
            return res.status(400).json({success:false,message:"Transaction details not found"});
        }

        verifyPaymentSignature({
            orderId,
            paymentId,
            signature
        });

        const payment = await Payment.findOneAndUpdate({razorpayOrderId:orderId},
            {
            status : "paid",
        razorpayPaymentId : paymentId},
    {new:true
        }
    );
    
    await payment.save();
    console.log("2nd pass",payment)


if(!payment){
    throw new Error("Payment record not found");
}

const order = await Order.findById(payment.orderId);
if(!order){
    throw new Error ("Order not found")
}
order.status = "confirmed";
await order.save();

await Cart.findOneAndUpdate(
            {userId:order.userId},
            {$set:{items:[]}}
        );

        return res.status(200).json({
            success:true,
            message: "Payment successful",
            paymentId:payment.razorpayPaymentId,
            orderId:order._id,
            orderStatus:order.status,
            amount:order.totalAmount,
            paymentStatus:payment.status
        });
        
    }
    catch(error){
        return res.status(400).json({success:false,
            message:error.message
        });
    }
};

// export const verifyPayment = async (req,res) => {
//     try{
//         const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body;
//         if(!razorpay_payment_id || !razorpay_order_id || !razorpay_signature){
//             return res.status(400).json({success:false,message:"Transaction details not found"})
//         }
//         if(razorpay_signature !== razorpay_order_id + razorpay_payment_id ){
//             return res.status(400).json({success:false,message:"Payment verification failed"})
//         }
//         await Payment.findOneAndUpdate(razorpay_order_id,{
//             status:"paid",
//             payment_id:razorpay_payment_id,
//             amount:amount
//         })
//         return res.status(200).json({success:true,message:"Payment successfull",status,payment_id,amount});
        
//     }
//     catch(err){
//         return res.status(500).json({success:false,message:err.message});
//     }
// }

