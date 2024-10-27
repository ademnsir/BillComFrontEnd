import React, { useState, useEffect } from 'react';
import { useCart } from '@/pages/CartContext';
import { Typography, Button, Card } from "@material-tailwind/react";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import axios from 'axios';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Loading from "@/Components/GServices/Loading";

// Modal styles
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const Checkout = () => {
  const { cartItems, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    country: '',
    phone: '',
    email: ''
  });
  const [showDetails, setShowDetails] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('online'); // Default to 'online' payment method
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading effect

  const MySwal = withReactContent(Swal);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve the logged-in user information from local storage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser.idUser; // Ensure this matches the actual user ID field

        const response = await axios.get(`http://localhost:8083/tp/api/user/getUserById/${userId}`);
        const user = response.data;

        setFormData({
          firstName: user.prenom,
          lastName: user.nom,
          address: user.adresse,
          postalCode: user.codepostal,
          country: user.ville,
          phone: user.telephone,
          email: user.email
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const dynamicColor = '#28A6C4';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    setLoading(true);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser.idUser;

    const userUpdate = {
      idUser: userId,  // Ensure the user ID is included in the update
      nom: formData.lastName,
      prenom: formData.firstName,
      email: formData.email,
      adresse: formData.address,
      ville: formData.country,
      telephone: formData.phone,
      codepostal: formData.postalCode,
    };

    try {
      // Update user information
      await axios.put('http://localhost:8083/tp/api/user/updateUser', userUpdate);

      // Prepare order data
      const orderData = {
        totalPrice: getTotalPrice() + 4.700,
        user: userUpdate,
        products: cartItems.map(item => ({ id: item.id })),
      };

      setOrderTotal(orderData.totalPrice);
      setOrderData(orderData);

      if (paymentMethod === 'online') {
        const response = await fetch("http://localhost:8083/tp/api/payment/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              name: item.title,
              price: item.promo
                ? (parseFloat(item.price) * (1 - Math.abs(item.promo) / 100)).toFixed(2)
                : parseFloat(item.price).toFixed(2),
              quantity: item.quantity,
              description: item.description || "",
              image: `https://backendbillcom-production.up.railway.app/uploads/${item.image}`
            })),
            address: formData
          }),
        });

        const session = await response.json();

        if (session.error) {
          console.error("Payment failed: " + session.error);
          setLoading(false);
          return;
        }

        sessionStorage.setItem('paymentSuccess', 'true');

        const stripe = await loadStripe("pk_test_51OErmACis87pjNWpmR1mA9OY8bC9joB8m3yMTqOlDqonuPHoOla3qdFxRI4l23Rqpn4RjSQjj1H75UgBbpTr2Os800jsLoQ4TE");
        stripe.redirectToCheckout({ sessionId: session.id }).then(() => {
          navigate('/paymentSucces');
          setLoading(false);
        });
      } else {
        setModalIsOpen(true);
        setLoading(false);
      }

    } catch (error) {
      console.error('Error processing order:', error);
      setLoading(false);
    }
  };

  const confirmOrder = async () => {
    setLoading(true);
    try {
      const orderResponse = await axios.post('http://localhost:8083/tp/api/commandes/addCommande', orderData);

      if (orderResponse.status === 201) {
        sessionStorage.setItem('commandeSuccess', 'true');
        setModalIsOpen(false);
        MySwal.fire({
          position: 'bottom-right',
          icon: 'success',
          title: 'Order placed successfully!',
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: 'swal2-min-height' // Custom class for the minimal height
          }
        }).then(() => {
          navigate('/commandeSucces');
          setLoading(false);
        });
      } else {
        console.error('Error creating order.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      navigate('/errorpage'); // Navigate to error page if there's an error
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-40 p-4">
      <Loading isVisible={loading} /> {/* Add Loading component here */}
      <style>
        {`
          .custom-radio-container {
            display: flex;
            align-items: center;
          }

          .custom-radio {
            display: flex;
            align-items: center;
            margin-right: 20px;
          }

          .custom-radio input[type="radio"] {
            appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid ${dynamicColor};
            border-radius: 50%;
            margin-right: 10px;
            position: relative;
            outline: none;
          }

          .custom-radio input[type="radio"]:checked::before {
            content: '';
            display: block;
            width: 10px;
            height: 10px;
            background-color: ${dynamicColor};
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .custom-radio label {
            margin: 0;
            cursor: pointer;
          }
        `}
      </style>
      <Typography variant="h4" className="mb-6 text-center" style={{ color: dynamicColor, marginTop: '20px' }}>
        PERSONAL INFORMATION
      </Typography>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 lg:w-2/3 px-4 mb-6 md:mb-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <Typography variant="h6" className="font-bold">ADDRESSES</Typography>
              <p>The selected address will be used as both your billing and shipping address.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="border rounded p-2" />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="border rounded p-2" />
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="border rounded p-2" />
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" className="border rounded p-2" />
              <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="border rounded p-2" />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="border rounded p-2" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border rounded p-2" />
            </div>
            <div className="mt-6">
              <Typography variant="h6" className="font-bold mb-2">Payment Method</Typography>
              <div className="custom-radio-container">
                <div className="custom-radio">
                  <input 
                    type="radio" 
                    id="online" 
                    name="paymentMethod" 
                    value="online" 
                    checked={paymentMethod === 'online'} 
                    onChange={() => setPaymentMethod('online')} 
                  />
                  <label htmlFor="online">Online Payment</label>
                </div>
                <div className="custom-radio">
                  <input 
                    type="radio" 
                    id="delivery" 
                    name="paymentMethod" 
                    value="delivery" 
                    checked={paymentMethod === 'delivery'} 
                    onChange={() => setPaymentMethod('delivery')} 
                  />
                  <label htmlFor="delivery">Payment on Delivery</label>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button 
                className="flex items-center border text-white"
                style={{ borderColor: dynamicColor, backgroundColor: dynamicColor }}
                onClick={handlePayment}
              >
                Pay
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 px-4">
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <Typography variant="h5" className="font-bold">Show Details</Typography>
              <button onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
            {showDetails && (
              <div className="my-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-4">
                    <img src={`https://backendbillcom-production.up.railway.app/uploads/${item.image}`} alt={item.title} className="w-20 h-20 rounded" />
                    <Typography className="flex-grow ml-4">{item.title}</Typography>
                    <Typography>{item.quantity} x {parseFloat(item.price).toFixed(3)} DT</Typography>
                    <Typography className="font-bold text-red-500">{(item.quantity * parseFloat(item.price)).toFixed(3)} DT</Typography>
                  </div>
                ))}
              </div>
            )}
            <hr className="my-4" />
            <div className="flex justify-between">
              <Typography variant="h6" className="font-bold">Subtotal</Typography>
              <Typography>{getTotalPrice().toFixed(3)} DT</Typography>
            </div>
            <div className="flex justify-between mt-2">
              <Typography variant="h6" className="font-bold">Shipping</Typography>
              <Typography>4.700 DT</Typography>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between">
              <Typography variant="h6" className="font-bold">Total</Typography>
              <Typography className="font-bold text-red-500">{(getTotalPrice() + 4.700).toFixed(3)} DT</Typography>
            </div>
          </Card>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Order Success"
      >
        <Typography variant="h5" className="font-bold">Order Confirmation</Typography>
        <Typography className="my-4">Are you sure you want to place this order?</Typography>
        <Typography className="my-4">Total Amount: {orderTotal.toFixed(3)} DT</Typography>
        <div className="flex justify-between">
          <Button onClick={confirmOrder} className="text-white" style={{ backgroundColor: dynamicColor }}>
            Yes, I Confirm
          </Button>
          <Button onClick={() => setModalIsOpen(false)} className="bg-gray-500 text-white">
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;
