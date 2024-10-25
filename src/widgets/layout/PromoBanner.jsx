import React from 'react';
import { useNavigate } from 'react-router-dom';
import "@/widgets/assets/PromoBanner.css";

const PromoBanner = ({ products }) => {
  const navigate = useNavigate();

  const handleBannerClick = (productId) => {
    navigate(`/productDetails/${productId}`);
  };

  const handleError = (e) => {
    e.target.src = 'path/to/fallback-image.png'; // Add a valid path to your fallback image
  };

  return (
    <div className="promo-banner-grid">
      {products.map((product, idx) => (
        <div className="promo-card" key={idx}>
          <div className="promo-banner relative p-4 rounded-lg shadow-md text-white">
            {product.imgProduitenPromo ? (
              <img
                className="promo-image w-full bg-cover bg-center rounded-lg shadow-lg cursor-pointer"
                src={`http://localhost:8083/tp/uploads/${product.imgProduitenPromo}`}
                alt={product.title}
                onClick={() => handleBannerClick(product.id)}
                onError={handleError}
              />
            ) : (
              <div className="promo-image-placeholder">No Image Available</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromoBanner;
