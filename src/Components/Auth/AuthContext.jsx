// @ts-nocheck
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Validate user data
          if (!userData.token || !userData.id || !userData.role) {
            console.log('Invalid user data in localStorage, removing...');
            localStorage.removeItem('user');
            setUser(null);
            return;
          }
          // Verify token is still valid
          try {
            const response = await fetch('http://localhost:5000/api/auth/verify', {
              headers: {
                'Authorization': `Bearer ${userData.token}`
              }
            });
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.message || 'Token validation failed');
            }
            setUser(userData);
            console.log('Loaded and validated user from localStorage:', userData);
          } catch (error) {
            console.error('Token validation error:', error);
            // If token validation fails, clear user data and redirect to login
            localStorage.removeItem('user');
            setUser(null);
            // You might want to redirect to login here
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Function to log in a user via the backend API
  const login = async (email, password, role) => {
    try {
      console.log('Attempting login with:', { email, role });
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }
      // Support both possible backend response structures
      const token = data.token || (data.data && data.data.token);
      const userObj = data.user || (data.data && data.data.user);
      const userData = { ...userObj, token };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('Login successful:', userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to connect to the server. Please try again later.');
    }
  };

  // Function to log out a user
  const logout = () => {
    console.log('Logout function called');
    setUser(null);
    localStorage.removeItem('user');
  };

  // Create the context value object
  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
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
