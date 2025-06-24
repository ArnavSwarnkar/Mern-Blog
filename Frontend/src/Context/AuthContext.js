import React, { useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = React.createContext();

const AuthContextProvider = (props) => {
  const [activeUser, setActiveUser] = useState({});
  
  const getAuthConfig = () => ({
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  useEffect(() => {
    const controlAuth = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/private`,
          getAuthConfig()
        );
        setActiveUser(data.user);
      } catch (error) {
        console.error("Auth check failed:", error.response?.data || error.message);
        localStorage.removeItem("authToken");
        setActiveUser({});
      }
    };

    controlAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ activeUser, setActiveUser }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
