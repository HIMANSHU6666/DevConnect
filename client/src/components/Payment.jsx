import React, { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import {useCart} from '../context/CartContext.jsx';

const Payment = ({ orderId }) => {
    const navigate = useNavigate();
    const {clearCartState , fetchCart} = useCart();

    const handlePayment = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/payment/create-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    orderId
                })
            });

            const data = await response.json();

            console.log("Payment Data :", data);
            const options = {
                key: data.key,
                amount: data.amount * 100,
                currency: "INR",
                order_id: data.orderId,
                handler: async function (response){
                    console.log("Payment Response",response);
                    try{
                        const verifyResponse = await fetch ("http://localhost:5000/api/payment/verify-payment",{
                            method:"POST",
                            headers:{
                                "Content-Type":"application/json"
                            },
                            credentials:"include",
                            body:JSON.stringify({
                                paymentId:response.razorpay_payment_id,
                                orderId:response.razorpay_order_id,
                                signature:response.razorpay_signature
                            })
                        }
                    );
                    const data = await verifyResponse.json();
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