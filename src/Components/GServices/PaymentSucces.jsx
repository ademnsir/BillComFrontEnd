import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from "@/Components/GServices/Loading"; 

const PaymentSuccess = () => {
    const [showAlert, setShowAlert] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const alertTimer = setTimeout(() => {
            setShowAlert(false);
        }, 3000);

        return () => {
            clearTimeout(alertTimer);
        };
    }, []);

    const handleContinueShopping = () => {
        setLoading(true);
        setTimeout(() => {
            navigate('/store?type=all');
            setLoading(false);
        }, 500);
    };

    const handleGoHome = () => {
        setLoading(true);
        setTimeout(() => {
            navigate('/');
            setLoading(false);
        }, 500);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <Loading isVisible={loading} />
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-white">
                Your payment was <span style={{ color: '#B60B59' }}>successful!</span>
            </h1>
            <div style={{ marginTop: '60px' }}>
                <button
                    onClick={handleContinueShopping}
                    className="bg-transparent hover:bg-[#B60B59] text-[#B60B59] font-semibold hover:text-white py-2 px-4 border border-[#B60B59] hover:border-transparent rounded"
                    style={{ marginRight: '10px' }}
                >
                    Continue Shopping
                </button>
                <button
                    onClick={handleGoHome}
                    className="bg-transparent hover:bg-[#B60B59] text-[#B60B59] font-semibold hover:text-white py-2 px-4 border border-[#B60B59] hover:border-transparent rounded"
                >
                    Go Back To Home Page
                </button>
            </div>
            <aside className="w-1/4 p-4 space-y-4">
                <img
                    src="/img/abc.gif"
                    alt="GIF description"
                    style={{
                        width: "400px",
                        height: "300px",
                        maxWidth: "500px",
                        maxHeight: "500px"
                    }}
                />
            </aside>
            {showAlert && (
                <div className="bg-green-200 text-green-900 p-4 mt-4 fixed bottom-0 left-0 right-0 flex justify-center items-center">
                    <span className="text-center">Your payment has been successfully processed!</span>
                </div>
            )}
            <div className="mt-4 text-center text-[#B60B59]">
                <p>Thank you for your purchase! You will receive a confirmation email shortly.</p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
