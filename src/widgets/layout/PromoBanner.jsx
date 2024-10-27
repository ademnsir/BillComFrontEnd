import React from 'react';
import { useNavigate } from 'react-router-dom';
import "@/widgets/assets/PromoBanner.css"; // Ensure this path is correct for your CSS file

const PromoBanner = ({ products }) => {
  const navigate = useNavigate();

  const handleBannerClick = (productId) => {
    navigate(`/productDetails/${productId}`); // Navigates to the product details page
  };

  const handleError = (e) => {
    e.target.src = '/path/to/fallback-image.png'; // Add a valid path to your fallback image here
  };

  return (
    <div className="promo-banner-grid">
      {products.map((product, idx) => (
        <div className="promo-card" key={idx}>
          <div className="promo-banner relative p-4 rounded-lg shadow-md text-white">
            {product.imgProduitenPromo ? (
              <img
                className="promo-image w-full bg-cover bg-center rounded-lg shadow-lg cursor-pointer"
                src={`https://backendbillcom-production.up.railway.app/uploads/${product.imgProduitenPromo}`}
                alt={product.title}
                onClick={() => handleBannerClick(product._id)} // Use `_id` to match the product's unique ID
                onError={handleError} // Handles image error fallback
              />
            ) : (
              <div className="promo-image-placeholder">No Image Available</div> // Fallback if no image is available
            )}
          </div>
         
        </div>
      ))}
    </div>
  );
};

export default PromoBanner;
