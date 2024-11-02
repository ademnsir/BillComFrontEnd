import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userImage, setUserImage] = useState('/img/unknown.jpg'); // Set a default value

  return (
    <UserContext.Provider value={{ userImage, setUserImage }}>
      {children}
    </UserContext.Provider>
  );
};
