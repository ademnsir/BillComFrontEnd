import React, { useState, useEffect } from 'react';
import { useCart } from '@/pages/CartContext';
import { Typography, Button } from "@material-tailwind/react";
import { FiTrash2, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Footer from "@/widgets/layout/Footer";
import Loading from "@/Components/GServices/Loading";

const Payment = () => {
  const { cartItems, getTotalPrice, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleContinueShopping = () => {
    setLoading(true);
    const previousRoute = JSON.parse(localStorage.getItem('previousRoute'));
    setTimeout(() => {
      if (previousRoute && previousRoute.pathname.startsWith('/store')) {
        const { pathname, search, scrollY } = previousRoute;
        navigate(`${pathname}${search}`);
        setTimeout(() => {
          window.scrollTo(0, scrollY);
          setLoading(false);
        }, 0);
      } else {
        navigate('/store?type=all');
        setLoading(false);
      }
    }, 500); // Simulate a brief loading delay
  };

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/checkout');
      setLoading(false);
    }, 500); // Simulate a brief loading delay
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Loading isVisible={loading} />
      <div className="container mx-auto mt-40 p-4 flex-grow">
        <Typography variant="h4" className="mb-6" style={{ color: '#3D92F1' }}>
          CART
        </Typography>
        <div className="bg-white rounded-lg shadow-md p-6" style={{ marginLeft: '-80px', marginBottom: '400px'}}>
          {cartItems.length === 0 ? (
            <Typography className="text-center" style={{ color: '#3D92F1' }}>Your cart is empty</Typography>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between mb-4">
                <img src={`http://localhost:8083/tp/uploads/${item.image}`} alt={item.title} className="w-20 h-20 rounded" />
                <div className="flex-grow ml-4">
                  <Typography variant="h6" className="font-bold">{item.title}</Typography>
                  {item.promo ? (
                    <div className="text-gray-500">
                      <span className="line-through block">{parseFloat(item.price).toFixed(3)} $US</span>
                      <span className="font-bold text-red-600">
                        {(parseFloat(item.price) * (1 - Math.abs(item.promo) / 100)).toFixed(3)} $US
                      </span>
                    </div>
                  ) : (
                    <Typography className="text-gray-500">
                      {typeof parseFloat(item.price) === 'number' && !isNaN(parseFloat(item.price)) ? parseFloat(item.price).toFixed(3) : "N/A"} $US
                    </Typography>
                  )}
                </div>
                <div className="flex items-center">
                  <select
                    className="custom-select border rounded p-2 text-center"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                  >
                    {[...Array(10).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <Typography className="ml-4 font-bold">
                    {item.promo ? (
                      (parseFloat(item.price) * (1 - Math.abs(item.promo) / 100) * item.quantity).toFixed(3)
                    ) : (
                      typeof parseFloat(item.price) === 'number' && !isNaN(parseFloat(item.price)) ? (parseFloat(item.price) * item.quantity).toFixed(3) : "N/A"
                    )} $US
                  </Typography>
                  <FiTrash2 className="ml-4 text-red-500 cursor-pointer" onClick={() => removeFromCart(item.id)} />
                </div>
              </div>
            ))
          )}
          {cartItems.length > 0 && (
            <>
              <hr className="my-4" />
              <div className="flex justify-between items-center">
                <Typography variant="h5" className="font-bold">
                  Total TTC
                </Typography>
                <Typography variant="h5" className="font-bold text-red-500">
                  {getTotalPrice().toFixed(3)} $US
                </Typography>
              </div>
              <div className="flex justify-between mt-6">
                <Button 
                  className="flex items-center border"
                  style={{ borderColor: '#3D92F1', color: '#3D92F1', backgroundColor: 'white' }}
                  onClick={handleContinueShopping}
                >
                  <FiArrowLeft className="mr-2" />
                  Continue Shopping
                </Button>
                <Button 
                  className="flex items-center border"
                  style={{ borderColor: '#3D92F1', color: 'white', backgroundColor: '#3D92F1' }}
                  onClick={handleCheckout}
                >
                  Order Now
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
