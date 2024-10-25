// LoadingOverlay.jsx
import React from 'react';
import logo from "/public/img/log.png"; // Remplacez par le chemin de votre logo
import "@/widgets/assets/LoadingOverlay.css";

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <img src={logo} alt="Loading" className="loading-logo" />
    </div>
  );
};

export default LoadingOverlay;
