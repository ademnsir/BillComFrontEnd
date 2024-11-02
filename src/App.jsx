// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import './App.css';
import Navbar from "./Components/Navbar/Navbar";
import Home from "./pages/home";
import { AuthProvider } from "./pages/authContext";
import { CartProvider } from "@/pages/CartContext";
import Profile from "@/Components/Authentification/profile";
import Loading from "@/Components/GServices/Loading";
import { LanguageProvider } from '@/pages/LanguageContext';
import Alan from "./Components/Authentification/Alan";
import Breadcrumbs from "@/Components/GServices/Breadcrumbs"; // Correct path
import { UserProvider } from "@/pages/UserContext";// Import du UserProvider

function App() {
  const { i18n } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');

  const routes = [
    // Define your routes here, if needed
  ];

  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isMeeting = location.pathname.startsWith('/meeting');
  const isDetailsPage = location.pathname.startsWith('/productDetails');
  const isProfilePage = location.pathname.startsWith('/profile');
  const isCartPage = location.pathname.startsWith('/cart');
  const ischeckoutPage = location.pathname.startsWith('/checkout');
  const isSignupPage = location.pathname.startsWith('/sign-up');
  const isSigninPage = location.pathname.startsWith('/sign-in');
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleRouteChange = () => {
      if (location.pathname !== '/cart' && location.pathname !== '/payment-success' && location.pathname !== '/commande-success') {
        localStorage.setItem('previousRoute', JSON.stringify({
          pathname: location.pathname,
          search: location.search,
          scrollY: window.scrollY,
        }));
      }
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [location]);

  const handleAction = (callback) => {
    setIsLoading(true);
    setTimeout(() => {
      callback();
      setIsLoading(false);
    }, 2000);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <UserProvider> {/* Enveloppe l'application pour partager l'image de l'utilisateur globalement */}
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            {!isDashboard && <Navbar routes={routes} setIsLoggedIn={setIsLoggedIn} changeLanguage={changeLanguage} />} 
            {!isHomePage && !isDetailsPage && !isProfilePage && !isCartPage && !ischeckoutPage && !isSignupPage && !isSigninPage && <Breadcrumbs />}
            <Routes>
              <Route path="/" element={<Home isLoggedIn={isLoggedIn} handleAction={handleAction} />} /> 
              {/* Add other routes here */}
            </Routes>
            <Outlet />

            <Alan />
            {!isMeeting && (
              <div className="fixed bottom-5 right-5">
                {/* Add any fixed components here */}
              </div>
            )}
            {!isMeeting && (
              <div className="fixed bottom-5 left-5">
                {/* Add any fixed components here */}
              </div>
            )}
          </CartProvider>
        </AuthProvider>
        <Loading isVisible={isLoading} />
      </LanguageProvider>
    </UserProvider>
  );
}

export default App;