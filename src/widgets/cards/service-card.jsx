import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import "@/widgets/assets/dispo.css";

function ServiceCard({ title, image, imagelogo, deliveryTime, price, user, productId, dispo, marque, dateAdded, promo, viewType }) {
  const navigate = useNavigate();
  
  // Calculate promo price if promo exists
  const promoPrice = promo ? (parseFloat(price) * (1 - Math.abs(promo) / 100)).toFixed(3) : parseFloat(price).toFixed(3);

  // Check if the product was added recently (within 2 days)
  const isNewProduct = () => {
    const currentDate = new Date();
    const addedDate = new Date(dateAdded);
    const diffTime = Math.abs(currentDate - addedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  };

  // Determine availability class based on `dispo`
  const dispoClass = dispo.toLowerCase() === 'in stock' ? 'text-green' : 'text-red';

  return (
    <div className={`service-card bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-6 hover:shadow-lg relative ${viewType === 'list' ? 'flex w-full h-[220px] pr-6' : 'flex flex-col max-w-xs h-[550px] w-[350px]'}`}> {/* Ajout de pr-6 pour le padding à droite */}
      
      {/* Product Image */}
      <div className={`${viewType === 'list' ? 'w-1/6 h-full' : 'h-55'} image-container relative overflow-hidden`}>
        <div className="rounded-t-lg h-full overflow-hidden">
          {image && (
            <img
              src={image}
              className={`service-image w-full h-full object-cover`}
              alt="Service Image"
            />
          )}
        </div>
      </div>
      
      {/* Product Information */}
      <div className={`p-3 flex flex-col justify-between ${viewType === 'list' ? 'w-5/6' : 'flex-grow'}`}>
        <div>
          {/* Product Title */}
          <h5 className="mb-1 text-xl font-bold tracking-tight text-gray-800 dark:text-white">
            {title}
          </h5>
          
          {/* Promo Price and Regular Price */}
          <div className="flex items-center mb-2">
            <p className="mr-2 font-normal text-gray-700 dark:text-gray-400">
              {deliveryTime}
            </p>
            <div className={`font-normal ${promo ? 'text-red-600' : 'text-gray-700 dark:text-gray-400'}`}>
              {promo ? (
                <>
                  <span className="line-through">{parseFloat(price).toFixed(3)} DT</span>
                  <br />
                  <span className="font-bold text-red-600">{promoPrice} DT</span>
                </>
              ) : (
                <>From {parseFloat(price).toFixed(3)} DT</>
              )}
            </div>
            
            {/* Recently Added Badge */}
            {isNewProduct() && (
              <div className="absolute top-3 left-3 bg-[#B60B59] text-white text-xs px-2 py-1 rounded-full">
                Recently Added
              </div>
            )}
            
            {/* Promo Badge */}
            {promo && (
              <div className="promo-badge">
                <span className="promo-discount">{promo}%</span>
                <span className="promo-off">OFF</span>
              </div>
            )}
          </div>
          
          <hr className="horizontal-line my-2" />
        </div>
        
        {/* Brand Logo and Name */}
        <div className="flex items-center mb-2 cursor-pointer" onClick={() => navigate(`/profile/${user.idUser}`)}>
          {/* Display Brand Logo or Default Logo */}
          {imagelogo ? (
            <img
              src={imagelogo}
              alt="Logo"
              className="h-11 w-11 mr-3 rounded-full"
            />
          ) : (
            <img
              src="/path/to/default-logo.png"  // Use a default logo if `imagelogo` is missing
              alt="Default Logo"
              className="h-11 w-11 mr-3 rounded-full"
            />
          )}
          <p className="font-normal text-gray-800 dark:text-gray-400">
            {marque}
          </p>
        </div>
        
        {/* Availability */}
        <div>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Disponibilité :
            <span className={`ml-2 font-normal ${dispoClass}`}>
              {dispo}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Define PropTypes for the component
ServiceCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  imagelogo: PropTypes.string, // Optional: logoUrl can be null or undefined
  deliveryTime: PropTypes.string,
  price: PropTypes.string.isRequired,
  user: PropTypes.shape({
    idUser: PropTypes.string.isRequired,
    profilePicture: PropTypes.string,
    ville: PropTypes.string,
    nom: PropTypes.string,
  }),
  productId: PropTypes.string.isRequired,
  dispo: PropTypes.string.isRequired,
  marque: PropTypes.string.isRequired,
  dateAdded: PropTypes.string.isRequired,
  promo: PropTypes.number,
  viewType: PropTypes.string.isRequired,
};

export default ServiceCard;
