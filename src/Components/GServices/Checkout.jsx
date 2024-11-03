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
import { useAuth } from "@/pages/authContext";

// Configure Modal for accessibility
Modal.setAppElement('#root');

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
    telephone: '',
    email: ''
  });
  const [deliveryConfirmationOpen, setDeliveryConfirmationOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('online'); // Default to 'online' payment method
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading effect
  const { authData } = useAuth();  // Get user data from AuthContext

  const MySwal = withReactContent(Swal);

  // Fonction pour initialiser formData
  const initializeFormData = (user) => {
    setFormData({
      firstName: user?.prenom ?? '',
      lastName: user?.nom ?? '',
      address: user?.adresse ?? '',
      postalCode: user?.codePostal ?? '',
      country: user?.pays ?? '',
      telephone: user?.telephone ?? '',
      email: user?.email ?? '',
    });
  };

  // Fetch user data when the component mounts or authData changes
  useEffect(() => {
    if (authData && authData.user) {
      initializeFormData(authData.user);
    } else {
      try {
        const storedData = JSON.parse(localStorage.getItem('authData'));
        if (storedData && storedData.user) {
          initializeFormData(storedData.user);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur depuis le local storage :', error);
      }
    }
  }, [authData]);

  const dynamicColor = '#28A6C4';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value ?? ''
    }));
  };

  const handlePayment = async () => {
    if (paymentMethod === 'delivery') {
      // Payment on delivery: Open confirmation modal
      handleDeliveryOrder();
    } else if (paymentMethod === 'online') {
      // Online payment: Proceed with Stripe
      await handleStripePayment();
    }
  };

  const handleDeliveryOrder = () => {
    setDeliveryConfirmationOpen(true);
  };

  const handleStripePayment = async () => {
    setLoading(true);
    let storedUser = authData;
    if (!storedUser || !storedUser.user || !storedUser.user._id) {
        try {
            const storedData = JSON.parse(localStorage.getItem('authData'));
            if (storedData && storedData.user) {
                storedUser = storedData;
            }
        } catch (error) {
            console.error('Error parsing stored auth data:', error);
        }
    }

    if (!storedUser || !storedUser.user || !storedUser.user._id) {
        setLoading(false);
        MySwal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Utilisateur non authentifié. Veuillez vous connecter.',
        });
        navigate('/login');
        return;
    }

    try {
        const items = cartItems.map(item => ({
            name: item.title,
            description: item.description || 'No description',
            image: item.image,
            price: parseFloat(item.price),
            quantity: item.quantity,
        }));

        const orderData = { items, address: formData.address };

        const response = await axios.post("https://backendbillcom-production.up.railway.app/tp/api/payment/create-checkout-session", orderData);
        const session = response.data;

        if (session.error) {
            throw new Error(session.error);
        }

        const stripe = await loadStripe("pk_test_51OErmACis87pjNWpmR1mA9OY8bC9joB8m3yMTqOlDqonuPHoOla3qdFxRI4l23Rqpn4RjSQjj1H75UgBbpTr2Os800jsLoQ4TE");
        const result = await stripe.redirectToCheckout({ sessionId: session.id });

        if (result.error) {
            throw result.error;
        }
    } catch (error) {
        console.error('Error during Stripe payment process:', error);
        MySwal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.',
        });
        setLoading(false);
    }
};

const confirmOrder = async () => {
  setLoading(true);
  try {
      // Retrieve user ID and details from authData or formData
      const userId = authData?.user?._id || formData.userId;
      const userDetails = {
          nom: authData?.user?.nom || formData.lastName,
          prenom: authData?.user?.prenom || formData.firstName,
          telephone: authData?.user?.telephone || formData.telephone
      };

      if (!userId || !userDetails.nom || !userDetails.prenom || !userDetails.telephone) {
          console.error('User details are missing.');
          setLoading(false);
          await MySwal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Informations utilisateur manquantes.',
          });
          navigate('/login');
          return;
      }

      const products = cartItems.map(item => item.id || item._id);
      if (products.includes(undefined)) {
          console.warn('Some products have undefined IDs.');
      }

      const orderData = {
          totalPrice: getTotalPrice() + 4.700,
          user: userId,
          products,
          address: formData.address,
          paymentMethod: paymentMethod,
          userDetails // Include user details in the request
      };

      const orderResponse = await axios.post(
          'https://backendbillcom-production.up.railway.app/tp/api/orders/addOrder',
          orderData
      );

      if (orderResponse.status === 201) {
          sessionStorage.setItem('commandeSuccess', 'true');
          setModalIsOpen(false);

          await MySwal.fire({
              position: 'bottom-right',
              icon: 'success',
              title: 'Order placed successfully!',
              showConfirmButton: false,
              timer: 3000,
          });

          setLoading(false);
          navigate('/store?type=all');
      } else {
          console.error('Error creating order. Status:', orderResponse.status);
          setLoading(false);
          await MySwal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la création de votre commande.',
          });
      }
  } catch (error) {
      console.error('Error confirming order:', error.response ? error.response.data : error.message);
      setLoading(false);
      await MySwal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la confirmation de votre commande.',
      });
  }
};



  return (
    <div className="container mx-auto mt-40 p-4">
      <Loading isVisible={loading} />
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
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="telephone"
                className="border rounded p-2"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border rounded p-2"
              />
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
        <Typography className="my-4">Total Amount: {(getTotalPrice() + 4.700).toFixed(3)} DT</Typography>
        <div className="flex justify-between">
          <Button onClick={confirmOrder} className="text-white" style={{ backgroundColor: dynamicColor }}>
            Yes, I Confirm
          </Button>
          <Button onClick={() => setModalIsOpen(false)} className="bg-gray-500 text-white">
            Close
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={deliveryConfirmationOpen}
        onRequestClose={() => setDeliveryConfirmationOpen(false)}
        style={customStyles}
        contentLabel="Order Confirmation"
      >
        <Typography variant="h5" className="font-bold">Order Confirmation</Typography>
        
        <Typography className="my-4">You are ready to place an order with payment on delivery. Are you sure?</Typography>
        <div className="my-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-4">
                    <img src={`https://backendbillcom-production.up.railway.app/uploads/${item.image}`} alt={item.title} className="w-20 h-20 rounded" />
                    <Typography className="flex-grow ml-4">{item.title}</Typography>
                    <Typography>{item.quantity} x {parseFloat(item.price).toFixed(3)} DT</Typography>
                 
                  </div>
                ))}
              </div>
              <hr></hr>
              <br></br>
        <Typography className="font-bold text-red-500">Total Price :{(getTotalPrice() + 4.700).toFixed(3)} DT</Typography>
        <br></br>
        
        <div className="flex justify-between">
          <Button
            onClick={() => {
              confirmOrder();
              setDeliveryConfirmationOpen(false);
            }}
            className="text-white"
            style={{ backgroundColor: dynamicColor }}
          >
            Yes, Confirm
          </Button>
          <Button
            onClick={() => setDeliveryConfirmationOpen(false)}
            className="bg-gray-500 text-white"
          >
            No, Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;
