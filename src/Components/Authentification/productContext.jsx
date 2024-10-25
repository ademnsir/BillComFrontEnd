// productContext.js
import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productType, setProductType] = useState('all');

  return (
    <ProductContext.Provider value={{ productType, setProductType }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  return useContext(ProductContext);
};
