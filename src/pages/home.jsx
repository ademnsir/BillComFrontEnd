import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { Footer } from "@/index";
import { ReactTyped } from "react-typed";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import PromoBanner from "@/widgets/layout/PromoBanner"; // Adjust the path if needed
import { useTranslation } from 'react-i18next';

export function Home({ isLoggedIn }) {
  const navigate = useNavigate();
  const [animateButtonIndex, setAnimateButtonIndex] = useState(null);
  const [promoProducts, setPromoProducts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('featured'); // State for selected tab
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateButtonIndex(prevIndex => (prevIndex === null || prevIndex === 2) ? 0 : prevIndex + 1);
    }, 3000); // Change interval to 3000ms (3 seconds)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch products and filter for promo products based on selected tab
    const fetchPromoProducts = async () => {
      try {
        const response = await axios.get("https://backendbillcom-production.up.railway.app/tp/api/products");
        const products = response.data;
        let filteredProducts = [];
        if (selectedTab === 'featured') {
          // Filter products where promo is greater than 0 (indicating a promo product)
          filteredProducts = products.filter(product => product.promo > 0);
        } else if (selectedTab === 'new') {
          filteredProducts = products.filter(product => product.new);
        } else if (selectedTab === 'bestselling') {
          filteredProducts = products.filter(product => product.bestselling);
        }
        setPromoProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchPromoProducts();
  }, [selectedTab]);

  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };

  const primaryColor = isLoggedIn ? '#B60B59' : '#B60B59';

  return (
    <>
      <div className="relative flex h-screen content-center items-center justify-center pb-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <video
            src="img/log1.mp4"
            autoPlay
            loop
            muted
            className="w-full h-3/4 object-cover"
          />
        </div>
        <div className="max-w-8xl container relative mx-auto mt-60">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography variant="h1" color="white" className="pl-32 font-black relative">
                <div className="absolute text-xl sm:pl-10 sm:text-xl md:text-3xl lg:text-3xl xl:text-5xl">
                  {t('YOUR_STORY_STARTS')} {' '}
                  <ReactTyped
                    strings={[t('RIGHT_NOW'), t('WITH_US')]}
                    typeSpeed={80}
                    backSpeed={80}
                    loop
                    className="typed-text default-color"
                  />
                </div>
              </Typography>

              <style>{`
                .typed-text.default-color {
                  color: #3D92F1;
                }
                @keyframes slide-left {
                  0% {
                    transform: translateX(100%);
                  }
                  100% {
                    transform: translateX(-100%);
                  }
                }
                .sliding-text {
                  display: inline-block;
                  white-space: nowrap;
                  animation: slide-left 14s linear infinite;
                }
              `}</style>

              <Typography variant="lead" color="white" className="opacity-80 pt-12 mt-20">
                <div className="sliding-text ">
                  {t('DISCOVER_FUTURE')}
                </div>
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <section className="relative bg-white pt-0 pb-24 px-4 text-center -mt-40 z-20">
        {/* Tabs Component */}
        <div className="tabs-container flex justify-center space-x-4 border-b-2 border-gray-200 mb-4">
          <button
            className={`tab-item py-2 px-4 ${selectedTab === 'featured' ? 'active-tab' : ''}`}
            onClick={() => handleTabSelect('featured')}
          >
            {t('PROMO_PRODUCTS')}
          </button>
          <button
            className={`tab-item py-2 px-4 ${selectedTab === 'new' ? 'active-tab' : ''}`}
            onClick={() => handleTabSelect('new')}
          >
            {t('NEW_PRODUCTS')}
          </button>
          <button
            className={`tab-item py-2 px-4 ${selectedTab === 'bestselling' ? 'active-tab' : ''}`}
            onClick={() => handleTabSelect('bestselling')}
          >
            {t('BEST_SELLERS')}
          </button>
        </div>
        <br></br>
        {/* PromoBanner Component */}
        {promoProducts.length > 0 ? (
          <PromoBanner products={promoProducts} onProductClick={(id) => navigate(`/productDetails/${id}`)} />
        ) : (
          <div>{t('NO_PROMO_PRODUCTS')}</div>
        )}
      </section>

      <div className="bg-white">
        <Footer />
      </div>

      <style>{`
        .tabs-container {
          display: flex;
          justify-content: center;
          border-bottom: 2px solid #ccc;
          margin-bottom: 1rem;
        }
        .tab-item {
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
        }
        .tab-item.active-tab {
          border-bottom: 4px solid; /* Add bottom border to the active tab */
          border-image: linear-gradient(to right, #F9D6E4, #3D92F1) 1;
          color: #3D92F1;
        }
        .home-button:hover .group-hover\\:text-white {
          color: white !important;
        }
        .home-button:hover {
          background-color: var(--primary-color) !important;
        }
        @keyframes slide {
          0% { transform: translateX(0); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
        .home-button.animate {
          animation: slide 0.5s ease-in-out;
        }
        @keyframes fillColor {
          from { background-color: transparent; }
          to { background-color: var(--primary-color); }
        }
        .home-button.animate {
          animation: fillColor 2s forwards;
        }
        .text-filled {
          color: white !important;
        }
        .overflow-hidden {
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

export default Home;
