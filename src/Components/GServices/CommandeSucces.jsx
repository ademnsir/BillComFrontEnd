import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from "@/Components/GServices/Loading";

const CommandeSuccess = () => {
    const [showAlert, setShowAlert] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user has already accessed the CommandeSuccess page
        if (!sessionStorage.getItem('commandeSuccess')) {
            navigate('/errorpage', { replace: true });
        } else {
            // Clear the flag once accessed
            sessionStorage.removeItem('commandeSuccess');
        }
    }, [navigate]);

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

    const dynamicColor = '#28A6C4'; // Set a fixed color

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <Loading isVisible={loading} />
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-white">
                Your commande was <span style={{ color: dynamicColor }}>successfully sent!</span>
            </h1>
            <div style={{ marginTop: '60px' }}>
                <button
                    onClick={handleContinueShopping}
                    className="bg-transparent text-current font-semibold py-2 px-4 border rounded"
                    style={{ marginRight: '10px', color: dynamicColor, borderColor: dynamicColor }}
                >
                    Continue Shopping
                </button>
                <button
                    onClick={handleGoHome}
                    className="bg-transparent text-current font-semibold py-2 px-4 border rounded"
                    style={{ color: dynamicColor, borderColor: dynamicColor }}
                >
                    Go Back To Home Page
                </button>
            </div>
            <aside className="w-1/4 p-4 space-y-4">
                <img
                    src="/img/commande.png"
                    alt="GIF description"
                    style={{
                        width: "400px",
                        height: "300px",
                        maxWidth: "500px",
                        maxHeight: "500px"
                    }}
                />
            </aside>
            <div className="mt-4 text-center" style={{ color: dynamicColor }}>
                <p>Thank you for your purchase! You will receive a confirmation email shortly.</p>
            </div>
        </div>
    );
};

export default CommandeSuccess;
