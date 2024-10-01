import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for user data
const UserContext = createContext();

// Create the UserProvider to wrap around the app
export const UserProvider = ({ children }) => {
  // Initialize user state from localStorage, if available
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Effect to sync the user state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Store user in localStorage
    } else {
      localStorage.removeItem('user'); // Remove user from localStorage
    }
  }, [user]);

  // Login function to update user state and save to localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Save user data
  };

  // Logout function to clear user data from state and localStorage
  const logout = () => {
    setUser(null); 
    localStorage.removeItem('user');
    localStorage.removeItem('token');  // Remove user data from localStorage
  };

  // Function to update user data
  const updateUser = (updatedData) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, user: { ...prevUser.user, ...updatedData } };
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Update localStorage
      return updatedUser;
    });
  };

  // Provide user, setUser, login, and logout methods throughout the app
  return (
    <UserContext.Provider value={{ user, setUser, login, logout,updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
