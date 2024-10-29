import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const storedAuthData = localStorage.getItem('authData');
    return storedAuthData ? JSON.parse(storedAuthData) : { user: null };
  });

  const setAuthUserData = (user) => {
    if (user) {
      // Stockez toutes les informations de l'utilisateur dans le local storage
      localStorage.setItem('authData', JSON.stringify({ user }));
      setAuthData({ user });
    } else {
      console.error('User data is invalid.');
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedAuthData = localStorage.getItem('authData');
      if (storedAuthData) {
        setAuthData(JSON.parse(storedAuthData));
      }
    };

    // Sync state with localStorage changes
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
