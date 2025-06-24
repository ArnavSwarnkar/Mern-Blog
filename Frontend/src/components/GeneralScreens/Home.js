// import axios from "axios";
// import { v4 as uuidv4 } from 'uuid';
// import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import SkeletonStory from "../Skeletons/SkeletonStory";
// import CardStory from "../StoryScreens/CardStory";
// import NoStories from "../StoryScreens/NoStories";
// import Pagination from "./Pagination";
// import "../../Css/Home.css"

// import { useNavigate } from "react-router-dom"
// const Home = () => {
//   const search = useLocation().search
//   const searchKey = new URLSearchParams(search).get('search')
//   const [stories, setStories] = useState([])
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);


//   useEffect(() => {
//     const getStories = async () => {

//       setLoading(true)
//       try {

//         const { data } = await axios.get(`/story/getAllStories?search=${searchKey || ""}&page=${page}`)

//         if (searchKey) {
//           navigate({
//             pathname: '/',
//             search: `?search=${searchKey}${page > 1 ? `&page=${page}` : ""}`,
//           });
//         }
//         else {
//           navigate({
//             pathname: '/',
//             search: `${page > 1 ? `page=${page}` : ""}`,
//           });


//         }
//         setStories(data.data)
//         setPages(data.pages)

//         setLoading(false)
//       }
//       catch (error) {
//         setLoading(true)
//       }
//     }
//     getStories()
//   }, [setLoading, search, page, navigate])


//   useEffect(() => {
//     setPage(1)
//   }, [searchKey])


//   return (
//     <div className="Inclusive-home-page">
//       {loading ?

//         <div className="skeleton_emp">
//           {
//             [...Array(6)].map(() => {
//               return (
//                 // theme dark :> default : light
//                 <SkeletonStory key={uuidv4()} />
//               )
//             })}
//         </div>

//         :
//         <div>
//           <div className="story-card-wrapper">
//             {stories.length !== 0 ?
//               stories.map((story) => {
//                 return (
//                   <CardStory key={uuidv4()} story={story} />
//                 )
//               }) : <NoStories />
//             }
//             <img className="bg-planet-svg" src="planet.svg" alt="planet" />
//             <img className="bg-planet2-svg" src="planet2.svg" alt="planet" />
//             <img className="bg-planet3-svg" src="planet3.svg" alt="planet" />

//           </div>

//           <Pagination page={page} pages={pages} changePage={setPage} />

//         </div>

//       }
//       <br />
//     </div>

//   )

// };

// export default Home;

import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../utils/api"; // Use the API instance we created
import { AuthContext } from "../../Context/AuthContext";
import SkeletonStory from "../Skeletons/SkeletonStory";
import CardStory from "../StoryScreens/CardStory";
import NoStories from "../StoryScreens/NoStories";
import Pagination from "./Pagination";
import "../../Css/Home.css";

const Home = ({ error: authError }) => {
  const search = useLocation().search;
  const searchKey = new URLSearchParams(search).get('search');
  const [stories, setStories] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { activeUser } = useContext(AuthContext);

  useEffect(() => {
    const getStories = async () => {
      setLoading(true);
      setError(""); // Clear previous errors
      
      try {
        const { data } = await API.get(`/story/getAllStories?search=${searchKey || ""}&page=${page}`);

        // Ensure data structure is correct
        if (data && data.data) {
          // Ensure stories is always an array
          const storiesArray = Array.isArray(data.data) ? data.data : [];
          setStories(storiesArray);
          setPages(data.pages || 1);
        } else {
          // Fallback if data structure is unexpected
          setStories([]);
          setPages(1);
          console.warn("Unexpected data structure:", data);
        }

        // Update URL with search params
        if (searchKey) {
          navigate({
            pathname: '/',
            search: `?search=${searchKey}${page > 1 ? `&page=${page}` : ""}`,
          }, { replace: true });
        } else {
          navigate({
            pathname: '/',
            search: `${page > 1 ? `page=${page}` : ""}`,
          }, { replace: true });
        }

      } catch (error) {
        console.error("Error fetching stories:", error);
        
        // Set stories to empty array to prevent length errors
        setStories([]);
        setPages(1);
        
        // Handle different error types
        if (error.response) {
          const status = error.response.status;
          if (status === 401) {
            setError("Authentication required. Please login to view stories.");
          } else if (status === 404) {
            setError("Stories not found.");
          } else if (status === 500) {
            setError("Server error. Please try again later.");
          } else {
            setError(`Error: ${error.response.data?.message || "Failed to load stories"}`);
          }
        } else if (error.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    getStories();
  }, [searchKey, page, navigate]); // Removed setLoading from dependencies

  useEffect(() => {
    setPage(1);
  }, [searchKey]);

  // Show authentication error if passed from PrivateRoute
  if (authError) {
    return (
      <div className="Inclusive-home-page">
        <div className="error-container">
          <div className="error-message">{authError}</div>
          <button 
            className="login-button" 
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="Inclusive-home-page">
      {loading ? (
        <div className="skeleton_emp">
          {[...Array(6)].map(() => (
            <SkeletonStory key={uuidv4()} />
          ))}
        </div>
      ) : (
        <div>
          {/* Show error message if there's an error */}
          {error && (
            <div className="error-container">
              <div className="error-message">{error}</div>
              <button 
                className="retry-button" 
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          <div className="story-card-wrapper">
            {/* Ensure stories is an array and has length before mapping */}
            {Array.isArray(stories) && stories.length > 0 ? (
              stories.map((story) => (
                <CardStory key={story._id || story.id || uuidv4()} story={story} />
              ))
            ) : (
              !error && <NoStories />
            )}
            
            <img className="bg-planet-svg" src="planet.svg" alt="planet" />
            <img className="bg-planet2-svg" src="planet2.svg" alt="planet" />
            <img className="bg-planet3-svg" src="planet3.svg" alt="planet" />
          </div>

          {/* Only show pagination if there are stories and no errors */}
          {Array.isArray(stories) && stories.length > 0 && !error && (
            <Pagination page={page} pages={pages} changePage={setPage} />
          )}
        </div>
      )}
      <br />
    </div>
  );
};

export default Home;
