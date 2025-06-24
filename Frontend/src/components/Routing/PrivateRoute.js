// import { useEffect,useState,useContext } from 'react';
// import {Outlet, useNavigate} from 'react-router-dom'
// import Home from '../GeneralScreens/Home';
// import axios from 'axios';
// import { AuthContext } from "../../Context/AuthContext";

// const PrivateRoute =( ) => {
//     const bool =localStorage.getItem("authToken") ? true :false
//     const [auth ,setAuth] =useState(bool)
//     const [error ,setError] =useState("")
//     const navigate = useNavigate()
//     const {setActiveUser,setConfig } = useContext(AuthContext)

//     useEffect(() => {

//        const controlAuth = async () => {
//         const config = {
//             headers: {
//             "Content-Type": "application/json",
//             authorization: `Bearer ${localStorage.getItem("authToken")}`,
//             },
//         };
//         try {
//             const { data } = await axios.get("/auth/private", config); 

//             setAuth(true)
//             setActiveUser(data.user)
//             setConfig(config)

//         } 
//         catch (error) {

//             localStorage.removeItem("authToken");

//             setAuth(false)
//             setActiveUser({})

//             navigate("/")

//             setError("You are not authorized please login"); 
//         }
//         };

//         controlAuth()
//     }, [bool,navigate])


//     return (auth ? <Outlet />  : <Home error={error} />)
// }

// export default PrivateRoute;

import { useEffect, useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Home from '../GeneralScreens/Home';
import API from '../../utils/api';
import { AuthContext } from "../../Context/AuthContext";

const PrivateRoute = () => {
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setActiveUser, setConfig } = useContext(AuthContext);

    useEffect(() => {
        const controlAuth = async () => {
            const token = localStorage.getItem("authToken");
            
            if (!token) {
                setAuth(false);
                setLoading(false);
                return;
            }

            try {
                const { data } = await API.get("/auth/private");
                
                setAuth(true);
                setActiveUser(data.user);
                setConfig({
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                });
                setError("");
            } catch (error) {
                console.error("Auth error:", error.response?.data || error.message);
                
                localStorage.removeItem("authToken");
                setAuth(false);
                setActiveUser({});
                
                if (error.response?.status === 401) {
                    setError("Your session has expired. Please login again.");
                } else {
                    setError("Authentication failed. Please login.");
                }
            } finally {
                setLoading(false);
            }
        };

        controlAuth();
    }, [navigate, setActiveUser, setConfig]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return auth ? <Outlet /> : <Home error={error} />;
};

export default PrivateRoute;
