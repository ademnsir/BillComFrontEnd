// src/pages/Loading.jsx
import React from 'react';

const Loading = ({ isVisible }) => {
  if (!isVisible) return null;
  return (
    <div className="loading-overlay">
      <img src="/img/logosans.png" alt="Loading" className="loading-image" />
      
    </div>
  );
};

export default Loading;
