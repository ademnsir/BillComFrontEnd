import logofemale from '/img/logoprof2.png';
// src/Components/Navbar/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiOutlineChatAlt } from 'react-icons/hi';
import { FiShoppingBag ,FiShoppingCart } from 'react-icons/fi';
import { FaRegUser, FaSearch, FaArrowUp, FaEnvelope } from 'react-icons/fa';
import { Button, Modal } from "flowbite-react";
import { Input, Checkbox, Typography } from "@material-tailwind/react";
import { useCart } from "@/pages/CartContext";
import axios from 'axios';
import userimage from "/public/img/user1.jpg";
import Loading from "@/Components/GServices/Loading";
import { useTranslation } from 'react-i18next';
import "@/widgets/assets/Shop.css";
import { useLanguage } from "@/pages/LanguageContext";

function Navbar({ routes, setIsLoggedIn }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSignInDropdown, setShowSignInDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState(null);
  const [userConecte, setUserConecte] = useState(null);
  const [userlogin, setUserLogin] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { cartItems, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { t, i18n } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    console.log(`Language changed to: ${selectedLanguage}`);
    changeLanguage(selectedLanguage);
  };

  useEffect(() => {
    const userConecteStr = localStorage.getItem('authData');
    if (userConecteStr) {
      const parsedUser = JSON.parse(userConecteStr);
      setUserConecte(parsedUser);
      setUserImage(`http://localhost:8083/tp/uploads/${parsedUser.profilePicture}`);
      setIsLoggedIn(true);
    } else {
      setUserConecte(null);
      setUserImage(null);
      setIsLoggedIn(false);
    }

    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTopButton(true);
      } else {
        setShowScrollTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setIsLoggedIn]);

  useEffect(() => {
    let interval;
    if (cartItems.length === 0) {
      interval = setInterval(() => {
        const shoppingBagIcon = document.getElementById('shoppingBagIcon');
        if (shoppingBagIcon) {
          shoppingBagIcon.classList.add('animate-shake');
          setTimeout(() => {
            shoppingBagIcon.classList.remove('animate-shake');
          }, 500);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [cartItems]);

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const logout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem('authData');
    setUserConecte(null);
    setUserImage(null);
    setIsLoggedIn(false);
    clearCart();
    navigate('/');
  };

  const cartDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
        setShowCartDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCartDropdown]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLoading(true);
      setTimeout(() => {
        navigate(`/store?query=${encodeURIComponent(searchQuery)}`);
        setLoading(false);
      }, 500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        const response = await axios.post('https://backendbillcom-production.up.railway.app/auth/sign-in', 
        {
            email: userlogin.email,
            password: userlogin.password
        }, 
        {
            headers: {
                'Content-Type': 'application/json',  // Explicitly set the content type to JSON
            }
        });

        localStorage.setItem('authData', JSON.stringify(response.data));
        setUserConecte(response.data);
        setUserImage(`http://localhost:8083/tp/uploads/${response.data.profilePicture}`);
        setShowSignInDropdown(false);
        setIsLoggedIn(true);
        setLoading(false);
        navigate('/');
        window.location.reload();
    } catch (error) {
        setLoading(false);
        if (error.response) {
            console.error('Login failed:', error.response.data);
            setError(error.response.data.message);
        } else {
            console.error('Login failed:', error.message);
            setError('Failed to sign in. Please try again.');
        }
    }
};


  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const toggleSignInDropdown = () => {
    setShowSignInDropdown(!showSignInDropdown);
  };

  const toggleCartDropdown = () => {
    setShowCartDropdown(!showCartDropdown);
  };

  const handleNavigation = (url) => {
    if (url !== window.location.pathname) {
      setLoading(true);
      setTimeout(() => {
        navigate(url);
        setLoading(false);
      }, 500);
    }
  };

  const handleLogoClick = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/');
      setLoading(false);
    }, 500);
  };

  const navList = (
    <ul className="flex text-inherit justify-center flex-row gap-6 w-full">
      {routes && routes.map(({ name, path, icon, href, target }) => (
        (userConecte && (name === "sign in" || name === "sign up")) ? null : (
          <Typography
            key={name}
            as="li"
            variant="small"
            color="inherit"
            className="capitalize"
          >
            {href ? (
              <a
                href={href}
                target={target}
                className="flex items-center gap-1 p-1 font-bold"
              >
                {icon && React.createElement(icon, {
                  className: "w-[18px] h-[18px] opacity-75 mr-1",
                })}
                {name}
              </a>
            ) : (
              <NavLink
                to={path}
                target={target}
                onClick={() => handleNavigation(path)}
                className={({ isActive }) =>
                  isActive && name === "store"
                    ? "flex items-center gap-1 p-1 font-bold hover:border-b-2 hover:border-[#3D92F1] text-[#3D92F1] border-b-2 border-[#3D92F1]"
                    : "flex items-center gap-1 p-1 font-bold hover:border-b-2 hover:border-[#3D92F1] hover:text-[#3D92F1]"
                }
              >
                {icon && React.createElement(icon, {
                  className: "w-[18px] h-[18px] opacity-75 mr-1",
                })}
                {name}
              </NavLink>
            )}
          </Typography>
        )
      ))}
    </ul>
  );

  const navbarStyle = { background: 'linear-gradient(to right, #F9D6E4, #3D92F1)', color: '#3D92F1' };

  return (
    <div className="w-full fixed z-50 top-0 flex flex-col items-center shadow-md" style={navbarStyle}>
      <Loading isVisible={loading} /> {/* Add Loading component here */}
      <div className="flex items-center justify-between text-white w-full px-4" style={{ height: '70px' }}>
        <div className="flex items-center">
          <div className="flex items-center fixed left-0 pl-4" onClick={handleLogoClick}>
            <img
              src={logofemale} // Replace with a generic logo if needed
              alt="TechGadgets Logo"
              className="h-16 w-25 cursor-pointer"
            />
          </div>
          <form onSubmit={handleSearchSubmit} className="flex items-center ml-80">
            <select className="p-2 rounded-l-full border border-gray-300 bg-white text-gray-500 h-10">
              <option>All Categories</option>
              {/* Add more options as needed */}
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('SEARCH')}
              className="p-2 border-t border-b border-gray-300 w-96 h-10 focus:outline-none focus:border-gray-300 focus:ring-0 text-gray-500"
            />
            <button
              type="submit"
              className="p-2 rounded-r-full h-10 flex items-center justify-center w-20"
              style={{ backgroundColor: navbarStyle.color, color: '#ffffff' }}
            >
              <FaSearch className="h-4 w-4 text-white" />
            </button>
            <span className="ml-40 text-white flex items-center">
              <FaEnvelope className="h-4 w-4 mr-2 text-white" />
              www.TechGadgets.com
            </span>
            {/* <select
              onChange={handleLanguageChange}
              className="ml-2 p-2 rounded border border-gray-300 bg-white text-gray-500 h-10"
            >
              <option value="en">ENG</option>
              <option value="fr">FR</option>
            </select>  */}
          </form>
        </div>
        <div className="flex-grow lg:flex lg:items-center lg:justify-center ml-40">
          {navList}
        </div>
        <div className="hidden gap-2 lg:flex items-center pr-8">
          <div className="relative flex items-center">
            {userConecte ? (
              <div className="relative flex items-center" onClick={toggleProfileDropdown}>
                <img src={userImage} alt="User Image" className="user-image w-10 h-10 rounded-full cursor-pointer" />
                {showProfileDropdown && (
                  <div className="profile-dropdown absolute bg-blue-gray-50 border border-gray-200 rounded-lg shadow-md p-2 pb top-11 w-[190px]" style={{ left: '-140px' }}>
                    <ul className="text-black w-full">
                      <li className="flex items-center relative pt-2 pb-2">
                        <img src={userImage} alt="Logo" className="h-8 w-8 mr-3 rounded-full" />
                        <span>{userConecte.nom} {userConecte.prenom}</span>
                      </li>
                      <span className="absolute left-0 w-full h-[1px] bg-black my-1"></span>
                      <li className="flex items-center justify-center pt-3" onClick={() => handleNavigation(`/profile/${userConecte.idUser}`)}>
                        <Button className="profile-dropdown-item" style={{ color: '#3D92F1' }}>{t('PROFILE')}</Button>
                      </li>
                      <li className="flex items-center justify-center">
                        <Button className="profile-dropdown-item" style={{ color: '#3D92F1' }}>{t('SETTINGS')}</Button>
                      </li>
                      <li className="flex items-center justify-center" onClick={logout}>
                        <Button className="profile-dropdown-item" style={{ color: '#3D92F1' }}>{t('LOGOUT')}</Button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center cursor-pointer" onClick={toggleSignInDropdown}>
                  <FaRegUser className="w-5 h-5" style={{ color: 'white' }} />
                  <span className="ml-2 text-white">{t('SIGN_IN')}</span>
                </div>
                {showSignInDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-md p-4 top-12">
                    <div className="flex items-center mb-4">
                      <Typography variant="h5" className="font-bold" style={{ color: navbarStyle.color }}>
                        {t('SIGN_IN')}
                      </Typography>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-1 flex flex-col gap-4">
                        <Input
                          value={userlogin.email}
                          onChange={(e) => setUserLogin({ ...userlogin, email: e.target.value })}
                          size="lg"
                          placeholder="name@mail.com"
                          className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                          labelProps={{
                            className: "before:content-none after:content-none",
                          }}
                        />
                        <Input
                          value={userlogin.password}
                          onChange={(e) => setUserLogin({ ...userlogin, password: e.target.value })}
                          type="password"
                          size="lg"
                          placeholder="********"
                          className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                          labelProps={{
                            className: "before:content-none after:content-none",
                          }}
                        />
                      </div>
                      <Checkbox
                        label={
                          <Typography
                            variant="small"
                            color="gray"
                            className="flex items-center justify-start font-medium"
                          >
                            I agree to the&nbsp;
                            <a
                              href="#"
                              className="font-normal text-black transition-colors hover:text-gray-900 underline"
                              style={{ color: navbarStyle.color }}
                            >
                              Terms and Conditions
                            </a>
                          </Typography>
                        }
                        containerProps={{ className: "-ml-2.5" }}
                      />
                      <Button className="mt-6" fullWidth style={{ backgroundColor: navbarStyle.color, color: '#ffffff' }} type="submit">
                        {t('SIGN_IN')}
                      </Button>
                      {error && <p className="text-red-500 mt-2">{error}</p>}
                      <div className="flex items-center justify-center mt-6">
                        <Typography variant="small" className="font-medium text-gray-900">
                          <a href="#">
                            {t('FORGOT_PASSWORD')}
                          </a>
                        </Typography>
                      </div>
                      <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
                        {t('NOT_REGISTERED')} 
                        <Link to="/sign-up" className="ml-1" style={{ color: navbarStyle.color }} onClick={() => setShowSignInDropdown(false)}>{t('CREATE_ACCOUNT')}</Link>
                      </Typography>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="relative flex items-center">
            <div id="shoppingBagIcon" className={`relative ${cartItems.length > 0 ? 'fixed-icon' : 'animate-shake'}`}>
              <FiShoppingCart className="w-6 h-6 cursor-pointer ml-4" style={{ color: 'white' }} onClick={toggleCartDropdown} />
              <div className="absolute -top-1 -right-1 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full" style={{ backgroundColor: navbarStyle.color }}>
                {cartItems.length} {/* Count of unique products */}
              </div>
            </div>
            <div className="ml-2 text-white text-xs px-2 py-1 flex items-center justify-center rounded">
              {getTotalPrice().toFixed(3)} DT
            </div>
            {showCartDropdown && (
              <div ref={cartDropdownRef} className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-md p-4 top-12">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <Typography variant="h5" className="font-bold" style={{ color: navbarStyle.color }}>
                      {t('CART')}
                    </Typography>
                    <button onClick={() => { clearCart(); setShowCartDropdown(false); }} className="text-gray-500 hover:text-gray-700 text-sm">{t('CLEAR_ALL')}</button>
                  </div>
                  {cartItems.length === 0 ? (
                    <Typography className="mt-4 text-gray-500">{t('YOUR_CART_IS_EMPTY')}</Typography>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      {cartItems.slice(0, 5).map((item, index) => (
                        <div key={item.id}>
                          <div className="flex items-center justify-between mt-4">
                            <img src={`https://backendbillcom-production.up.railway.app/uploads/${item.image}`} alt={item.title} className="w-16 h-16 rounded" />
                            <div className="flex flex-col ml-4">
                              <Typography variant="small" className="text-gray-500">
                                <span className="font-bold" style={{ color: navbarStyle.color }}>{item.quantity} x {item.price} DT</span> {item.title}
                              </Typography>
                            </div>
                          </div>
                          {index < cartItems.length - 1 && <hr className="my-2 border-gray-300" />} {/* Add gray line separator */}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-center mt-2">
                    <button
                      onClick={() => {
                        const scrollPosition = window.scrollY;
                        navigate('/cart', { state: { from: window.location.pathname + window.location.search, scrollPosition } });
                        setShowCartDropdown(false); // Close the dropdown
                      }}
                      className="text-sm"
                      style={{ color: navbarStyle.color }}
                    >
                      {t('VIEW_CART')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Petite barre de navigation */}
      <div className="w-full bg-white flex justify-center items-center h-12">
        <div className="flex space-x-8">
          {['ALL', 'SMARTPHONES', 'LAPTOPS', 'TABLETS', 'WEARABLES', 'ACCESSORIES', 'CAMERAS', 'GAMING', 'AUDIO', 'OTHER'].map((item, index) => (
            <Link key={index} to={`/store?type=${item.toLowerCase()}`} className="hover:underline" style={{ color: navbarStyle.color }} onClick={() => handleNavigation(`/store?type=${item.toLowerCase()}`)}>
              {t(item)}
            </Link>
          ))}
        </div>
      </div>

      {showScrollTopButton && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full shadow-md z-50"
          style={{ backgroundColor: navbarStyle.color, color: '#ffffff' }}
        >
          <FaArrowUp className="h-6 w-6" />
        </button>
      )}

      <Modal show={showLogoutModal} onClose={() => setShowLogoutModal(false)} size="md" className="flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <img src={logofemale} alt="Logo" className="w-25 h-14 mr-2" />
          </div>
          <div className="text-center mb-4">
            <Typography variant="h6" color="blue-gray">
              {userConecte ? (
                <>
                  <span style={{ color: navbarStyle.color }}>{userConecte.prenom}</span>, {t('ARE_YOU_SURE_LOGOUT')}
                </>
              ) : (
                t('ARE_YOU_SURE_LOGOUT')
              )}
            </Typography>
          </div>
          <div className="flex justify-center space-x-4">
            <Button color="gray" onClick={logout}>
              {t('LOGOUT')}
            </Button>
            <Button color="gray" onClick={() => setShowLogoutModal(false)}>
              {t('CANCEL')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Navbar;
