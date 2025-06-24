// import { useState } from "react";
// import axios from "axios";
// import "../../Css/Login.css"
// import { Link, useNavigate } from "react-router-dom";
// const LoginScreen = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate()


//   const loginHandler = async (e) => {
//     e.preventDefault();

//     try {
//       const { data } = await axios.post(
//         "/auth/login",
//         { email, password }
//       );
//       localStorage.setItem("authToken", data.token);

//       setTimeout(() => {

//         navigate("/")

//       }, 1800)

//     } catch (error) {
//       setError(error.response.data.error);
//       setTimeout(() => {
//         setError("");
//       }, 4500);

//     }
//   };

//   return (

//     <div className="Inclusive-login-page">

//       <div className="login-big-wrapper">

//         <div className="section-wrapper">

//           <div className="top-suggest_register">

//             <span>Don't have an account? </span>
//             <a href="/register">Sign Up</a>

//           </div>

//           <div className="top-login-explain">
//             <h2>Login to Your Account </h2>

//             <p>
//               Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero unde sed doloremque!
//             </p>


//           </div>


//           <form onSubmit={loginHandler} >
//             {error && <div className="error_message">{error}</div>}
//             <div className="input-wrapper">
//               <input
//                 type="email"
//                 required
//                 id="email"
//                 placeholder="example@gmail.com"
//                 onChange={(e) => setEmail(e.target.value)}
//                 value={email}
//                 tabIndex={1}
//               />
//               <label htmlFor="email">E-mail</label>

//             </div>
//             <div className="input-wrapper">

//               <input
//                 type="password"
//                 required
//                 id="password"
//                 autoComplete="true"
//                 placeholder="6+ strong character"
//                 onChange={(e) => setPassword(e.target.value)}
//                 value={password}
//                 tabIndex={2}
//               />
//               <label htmlFor="password">
//                 Password

//               </label>
//             </div>
//             <Link to="/forgotpassword" className="login-screen__forgotpassword"> Forgot Password ?
//             </Link>
//             <button type="submit" >
//               Login
//             </button>

//           </form>


//         </div>

//         <div className="login-banner-section ">

//           <img src="login.png" alt="banner" width="400px" />
//         </div>

//       </div>


//     </div>


//   );
// };

// export default LoginScreen;


import { useState, useContext } from "react";
import API from "../../utils/api"; // Use the API instance
import { AuthContext } from "../../Context/AuthContext";
import "../../Css/Login.css";
import { Link, useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);

  const loginHandler = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setTimeout(() => setError(""), 4500);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await API.post("/auth/login", { 
        email: email.trim().toLowerCase(), 
        password 
      });

      if (data.success && data.token) {
        // Store token and user data using AuthContext
        setAuthData(data.user, data.token);
        
        // Navigate to home page
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
        
      } else {
        throw new Error(data.error || "Login failed");
      }

    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response) {
        const { status, data: errorData } = error.response;
        
        switch (status) {
          case 400:
            errorMessage = errorData.error || "Invalid email or password";
            break;
          case 401:
            errorMessage = "Invalid email or password";
            break;
          case 404:
            errorMessage = "Service unavailable. Please try again later.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = errorData.error || `Error: ${status}`;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 4500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Inclusive-login-page">
      <div className="login-big-wrapper">
        <div className="section-wrapper">
          <div className="top-suggest_register">
            <span>Don't have an account? </span>
            <Link to="/register">Sign Up</Link>
          </div>

          <div className="top-login-explain">
            <h2>Login to Your Account</h2>
            <p>
              Welcome back! Please enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={loginHandler}>
            {error && <div className="error_message">{error}</div>}
            
            <div className="input-wrapper">
              <input
                type="email"
                required
                id="email"
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                tabIndex={1}
                disabled={loading}
              />
              <label htmlFor="email">E-mail</label>
            </div>

            <div className="input-wrapper">
              <input
                type="password"
                required
                id="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                tabIndex={2}
                disabled={loading}
              />
              <label htmlFor="password">Password</label>
            </div>

            <Link to="/forgotpassword" className="login-screen__forgotpassword">
              Forgot Password?
            </Link>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <div className="login-banner-section">
          <img src="login.png" alt="banner" width="400px" />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
