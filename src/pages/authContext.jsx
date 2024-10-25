import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const storedAuthData = localStorage.getItem('authData');
    console.log(localStorage.getItem('user'));

    return storedAuthData ? JSON.parse(storedAuthData) : { user: null };
  });

  const setAuthUserData = (user) => {
    localStorage.setItem('authData', JSON.stringify({ user }));
    setAuthData({ user });
  };

  useEffect(() => {
    const storedAuthData = localStorage.getItem('authData');
    if (storedAuthData) {
      setAuthData(JSON.parse(storedAuthData));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authData, setAuthUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
