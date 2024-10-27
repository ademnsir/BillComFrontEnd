import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/pages/authContext";
import { useCart } from "@/pages/CartContext";
import axios from "axios";
import Swal from "sweetalert2";
import "@/widgets/assets/ServiceDetails.css";
import { Footer } from "@/widgets/layout/Footer";
import Loading from "@/Components/GServices/Loading";
import Breadcrumbs from "@/Components/GServices/Breadcrumbs";
import { FiShoppingCart, FiShoppingBag, FiThumbsUp, FiThumbsDown, FiBook, FiFlag, FiUpload } from 'react-icons/fi';

import { Input, Button, Typography } from "@material-tailwind/react";
import ReactDOMServer from 'react-dom/server';
import { format } from 'date-fns';

const ServiceDetails = ({ loading }) => {

  const handleChangeQuantity = (e) => {
    setQuantity(e.target.value);
  };

  const handleScrollToReviews = () => {
    const reviewsSection = document.getElementById('reviews-section');
    if (reviewsSection) {
      const yOffset = -window.innerHeight * 0.50; // 10% of the viewport height
      const y = reviewsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const [images, setImages] = useState([]);
  const [userDetailsMap, setUserDetailsMap] = useState({});
  const [serviceDetails, setServiceDetails] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState('productInfo');
  const [selectedSubTab, setSelectedSubTab] = useState('listReviews');
  const [review, setReview] = useState({ name: '', comment: '', priceRating: 5, valueRating: 5, qualityRating: 5 });
  const [errors, setErrors] = useState({});
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewIndex, setSelectedReviewIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [likeStatus, setLikeStatus] = useState({});
  const [dislikeStatus, setDislikeStatus] = useState({});

  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({
    quality: 0,
    price: 0,
    value: 0,
  });


  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, cartItems, getTotalPrice } = useCart();
  const { authData } = useAuth();

  const formatDate = (date) => format(new Date(date), 'dd MMM, yyyy');
  const maskNom = (nom) => {
    return '*'.repeat(nom.length);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 2) {
      Swal.fire({
        icon: 'error',
        title: 'Too many files',
        text: 'You can only upload up to 2 images.',
      });
      return;
    }
    setImages(files);
  };

  // useEffect(() => {
  //   const fetchReviewsWithUserDetails = async () => {
  //     try {
  //       const reviewsResponse = await axios.get(`https://backendbillcom-production.up.railway.app/tp/api/reviews/product/${id}`);
  //       const reviewsData = reviewsResponse.data;

  //       const userIds = reviewsData.map(review => review.user_id);
  //       const userDetailsResponse = await axios.post(`http://localhost:8083/tp/api/users/details`, { userIds });

  //       const userDetails = userDetailsResponse.data.reduce((acc, user) => {
  //         acc[user.id] = user;
  //         return acc;
  //       }, {});

  //       setUserDetailsMap(userDetails);
  //       setReviews(reviewsData);
  //     } catch (error) {
  //       console.error("Error fetching reviews and user details:", error);
  //     }
  //   };

  //   fetchReviewsWithUserDetails();
  // }, [id]);


  // const handleLike = async (reviewId) => {
  //   const user = JSON.parse(localStorage.getItem("user"));

  //   if (!user || !user.idUser || !reviewId) {
  //     console.error("Review ID or User ID is null or undefined.");
  //     return;
  //   }

  //   const likeData = new FormData();
  //   likeData.append("user.idUser", user.idUser);

  //   try {
  //     const response = await axios.post(`http://localhost:8083/tp/api/reviews/${reviewId}/like`, likeData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     setReviews((prevReviews) =>
  //       prevReviews.map((review) => (review.id === reviewId ? response.data : review))
  //     );

  //     setLikeStatus((prevState) => ({
  //       ...prevState,
  //       [reviewId]: !prevState[reviewId],
  //     }));

  //     if (dislikeStatus[reviewId]) {
  //       setDislikeStatus((prevState) => ({
  //         ...prevState,
  //         [reviewId]: false,
  //       }));
  //     }

  //     // Add animation class
  //     const likeButton = document.getElementById(`like-button-${reviewId}`);
  //     if (likeButton) {
  //       likeButton.classList.add('liked');
  //       setTimeout(() => likeButton.classList.remove('liked'), 500); // Match the animation duration
  //     }
  //   } catch (error) {
  //     console.error("Error liking review:", error);
  //   }
  // };

  // const handleDislike = async (reviewId) => {
  //   const user = JSON.parse(localStorage.getItem("user"));

  //   if (!user || !user.idUser || !reviewId) {
  //     console.error("Review ID or User ID is null or undefined.");
  //     return;
  //   }

  //   const dislikeData = new FormData();
  //   dislikeData.append("user.idUser", user.idUser);

  //   try {
  //     const response = await axios.post(`http://localhost:8083/tp/api/reviews/${reviewId}/dislike`, dislikeData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     setReviews((prevReviews) =>
  //       prevReviews.map((review) => (review.id === reviewId ? response.data : review))
  //     );

  //     setDislikeStatus((prevState) => ({
  //       ...prevState,
  //       [reviewId]: !prevState[reviewId],
  //     }));

  //     if (likeStatus[reviewId]) {
  //       setLikeStatus((prevState) => ({
  //         ...prevState,
  //         [reviewId]: false,
  //       }));
  //     }

  //     // Add animation class
  //     const dislikeButton = document.getElementById(`dislike-button-${reviewId}`);
  //     if (dislikeButton) {
  //       dislikeButton.classList.add('disliked');
  //       setTimeout(() => dislikeButton.classList.remove('disliked'), 500); // Match the animation duration
  //     }
  //   } catch (error) {
  //     console.error("Error disliking review:", error);
  //   }
  // };




  useEffect(() => {
    // Fetch product details using the `id` param
    const fetchServiceDetails = async () => {
      if (id) {  // Add a check to ensure id exists
        try {
          console.log("hetha" + id)
          const response = await axios.get(`https://backendbillcom-production.up.railway.app/tp/api/products/${id}`);
          setServiceDetails(response.data);
          setCurrentImage(response.data.image);
        } catch (error) {
          console.error("Error fetching service details:", error);
        }
      } else {
        console.error("Product ID is undefined");
      }
    };

    // async function fetchReviews() {
    //   try {
    //     const response = await axios.get(`http://localhost:8083/tp/api/reviews/product/${id}`);
    //     const reviewsData = response.data;
    //     setReviews(reviewsData);

    //     // Calculate the average and distribution of ratings
    //     const totalReviews = reviewsData.length;

    //     const totalQualityRating = reviewsData.reduce((sum, review) => sum + review.qualityRating, 0);
    //     const totalPriceRating = reviewsData.reduce((sum, review) => sum + review.priceRating, 0);
    //     const totalValueRating = reviewsData.reduce((sum, review) => sum + review.valueRating, 0);

    //     const averageRating = (totalQualityRating + totalPriceRating + totalValueRating) / (totalReviews * 3);

    //     const qualityRatingPercentage = (totalQualityRating / (totalReviews * 5)) * 100;
    //     const priceRatingPercentage = (totalPriceRating / (totalReviews * 5)) * 100;
    //     const valueRatingPercentage = (totalValueRating / (totalReviews * 5)) * 100;

    //     setAverageRating(averageRating.toFixed(2));
    //     setRatingDistribution({
    //       quality: qualityRatingPercentage.toFixed(2),
    //       price: priceRatingPercentage.toFixed(2),
    //       value: valueRatingPercentage.toFixed(2),
    //     });

    //     // Fetch like and dislike statuses
    //     const user = JSON.parse(localStorage.getItem("user"));
    //     if (user) {
    //       const likeDislikeResponse = await axios.get(`http://localhost:8083/tp/api/reviews/user-review-status/${user.idUser}/${id}`);
    //       const { likes, dislikes } = likeDislikeResponse.data;
    //       setLikeStatus(likes);
    //       setDislikeStatus(dislikes);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching reviews:", error);
    //   }
    // }

    fetchServiceDetails();
    //fetchReviews();
  }, [id]);


  const handleAddToCart = () => {
    const promoPrice = serviceDetails.promo
      ? (parseFloat(serviceDetails.prix) * (1 - Math.abs(serviceDetails.promo) / 100)).toFixed(3)
      : null;

    const itemPrice = promoPrice ? parseFloat(promoPrice) : parseFloat(serviceDetails.prix);
    const item = {
      id: serviceDetails.id,
      title: serviceDetails.title,
      price: itemPrice,
      image: serviceDetails.image,
      quantity: parseInt(quantity),
    };
    addToCart(item);

    const totalCartPrice = getTotalPrice();
    const totalIncludingNewItem = (totalCartPrice + itemPrice * item.quantity).toFixed(3);

    const cartIcon = ReactDOMServer.renderToString(<FiShoppingBag style={{ marginRight: '8px', color: '#666' }} />);

    Swal.fire({
      title: '<h4 style="font-size: 15px; color: #3D92F1;">Product added to cart successfully!</h4>',
      html: `
        <div style="display: flex; align-items: flex-start;">
          <img src="https://backendbillcom-production.up.railway.app/uploads/${serviceDetails.image}" alt="Product image" style="width: 100px; height: 100px; object-fit: contain; margin-right: 20px;">
          <div>
            <h3 style="margin: 0; font-size: 11px; color: gray; line-height: 1.2;">${serviceDetails.title}</h3>
            <p style="margin: 5px 0; font-size: 16px; color: #e60000; font-weight: bold; line-height: 1.2;">${itemPrice.toFixed(3)} DT</p>
            <p style="margin: 5px 0; font-size: 14px; color: #333; line-height: 1.2;">Qty: ${quantity}</p>
          </div>
        </div>
        <hr style="border-top: 1px solid #ccc; margin: 10px 0;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <p style="margin: 0; font-size: 14px; color: #666; display: flex; align-items: center;">
            ${cartIcon} There are ${cartItems.length} items in your cart.
          </p>
          <p style="margin: 0; font-size: 16px; color: #e60000; font-weight: bold;">
            Total: ${totalIncludingNewItem} DT TTC
          </p>
        </div>
      `,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Checkout',
      cancelButtonText: 'Continue Shopping',
      customClass: {
        popup: 'sweet-alert-popup',
        image: 'sweet-alert-image',
        title: 'sweet-alert-title',
        content: 'sweet-alert-content',
        actions: 'sweet-alert-actions',
        confirmButton: 'button-24',
        cancelButton: 'button-24'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/cart');
      }
    });

    const styles = document.createElement('style');
    styles.innerHTML = `
      .button-24 {
        background-color: transparent;
        background-image: linear-gradient(#fff, #f5f5fa);
        border: 0 solid #003dff;
        border-radius: 9999px;
        box-shadow: rgba(37, 44, 97, .15) 0 4px 11px 0, rgba(93, 100, 148, .2) 0 1px 3px 0;
        box-sizing: border-box;
        color: #484c7a;
        cursor: pointer;
        display: inline-flex;
        font-family: Hind, system-ui, BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        font-weight: 600;
        margin: 4px;
        padding: 16px 24px;
        text-align: center;
        text-decoration: inherit;
        text-wrap: nowrap;
        transition: all .2s ease-out;
        transition-behavior: normal;
        white-space-collapse: collapse;
        line-height: 1.15;
      }

      @media (min-width: 576px) {
        .button-24 {
          padding-bottom: 10px;
          padding-top: 10px;
        }
      }

      .button-24:after, .button-24:before, .div-flex-items-center-justify-center:after, .div-flex-items-center-justify-center:before, .span-flex-items-center-h-16-w-auto-mr-8-py-2-flex-grow-0-flex-shrink-0-fill-current:after, .span-flex-items-center-h-16-w-auto-mr-8-py-2-flex-grow-0-flex-shrink-0-fill-current:before, .svg-block-h-full:after, .svg-block-h-full:before {
        border: 0 solid #003dff;
        box-sizing: border-box;
      }

      .button-24:hover {
        box-shadow: rgba(37, 44, 97, .15) 0 8px 22px 0, rgba(93, 100, 148, .2) 0 4px 6px 0;
      }

      .button-24:disabled {
        cursor: not-allowed;
        opacity: .5;
      }
    `;
    document.head.appendChild(styles);
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { offsetWidth, offsetHeight } = target;

    const x = (offsetX / offsetWidth) * 100;
    const y = (offsetY / offsetHeight) * 100;

    setZoomStyle({
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(https://backendbillcom-production.up.railway.app/uploads/${currentImage})`,
    });
  };

  const handleMouseEnter = () => {
    setIsZoomVisible(true);
  };

  const handleMouseLeave = () => {
    setIsZoomVisible(false);
    setZoomStyle({});
  };

  const handleImageClick = (image) => {
    setCurrentImage(image);
  };

  const handleNextImage = () => {
    const images = [serviceDetails.image, serviceDetails.img1, serviceDetails.img2, serviceDetails.img3, serviceDetails.img4];
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setCurrentImage(images[nextIndex]);
  };

  const handlePrevImage = () => {
    const images = [serviceDetails.image, serviceDetails.img1, serviceDetails.img2, serviceDetails.img3, serviceDetails.img4];
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setCurrentImage(images[prevIndex]);
  };

  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
    if (tab === 'clientReviews') {
      setSelectedSubTab('listReviews');
    }
  };

  const handleSubTabSelect = (subTab) => {
    setSelectedSubTab(subTab);
  };


  const ReviewImages = ({ review, reviewIndex }) => {
    return (
      <div className="review-images-container">
        {review.imgreview1 && (
          <div
            className="review-image review-image-1"
            onClick={() => handleReviewImageClick(reviewIndex, 0)}
          >
            <img
              src={`https://backendbillcom-production.up.railway.app/uploads/${currentImage}`}
              alt={serviceDetails.title}
              className="rounded-lg w-full"
            />
          </div>
        )}
        {review.imgreview2 && (
          <div
            className="review-image review-image-2"
            onClick={() => handleReviewImageClick(reviewIndex, 1)}
          >
            <img
              src={`https://backendbillcom-production.up.railway.app/uploads/${review.imgreview2}`}
              alt="Review image 2"
              className="review-img"
            />
          </div>
        )}
        <style jsx>{`
                .review-images-container {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    margin-left: auto;
                }
                .review-image {
                    position: relative;
                    width: 150px;
                    height: 150px;
                    border-radius: 20px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                    cursor: pointer;
                    margin-left: -20px;
                }
                .review-image-1 {
                    z-index: 2;
                }
                .review-image-2 {
                    z-index: 1;
                }
                .review-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 20px;
                }
            `}</style>
      </div>
    );
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!review.name) {
      errors.name = "Name is required.";
    } else if (/^\d+$/.test(review.name)) {
      errors.name = "Name cannot be only numbers.";
    }

    if (!review.comment) {
      errors.comment = "Comment is required.";
    } else if (/^\d+$/.test(review.comment)) {
      errors.comment = "Comment cannot be only numbers.";
    }

    if (review.priceRating <= 0 || review.priceRating > 5) {
      errors.priceRating = "Please provide a valid rating for Price.";
    }
    if (review.valueRating <= 0 || review.valueRating > 5) {
      errors.valueRating = "Please provide a valid rating for Value.";
    }
    if (review.qualityRating <= 0 || review.qualityRating > 5) {
      errors.qualityRating = "Please provide a valid rating for Quality.";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.idUser) {
      console.error("No valid user found in localStorage");
      setErrors({ submit: "No valid user found" });
      return;
    }

    const reviewData = new FormData();
    reviewData.append("name", review.name);
    reviewData.append("comment", review.comment);
    reviewData.append("priceRating", review.priceRating);
    reviewData.append("valueRating", review.valueRating);
    reviewData.append("qualityRating", review.qualityRating);
    reviewData.append("user.idUser", user.idUser);
    reviewData.append("product.id", serviceDetails.id);
    reviewData.append("date", new Date().toISOString());

    if (images.length > 0) {
      reviewData.append("imgreview1", images[0], images[0].name);
    }
    if (images.length > 1) {
      reviewData.append("imgreview2", images[1], images[1].name);
    }

    try {
      const response = await axios.post(`http://localhost:8083/tp/api/reviews/add`, reviewData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setReviews([...reviews, response.data]);
      setReview({ name: '', comment: '', priceRating: 5, valueRating: 5, qualityRating: 5 });
      setImages([]);

      // Met à jour l'onglet avant d'afficher l'alerte
      setSelectedSubTab('listReviews');

      Swal.fire({
        title: 'Success!',
        text: 'Your review has been submitted successfully.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,  // 2 secondes
        timerProgressBar: true,
      }).then(() => {
        setTimeout(() => {
          setSelectedSubTab('listReviews'); // Redirection après le délai
        }, 3000); // 2 secondes
      });
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        setErrors({ submit: `Error: ${error.response.data.message || "Failed to submit review."}` });
      } else {
        console.error("Error:", error.message);
        setErrors({ submit: "Failed to submit review. Please try again later." });
      }
    }
  };


  const handleStarClick = (category, index) => {
    setReview({ ...review, [category]: index });
  };

  const handleReviewImageClick = (reviewIndex, imageIndex) => {
    setSelectedReviewIndex(reviewIndex);
    setSelectedImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  const handleReviewChange = (fieldName, value) => {
    const errorsCopy = { ...errors };

    // Valider le champ en temps réel
    if (fieldName === 'name' || fieldName === 'comment') {
      if (!value) {
        errorsCopy[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
      } else if (/^\d+$/.test(value)) {
        errorsCopy[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot be only numbers.`;
      } else {
        delete errorsCopy[fieldName];
      }
    }

    // Mettre à jour l'état des erreurs
    setErrors(errorsCopy);

    // Mettre à jour l'état de la revue
    setReview({ ...review, [fieldName]: value });
  };


  const getReviewImageUrl = () => {
    const review = reviews[selectedReviewIndex];
    return review ? review[`imgreview${selectedImageIndex + 1}`] : null;
  };

  if (!serviceDetails) {
    return <div>Loading...</div>;
  }

  const promoPrice = serviceDetails.promo
    ? (parseFloat(serviceDetails.prix) * (1 - Math.abs(serviceDetails.promo) / 100)).toFixed(3)
    : parseFloat(serviceDetails.prix).toFixed(3);

  const amountSaved = serviceDetails.promo
    ? (parseFloat(serviceDetails.prix) - parseFloat(promoPrice)).toFixed(3)
    : null;

   const getEmbedUrl = (url) => {
  const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
     }
     return url;
   };

  return (
    <>
      <Loading isVisible={loading} />
      <Breadcrumbs title={serviceDetails.title} />
      <section className="px-2 pt-20 pb-48 mt-10 p-10">
        <div className="container card-container mx-auto flex">
          <div className="w-3/4 pr-4">
            <div className="bg-white py-16 px-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row">
                <div
                  className="md:w-1/2 relative image-container"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={`https://backendbillcom-production.up.railway.app/uploads/${currentImage}`}
                    alt={serviceDetails.title}
                    className="rounded-lg w-full"
                  />
                  {isZoomVisible && (
                    <div
                      className="zoom-image"
                      style={{ ...zoomStyle }}
                    ></div>
                  )}
                  <div className="relative mt-20 flex items-center">
                    <span className="absolute left-0 ml-2 cursor-pointer text-blue-500 text-xl arrow" onClick={handlePrevImage}>
                      &#x276E;
                    </span>
                    <div className="flex mx-auto space-x-2">
                      {[
                        serviceDetails.image,
                        serviceDetails.img1,
                        serviceDetails.img2,
                        serviceDetails.img3,
                        serviceDetails.img4,
                      ].map(
                        (img, index) =>
                          img && (
                            <img
                              key={index}
                              src={`https://backendbillcom-production.up.railway.app/uploads/${img}`}
                              alt={`Additional view ${index + 1}`}
                              className={`w-20 h-20 rounded-lg cursor-pointer ${currentImage === img ? "border-2 border-blue-100" : ""}`}
                              onClick={() => handleImageClick(img)}
                            />
                          )
                      )}
                    </div>

                    <span className="absolute right-0 mr-2 cursor-pointer text-blue-500 text-xl arrow" onClick={handleNextImage}>
                      &#x276F;
                    </span>
                  </div>
                  <div className="relative mt-20 flex items-center">
                    <button
                      onClick={handleScrollToReviews}
                      className="button-24"
                      role="button"
                    >
                      <FiBook className="text-blue-500 mr-2" /> {/* Changed the icon */}
                      <span className="text">Read Customer Reviews</span> {/* Changed the text */}
                    </button>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-10 flex flex-col justify-between">
                  <div className="mb-4 title-description-block">
                    <h1 className="text-3xl font-bold mb-4">{serviceDetails.title}</h1>
                    <p className="text-gray-700 mb-4 text-sm">{serviceDetails.description}</p>
                  </div>
                  {averageRating && !isNaN(averageRating) && (
                    <div className="rating-statistics-container mt-6">
                      <h3 className="text-xl font-semibold text-gray-500 mb-4">Product Rating Summary</h3>
                      <div className="text-3xl font-bold text-gray-600">{Number(averageRating).toFixed(2)}</div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, index) => (
                          <span
                            key={index}
                            className={`stat-star ${index < Math.round(averageRating) ? 'filled' : ''}`}
                            style={{
                              background: index < averageRating && index + 1 > averageRating
                                ? 'linear-gradient(to right, #F9D6E4 50%, #E0E0E0 50%)'
                                : index < averageRating
                                  ? 'linear-gradient(to right, #F9D6E4, #3D92F1)'
                                  : '#E0E0E0',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="rating-distribution mt-4">
                        <div className="flex items-center mb-2">
                          <span className="text-sm text-gray-600">Quality Rating:</span>
                          <div className="w-full h-2 mx-2 bg-gray-200 rounded-full">
                            <div className="h-full rounded-full" style={{ width: `${ratingDistribution.quality}%`, backgroundColor: '#e4b4d0' }}></div>
                          </div>
                          <span className="text-sm text-gray-600">{ratingDistribution.quality}%</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <span className="text-sm text-gray-600">Price Rating:</span>
                          <div className="w-full h-2 mx-2 bg-gray-200 rounded-full">
                            <div className="h-full rounded-full" style={{ width: `${ratingDistribution.price}%`, backgroundColor: '#2980b9' }}></div>
                          </div>
                          <span className="text-sm text-gray-600">{ratingDistribution.price}%</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <span className="text-sm text-gray-600">Value Rating:</span>
                          <div className="w-full h-2 mx-2 bg-gray-200 rounded-full">
                            <div className="h-full rounded-full" style={{ width: `${ratingDistribution.value}%`, backgroundColor: '#5499c7' }}></div>
                          </div>
                          <span className="text-sm text-gray-600">{ratingDistribution.value}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <style jsx>{`
  .rating-statistics-container {
    background-color: #f9f9f9; /* Light gray background */
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: add a subtle shadow */
  }

  .stat-star {
    font-size: 24px;
    transition: color 0.2s ease-in-out;
  }

  .filled {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    background: linear-gradient(to right, #F9D6E4, #3D92F1);
  }

  .rating-distribution {
    width: 100%;
  }
`}</style>




                </div>
              </div>
            </div>
          </div>
          <div className="w-1/4 pl-4">
            <div className="bg-gray-custom p-8 rounded-lg shadow-md text-center card-details">
              <img src={`https://backendbillcom-production.up.railway.app/uploads/${serviceDetails.logoUrl}`} alt="Brand Logo" className="mb-4 w-10 h-auto mx-auto" />
              <div className={`font-normal ${serviceDetails.promo ? "text-red-600" : "text-gray-700 dark:text-gray-400"}`}>
                {serviceDetails.promo ? (
                  <>
                    <span className="line-through block">{parseFloat(serviceDetails.prix).toFixed(3)} DT</span>
                    <span className="font-bold text-red-600">{promoPrice} DT</span>
                    {amountSaved && (
                      <div className="bg-[#e4b4d0] text-white font-bold py-1 px-2 rounded" style={{ opacity: 0.7 }}>
                        Save {amountSaved} DT
                      </div>

                    )}
                    <br></br>
                  </>
                ) : (
                  <h2 className="text-2xl font-bold mb-4">{`${serviceDetails.prix} DT TTC`}</h2>
                )}
              </div>
              <p className="text-green-500 mb-4">Availability: {serviceDetails.dispo}</p>
              <div className="my-4">
                <label htmlFor="quantity" className="mr-2">
                  Quantity:
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleChangeQuantity}
                  className="border rounded p-2 text-center"
                  min="1"
                  max="10"
                  style={{ width: "70px" }}
                />
              </div>
              <button
                onClick={handleAddToCart}
                className="button-24"
                role="button"
              >
                <FiShoppingCart className="text-blue-500 mr-2" />
                <span className="text">Add to Cart</span>
              </button>
              <style jsx>{`
                .button-24 {
                  background-color: transparent;
                  background-image: linear-gradient(#fff, #f5f5fa);
                  border: 0 solid #003dff;
                  border-radius: 9999px;
                  box-shadow: rgba(37, 44, 97, .15) 0 4px 11px 0, rgba(93, 100, 148, .2) 0 1px 3px 0;
                  box-sizing: border-box;
                  color: #484c7a;
                  cursor: pointer;
                  display: inline-flex;
                  font-family: Hind, system-ui, BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
                  font-weight: 600;
                  margin: 4px;
                  padding: 16px 24px;
                  text-align: center;
                  text-decoration: inherit;
                  text-wrap: nowrap;
                  transition: all .2s ease-out;
                  transition-behavior: normal;
                  white-space-collapse: collapse;
                  line-height: 1.15;
                }

                @media (min-width: 576px) {
                  .button-24 {
                    padding-bottom: 10px;
                    padding-top: 10px;
                  }
                }

                .button-24:after, .button-24:before, .div-flex-items-center-justify-center:after, .div-flex-items-center-justify-center:before, .span-flex-items-center-h-16-w-auto-mr-8-py-2-flex-grow-0-flex-shrink-0-fill-current:after, .span-flex-items-center-h-16-w-auto-mr-8-py-2-flex-grow-0-flex-shrink-0-fill-current:before, .svg-block-h-full:after, .svg-block-h-full:before {
                  border: 0 solid #003dff;
                  box-sizing: border-box;
                }

                .button-24:hover {
                  box-shadow: rgba(37, 44, 97, .15) 0 8px 22px 0, rgba(93, 100, 148, .2) 0 4px 6px 0;
                }

                .button-24:disabled {
                  cursor: not-allowed;
                  opacity: .5;
                }
              `}</style>
            </div>
          </div>
        </div>


        <br></br>
        <br></br>
        <br></br>
        {/* More Information Section */}
        <div className="tab-content flex px-4 justify-center">
          <div className="container video-container bg-white py-16 px-6 mt-10 rounded-lg shadow-md" style={{ maxWidth: '800px', paddingLeft: '70px' }}>
            <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: "#3D92F1" }}>
              Dive into the heart of the action
            </h2>
            <p className="text-gray-700 mb-8">{serviceDetails.shortDesc}</p>
            <div className="relative overflow-hidden" style={{ paddingBottom: "56.25%" }}>
              <iframe
                  src={getEmbedUrl(serviceDetails.videoUrl)}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Product Video"
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
            </div>
          </div>
          <div className="product-images-container flex flex-wrap ml-8 mt-10">
            {[serviceDetails.img1, serviceDetails.img2, serviceDetails.img3, serviceDetails.img4].map(
              (img, index) =>
                img && (
                  <div key={index} className="w-1/2 p-2">
                    <img
                      src={`https://backendbillcom-production.up.railway.app/uploads/${img}`}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-auto rounded-lg shadow-lg transform hover:scale-105 transition-transform"
                      style={{ maxWidth: "350px" }}
                    />
                  </div>
                )
            )}
          </div>

        </div>


        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>


        {/* Client Reviews Section */}

        <div className="tab-content px-4">
          <div className="flex justify-center mb-4">
            <button
              className={`sub-tab-item py-2 px-4 ${selectedSubTab === 'listReviews' ? 'active-sub-tab text-gray-600' : 'text-gray-400'}`}
              onClick={() => handleSubTabSelect('listReviews')}
            >
              Reviews
            </button>
            <button
              className={`sub-tab-item py-2 px-4 ${selectedSubTab === 'writeReview' ? 'active-sub-tab text-gray-600' : 'text-gray-400'}`}
              onClick={() => handleSubTabSelect('writeReview')}
            >
              Write Review
            </button>
          </div>

          <style jsx>{`
              .sub-tab-item {
                position: relative;
                padding-bottom: 0.5rem; /* Add some padding to create space for the underline */
                transition: color 0.3s ease; /* Smooth transition for text color change */
              }

              .active-sub-tab::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: linear-gradient(to right, #F9D6E4, #3D92F1);
                border-radius: 2px;
              }
            `}</style>


          {selectedSubTab === 'writeReview' && (
            <div className="flex">
              <div className="w-1/3">
                <img src="/img/posthere.png" alt="Post Here" className="w-full h-auto mb-4" style={{ width: '500px', height: '500px' }} />
              </div>
              <div className="w-2/3 ml-4">
                <form className="review-form w-full max-w-lg" onSubmit={handleReviewSubmit}>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    <span className="text-blue-500">{serviceDetails.title}</span>
                  </label>
                  <br></br>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      value={review.name}
                      onChange={(e) => handleReviewChange('name', e.target.value)}
                      size="lg"
                      placeholder="Name"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900 p-2"
                    />
                    {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="mb-4 flex justify-between">
                      <div className="w-1/3">
                        <label htmlFor="priceRating" className="block text-gray-700 text-sm font-bold mb-2">
                          Price
                        </label>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, index) => (
                            <span
                              key={index}
                              className={`star cursor-pointer text-2xl ${index < review.priceRating ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-blue-500" : "text-gray-300"}`}
                              onClick={() => handleStarClick('priceRating', index + 1)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        {errors.priceRating && <p className="text-red-500 text-xs italic">{errors.priceRating}</p>}
                      </div>
                      <div className="w-1/3">
                        <label htmlFor="valueRating" className="block text-gray-700 text-sm font-bold mb-2">
                          Value
                        </label>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, index) => (
                            <span
                              key={index}
                              className={`star cursor-pointer text-2xl ${index < review.valueRating ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-blue-500" : "text-gray-300"}`}
                              onClick={() => handleStarClick('valueRating', index + 1)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        {errors.valueRating && <p className="text-red-500 text-xs italic">{errors.valueRating}</p>}
                      </div>
                      <div className="w-1/3">
                        <label htmlFor="qualityRating" className="block text-gray-700 text-sm font-bold mb-2">
                          Quality
                        </label>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, index) => (
                            <span
                              key={index}
                              className={`star cursor-pointer text-2xl ${index < review.qualityRating ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-blue-500" : "text-gray-300"}`}
                              onClick={() => handleStarClick('qualityRating', index + 1)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        {errors.qualityRating && <p className="text-red-500 text-xs italic">{errors.qualityRating}</p>}
                      </div>
                    </div>
                    <div className="mb-4 col-span-2">
                      <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">
                        Comment
                      </label>
                      <textarea
                        id="comment"
                        value={review.comment}
                        onChange={(e) => handleReviewChange('comment', e.target.value)}
                        className="border border-gray-500 focus:border-gray-500 p-2 w-full rounded"
                        rows="4"
                      />
                      {errors.comment && <p className="text-red-500 text-xs italic">{errors.comment}</p>}
                    </div>
                  </div>
                  <br></br>
                  <Button type="submit" className="button-24 flex justify-center items-center" fullWidth>
                    <FiFlag className="mr-2 text-blue-500" />
                    <span className="text">Submit Review</span>
                  </Button>

                  {errors.submit && <p className="text-red-500 mt-2">{errors.submit}</p>}
                </form>
                <p className="text-sm mt-4" style={{ color: "#3D92F1" }}>
                  Please ensure your review is genuine. Any false or spam reviews will not be posted and may result in further action.
                </p>
              </div>
              <div className="border-dashed border-2 border-gray-300 p-4 rounded relative flex items-center justify-center" style={{ width: '1200px', height: '500px' }}>
                <div className="text-center">
                  <FiUpload className="text-blue-500 text-6xl mx-auto" />
                  <p className="text-blue-200 text-sm">Drag & drop images here</p>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full h-full opacity-0 absolute cursor-pointer"
                  style={{ top: 0, left: 0, bottom: 0, right: 0 }}
                />
                <div className="mt-4 flex flex-wrap absolute bottom-4 left-4">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Upload preview ${index + 1}`}
                      className="w-20 h-20 rounded-lg object-cover mr-2 mb-2"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}


          {selectedSubTab === 'listReviews' && (
            <div id="reviews-section" className="reviews-list w-full" style={{ paddingLeft: '10px' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review, reviewIndex) => {
                  return (
                    <div key={reviewIndex} className="review-item mb-4 p-4 bg-white rounded-lg shadow-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <img
                            src={review.user && review.user.profilePicture
                              ? `http://localhost:8083/tp/uploads/${review.user.profilePicture}`
                              : "/img/user1.jpg"} // Fallback to a default image if no profile picture
                            alt="User Avatar"
                            className="h-8 w-8 mr-3 rounded-full"
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <Typography variant="h6" className="font-bold text-sm">
                                {review.user
                                  ? `${maskNom(review.user.nom)} ${review.user.prenom}`
                                  : 'Anonymous'}
                              </Typography>
                              <Typography variant="body1" className="ml-3 text-xs text-gray-500">
                                {formatDate(review.date)}
                              </Typography>
                            </div>
                            <div className="flex items-center mb-2">
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <span
                                    key={i}
                                    className={`star ${i < Math.ceil(review.qualityRating) ? 'filled' : ''}`}
                                    style={{
                                      background: i < review.qualityRating && i + 1 > review.qualityRating
                                        ? 'linear-gradient(to right, #F9D6E4 50%, #E0E0E0 50%)'
                                        : i < review.qualityRating
                                          ? 'linear-gradient(to right, #F9D6E4, #3D92F1)'
                                          : '#E0E0E0',
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent'
                                    }}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>

                            <style jsx>{`
                    .star {
                      font-size: 24px;
                      transition: color 0.2s ease-in-out;
                    }
                    .filled {
                      color: #FFD700; /* Gold color for filled stars */
                    }
                  `}</style>
                          </div>
                          <ReviewImages review={review} reviewIndex={reviewIndex} />
                        </div>
                        <Typography variant="body2" className="text-gray-700 mb-4">
                          {review.comment}
                        </Typography>
                      </div>

                      <div className="flex items-center space-x-2 mt-4">
                        <button
                          id={`like-button-${review.id}`}
                          onClick={() => handleLike(review.id)}
                          className={`like-dislike-button ${likeStatus[review.id] ? 'liked' : ''}`}
                        >
                          <FiThumbsUp className={`icon ${likeStatus[review.id] ? 'active' : ''}`} />
                          <span className="like-count" style={{ color: likeStatus[review.id] ? '#cb045a' : '#3D92F1' }}>{review.likes}</span>
                        </button>
                        <button
                          id={`dislike-button-${review.id}`}
                          onClick={() => handleDislike(review.id)}
                          className={`like-dislike-button ${dislikeStatus[review.id] ? 'disliked' : ''}`}
                        >
                          <FiThumbsDown className={`icon ${dislikeStatus[review.id] ? 'active' : ''}`} />
                          <span className="dislike-count" style={{ color: dislikeStatus[review.id] ? '#cb045a' : '#3D92F1' }}>{review.dislikes}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}



          <style>{`

@keyframes likeBounce {
  0% {
    transform: scale(1);
    color: #3D92F1;
  }
  50% {
    transform: scale(1.3);
    color: #cb045a;
  }
  100% {
    transform: scale(1);
    color: #cb045a;
  }
}

@keyframes dislikeBounce {
  0% {
    transform: scale(1);
    color: #3D92F1;
  }
  50% {
    transform: scale(1.3);
    color: #cb045a;
  }
  100% {
    transform: scale(1);
    color: #cb045a;
  }
}

.liked .icon, .liked .like-count {
  animation: likeBounce 0.5s ease;
}

.disliked .icon, .disliked .dislike-count {
  animation: dislikeBounce 0.5s ease;
}

  .review-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .like-dislike-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 4px 8px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    transition: all 0.3s ease;
    color: #3D92F1;
    margin-top: auto; /* Pushes the buttons to the bottom */
    position: relative;
    overflow: hidden;
  }

  .icon {
    font-size: 18px;
    transition: transform 0.3s ease, color 0.3s ease;
    margin-right: 4px;
    color: #3D92F1;
  }

  .like-dislike-button:hover .icon {
    transform: scale(1.1);
  }

  .like-dislike-button:active .icon {
    transform: scale(0.95);
  }

  .liked .icon, .disliked .icon {
    color: #cb045a; 
  }

  .active {
    color: #cb045a;
  }

  /* Animation Effect */
  .like-dislike-button.clicked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150%;
    height: 150%;
    background: radial-gradient(circle, rgba(255,255,255,0.7) 20%, transparent 70%);
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: transform 0.5s, opacity 0.5s;
  }

  .like-dislike-button.clicked .icon {
    animation: pop 0.3s;
  }

  @keyframes pop {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }

  .like-dislike-button.clicked::after {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
`}</style>






        </div>

      </section>
      <ReviewImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={`http://localhost:8083/tp/uploads/${getReviewImageUrl()}`}
        onNext={() => setSelectedImageIndex((selectedImageIndex + 1) % 2)}
        onPrev={() => setSelectedImageIndex((selectedImageIndex - 1 + 2) % 2)}
        reviews={reviews}
        selectedReviewIndex={selectedReviewIndex}
      />
      <Footer />
    </>
  );
};

const ReviewImageModal = ({ isOpen, onClose, imageUrl, onNext, onPrev, reviews, selectedReviewIndex }) => {
  if (!isOpen || !imageUrl) return null;

  const review = reviews[selectedReviewIndex];
  const imagesCount = review.imgreview2 ? 2 : 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {imagesCount > 1 && (
          <>
            <button className="modal-arrow left" onClick={onPrev}>
              &#x276E;
            </button>
            <button className="modal-arrow right" onClick={onNext}>
              &#x276F;
            </button>
          </>
        )}
        <img src={imageUrl} alt="Review" className="modal-image" />
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 10px;
          width: 600px;
          height: 400px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: white;
        }
        .modal-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: blue;
        }
        .modal-arrow.left {
          left: 10px;
        }
        .modal-arrow.right {
          right: 10px;
        }
        .modal-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default ServiceDetails;
