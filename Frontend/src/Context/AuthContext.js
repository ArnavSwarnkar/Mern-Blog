// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export const AuthContext = React.createContext();

// const AuthContextProvider = (props) => {
//   const [activeUser, setActiveUser] = useState({});
  
//   const getAuthConfig = () => ({
//     headers: {
//       "Content-Type": "application/json",
//       authorization: `Bearer ${localStorage.getItem("authToken")}`,
//     },
//   });

//   useEffect(() => {
//     const controlAuth = async () => {
//       try {
//         const { data } = await axios.get(
//           `${process.env.REACT_APP_API_URL}/auth/private`,
//           getAuthConfig()
//         );
//         setActiveUser(data.user);
//       } catch (error) {
//         console.error("Auth check failed:", error.response?.data || error.message);
//         localStorage.removeItem("authToken");
//         setActiveUser({});
//       }
//     };

//     controlAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ activeUser, setActiveUser }}>
//       {props.children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContextProvider;

import React, { useState, useEffect, createContext } from "react";
import API from "../utils/api"; // Use the API instance we created

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [activeUser, setActiveUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);

  // Function to validate JWT token format
  const isValidJWT = (token) => {
    if (!token) return false;
    const parts = token.split('.');
    return parts.length === 3;
  };

  // Function to get auth config
  const getAuthConfig = () => {
    const token = localStorage.getItem("authToken");
    if (!token || !isValidJWT(token)) {
      return null;
    }
    
    return {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
  };

  // Function to clear auth data
  const clearAuthData = () => {
    localStorage.removeItem("authToken");
    setActiveUser({});
    setIsAuthenticated(false);
    setConfig(null);
  };

  // Function to set auth data
  const setAuthData = (user, token) => {
    localStorage.setItem("authToken", token);
    setActiveUser(user);
    setIsAuthenticated(true);
    setConfig(getAuthConfig());
  };

  // Check authentication status
  useEffect(() => {
    const controlAuth = async () => {
      setLoading(true);
      
      const token = localStorage.getItem("authToken");
      
      // Check if token exists and is valid format
      if (!token || !isValidJWT(token)) {
        console.log("No valid token found");
        clearAuthData();
        setLoading(false);
        return;
      }

      try {
        // Set the config for API requests
        const authConfig = getAuthConfig();
        if (!authConfig) {
          throw new Error("Invalid auth configuration");
        }

        const { data } = await API.get("/auth/private", authConfig);
        
        if (data && data.user) {
          setActiveUser(data.user);
          setIsAuthenticated(true);
          setConfig(authConfig);
          console.log("Auth check successful:", data.user);
        } else {
          throw new Error("Invalid response format");
        }
        
      } catch (error) {
        console.error("Auth check failed:", error.response?.data || error.message);
        
        // Handle specific error cases
        if (error.response) {
          const { status, data: errorData } = error.response;
          
          if (status === 401) {
            console.log("Token expired or invalid, clearing auth data");
          } else if (status === 403) {
            console.log("Access forbidden");
          } else {
            console.log(`Auth error: ${status} - ${errorData?.message || 'Unknown error'}`);
          }
        } else if (error.request) {
          console.log("Network error during auth check");
        } else {
          console.log("Error setting up auth request");
        }
        
        // Clear invalid auth data
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    controlAuth();
  }, []); // Only run once on mount

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });
      
      if (data.success && data.token) {
        setAuthData(data.user || {}, data.token);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || "Login failed" 
      };
    }
  };

  // Logout function
  const logout = () => {
    clearAuthData();
    // Optionally redirect to login page
    window.location.href = "/login";
  };

  // Check if user is authenticated
  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    return token && isValidJWT(token) && isAuthenticated;
  };

  const value = {
    activeUser,
    setActiveUser,
    isAuthenticated,
    loading,
    config,
    setConfig,
    login,
    logout,
    checkAuth,
    clearAuthData,
    setAuthData,
    getAuthConfig
  };

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
