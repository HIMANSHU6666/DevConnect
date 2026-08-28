import React, { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import {useCart} from '../context/CartContext.jsx';
import api from '../api.js';

const Payment = ({ orderId }) => {
    const navigate = useNavigate();
    const {clearCartState , fetchCart} = useCart();

    const handlePayment = async () => {
        try {
            const response = await api.post("/payment/create-payment", {
                orderId
            });

            const data = response.data;
            console.log("Payment Data :", data);

            const options = {
                key: data.key,
                amount: data.amount * 100,
                currency: "INR",
                order_id: data.orderId,
                handler: async function (response){
                    console.log("Payment Response",response);
                    try{
                        const verifyResponse = await api.post("/payment/verify-payment",{
                                paymentId:response.razorpay_payment_id,
                                orderId:response.razorpay_order_id,
                                signature:response.razorpay_signature
                            
                        }
                    );
                    const data = verifyResponse.data;
                    console.log("Verification response",data);
                    if(data.success){
                        clearCartState();
                        navigate("/orders");
                    }else{
                        console.log("Payment verification failed")
                    }
                    }catch(error){
                        console.log("Verification Error :",error);
                    }
                }
                

            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.log(error);
        }

    };
    useEffect(() => {
        if (orderId) {
            handlePayment();
        }
    }, [orderId]);
    return null;
    // (
    // <div>
    //     <button onClick={handlePayment}>Pay Now</button>
    // </div>
    // );
};
export default Payment;