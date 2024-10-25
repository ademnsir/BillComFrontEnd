import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import "@/widgets/assets/Breadcrumbs.css";
import Loading from "@/Components/GServices/Loading"; // Ensure the correct path to your Loading component

const Breadcrumbs = ({ title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const paths = location.pathname.split("/").filter(Boolean);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const isDetailsPage = location.pathname.startsWith('/productDetails');

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setVisible(scrollTop === 0);
  };

  const handleClick = (url) => {
    setLoading(true);
    navigate(url);
    setLoading(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Loading isVisible={loading} /> {/* Add Loading component here */}
      <nav className={`breadcrumbs ${visible ? "visible" : "hidden"}`}>
        <ul>
          <li>
            <Link to="/" onClick={(e) => {
              e.preventDefault();
              handleClick("/");
            }}>
              <FiHome className="home-icon" /> Home
            </Link>
          </li>
          {isDetailsPage && (
            <>
              <li>
                <Link to="/store?type=all" onClick={(e) => {
                  e.preventDefault();
                  handleClick("/store?type=all");
                }}>
                  Store
                </Link>
              </li>
              <li>
                <span>{title}</span>
              </li>
            </>
          )}
          {!isDetailsPage && paths.map((path, index) => {
            const isLast = index === paths.length - 1;
            const url = `/${paths.slice(0, index + 1).join("/")}`;
            return (
              <li key={index}>
                {isLast ? (
                  <span>{decodeURIComponent(path)}</span>
                ) : (
                  <Link to={url} onClick={(e) => {
                    e.preventDefault();
                    handleClick(url);
                  }}>
                    {decodeURIComponent(path)}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Breadcrumbs;
