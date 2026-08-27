import crypto from 'crypto';

export const verifyPaymentSignature =({
    orderId,
    paymentId,
    signature
}) => {
    const generatedSignature = crypto .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET) 
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

    if(generatedSignature !== signature){
        throw new Error("Payment verification failed");
    }
    return true;
};