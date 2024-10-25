import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ServiceCard from "@/widgets/cards/service-card";
import { Footer } from "@/widgets/layout/Footer";
import { AddServiceForm } from "@/widgets/layout/AddServiceForm";
import { useAuth } from "@/pages/authContext";
import { FiFilter, FiList, FiGrid } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@/widgets/assets/promoPub.css";
import Loading from "@/Components/GServices/Loading"; // Import Loading component

const BuyProject = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState("all");
  const [sortOption, setSortOption] = useState("Newest Products First");
  const [viewType, setViewType] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 25000]);
  const [selectedBrands, setSelectedBrands] = useState([]); // Updated state for multiple brands
  const [loading, setLoading] = useState(false); // State for loading effect
  const { authData } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [brands, setBrands] = useState([]);
  const [categoryType, setCategoryType] = useState(""); // New state for category type

  const categories = {
    gaming: [
      "All",
      "Mouse",
      "Headset",
      "Mousepad",
      "Keyboard",
      "Controllers",
      "Screens",
      "Gaming Chairs",
      "Consoles",
      "Gaming PCs",
      "VR",
    
    ],
    accessories: ["Cables", "Chargers", "Cases", "Headphones"],
    tablets: ["All", "Graphic Tablet", "Tablet Case", "Tablet Accessories"],
    laptops: ["All", "Graphic Laptop", "Laptop Case", "Laptop Accessories"],
    smartphones: ["All", "Smartphone Cases", "Chargers", "Screen Protectors", "Accessories"],
  };

  const sortOptions = [
    "Sort By",
    "Newest Products First",
    "Name, A to Z",
    "Name, Z to A",
    "Price Low to High",
    "Price High to Low",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const type = query.get("type");
    setCategoryType(type);
    setCurrentSubcategory("all");
  }, [location]);

  useEffect(() => {
    applyFilters();
  }, [products, currentSubcategory, priceRange, sortOption, selectedBrands, categoryType]);

  
  const handleBannerClick = (productId) => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/productDetails/${productId}`);
      setLoading(false);
    }, 500); // Simulate a brief loading delay
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8083/tp/api/products");
      const fetchedProducts = response.data;
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
      setBrands([...new Set(fetchedProducts.map(product => product.marque))]); // Extract brands
      sortAndFilterProducts(fetchedProducts, "Newest Products First");
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const filterProductsByQuery = (query) => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const filterProductsByCategory = (category) => {
    setCurrentSubcategory(category);
  };

  const filterProductsByBrand = (brand) => {
    setSelectedBrands(prevSelectedBrands => {
      if (prevSelectedBrands.includes(brand)) {
        return prevSelectedBrands.filter(b => b !== brand); // Deselect brand if it's already selected
      } else {
        return [...prevSelectedBrands, brand]; // Select brand
      }
    });
  };

  const applyFilters = () => {
    let filtered = products;

    if (categoryType && categoryType !== "all") {
      filtered = filtered.filter((product) =>
        product.type.toLowerCase() === categoryType.toLowerCase()
      );
    }

    if (currentSubcategory && currentSubcategory !== "all") {
      filtered = filtered.filter((product) =>
        product.subcategory && product.subcategory.toLowerCase() === currentSubcategory.toLowerCase()
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.prix >= priceRange[0] && product.prix <= priceRange[1]
    );

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) => selectedBrands.includes(product.marque));
    }

    sortAndFilterProducts(filtered, sortOption);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const [min, max] = priceRange;
    if (e.target.name === "min") {
      setPriceRange([value, max]);
    } else {
      setPriceRange([min, value]);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [priceRange]);

  const sortAndFilterProducts = (
    productsToSort = filteredProducts,
    option = sortOption
  ) => {
    let sortedProducts = [...productsToSort];

    switch (option) {
      case "Newest Products First":
        sortedProducts.sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );
        break;
      case "Name, A to Z":
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Name, Z to A":
        sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "Price Low to High":
        sortedProducts.sort((a, b) => a.prix - b.prix);
        break;
      case "Price High to Low":
        sortedProducts.sort((a, b) => b.prix - a.prix);
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredProducts.length / productsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const mostRecentProduct = products.reduce((latest, product) => {
    const latestDate = new Date(latest.dateAdded);
    const productDate = new Date(product.dateAdded);
    return productDate > latestDate ? product : latest;
  }, products[0]);

  const promoProducts = products.filter((product) => product.promo);

  const dynamicColor = '#3D92F1';

  const toggleViewType = (type) => {
    setViewType(type);
  };

  const handleCardClick = (productId) => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/productDetails/${productId}`);
      setLoading(false);
    }, 500); // Simulate a brief loading delay
  };

  return (
    <>
      <Loading isVisible={loading} /> {/* Add Loading component here */}
      <section className="no-scrollbar flex px-4 pt-20 pb-48 mt-10 p-10">
  <div className="w-1/6 p-4">
    <div className="bg-white shadow-md rounded p-4" style={{ marginTop: "30px" }}>
      <h2 className="text-l font-medium text-gray-600 mb-4">Filter</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="range"
          min="0"
          max="4000"
          value={priceRange[1]}
          name="max"
          onChange={handlePriceChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs">
          <span>{priceRange[0]}DT</span>
          <span>{priceRange[1]}DT</span>
        </div>
      </div>
      <div>
        <hr className="my-2 border-gray-300" />

        <h3 className="text-sm font-medium text-gray-700">Brand</h3>
        <div className="flex flex-col">
          {brands.map((brand, index) => {
            const formattedBrand = brand.toLowerCase().replace(/\s+/g, '_');
            const imagePath = `http://localhost:8083/tp/uploads/${formattedBrand}.png`;
            return (
              <div
                key={index}
                className={`flex items-center cursor-pointer m-2 pr-4 ${selectedBrands.includes(brand) ? 'bg-gray-50 selected-brand' : ''}`}
                onClick={() => filterProductsByBrand(brand)}
              >
                <img src={imagePath} alt={brand} className="h-8 w-8 mr-3 rounded-full" />
                <p className="text-xs font-small text-gray-600">{brand}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
  <div className="w-5/6 pr-6">
    <div className="container mx-auto">
      {promoProducts.length > 0}
      <div className="flex justify-center mt-8">
        {authData.user && (
          <div className="custom-button relative mb--1">
            <button
              onClick={openForm}
              className="bg-[#3D92F1] hover:bg-[#3D92F1] text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              style={{ backgroundColor: dynamicColor }}
            >
              Add Your Product
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-1 space-x-4"></div>
      <div className="category-bar bg-white shadow-md rounded p-4 my-4">
        <div className="flex flex-wrap justify-center items-center space-x-4">
          {(categoryType && categories[categoryType] ? categories[categoryType] : categories.gaming).map((category, index) => (
            <button
              key={index}
              onClick={() => filterProductsByCategory(category.toLowerCase())}
              className={`tab-item ${currentSubcategory === category.toLowerCase() ? "active-tab" : ""}`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <FiFilter
            className="text-[#3D92F1] text-2xl"
            style={{ color: dynamicColor }}
          />
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
          >
            {sortOptions
              .filter((option) => option !== "Sort By")
              .map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
          </select>
          <FiList
            className={`text-2xl cursor-pointer ${viewType === "list" ? "text-[#3D92F1]" : "text-gray-700"}`}
            onClick={() => toggleViewType("list")}
            style={{ color: viewType === "list" ? dynamicColor : "inherit" }}
          />
          <FiGrid
            className={`text-2xl cursor-pointer ${viewType === "grid" ? "text-[#3D92F1]" : "text-gray-700"}`}
            onClick={() => toggleViewType("grid")}
            style={{ color: viewType === "grid" ? dynamicColor : "inherit" }}
          />
        </div>
      </div>
      <div className={`mt-16 ${viewType === "grid" ? "grid grid-cols-1 gap-12 gap-x-24 md:grid-cols-2 xl:grid-cols-4" : "flex flex-col space-y-4"}`}>
        {currentProducts.length === 0 ? (
          <div className="mt-16 flex justify-center items-center text-center text-gray-500">
            There are no products available in this price range.
          </div>
        ) : (
          currentProducts.map((product) => (
            <div key={product.id} className={`${viewType === "list" ? "flex" : ""}`}>
              <div onClick={() => handleCardClick(product.id)} className={`${viewType === "list" ? "w-full flex cursor-pointer" : "cursor-pointer"}`}>
                <ServiceCardWrapper
                  product={product}
                  isMostRecent={product.id === mostRecentProduct.id}
                  dynamicColor={dynamicColor}
                  viewType={viewType}
                />
              </div>
            </div>
          ))
        )}
      </div>
      <Pagination
        pageNumbers={pageNumbers}
        currentPage={currentPage}
        paginate={paginate}
        dynamicColor={dynamicColor}
      />
    </div>
  </div>
</section>

      {isFormOpen && <AddServiceForm open={isFormOpen} onClose={closeForm} />}
      <Footer />
    </>
  );
};

const ServiceCardWrapper = ({ product, isMostRecent, dynamicColor, viewType }) => {
  return (
    <ServiceCard
      title={product.title}
      image={`http://localhost:8083/tp/uploads/${product.image}`}
      imagelogo={`http://localhost:8083/tp/uploads/${product.logoUrl}`}
      price={String(product.prix)}
      user={product.user}
      productId={String(product.id)}
      dispo={product.dispo}
      marque={product.marque}
      dateAdded={product.dateAdded}
      isMostRecent={isMostRecent}
      promo={product.promo}
      dynamicColor={dynamicColor}
      viewType={viewType}
    />
  );
};

const Pagination = ({ pageNumbers, currentPage, paginate, dynamicColor }) => {
  return (
    <nav className="mt-4 flex justify-center">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={
            currentPage === number
              ? "bg-[#3D92F1] text-white px-4 py-2 mx-1 rounded-full focus:outline-none"
              : "bg-white text-gray-700 px-4 py-2 mx-1 rounded-full hover:bg-gray-200 focus:outline-none"
          }
          style={{ backgroundColor: currentPage === number ? dynamicColor : "inherit" }}
        >
          {number}
        </button>
      ))}
    </nav>
  );
};

export default BuyProject;
