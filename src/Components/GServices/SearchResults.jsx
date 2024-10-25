import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search).get('query');
        if (query) {
            axios.get(`http://localhost:8083/tp/api/products/search?query=${query}`)
                .then(response => {
                    setProducts(response.data);
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                });
        }
    }, [location.search]);

    return (
        <div>
            <h1>Search Results</h1>
            {products.length > 0 ? (
                <ul>
                    {products.map(product => (
                        <li key={product.id}>{product.title}</li>
                    ))}
                </ul>
            ) : (
                <p>No products found.</p>
            )}
        </div>
    );
};

export default SearchResults;
