// import axios from 'axios';
//DetailStory.js frontend
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import "../../Css/DetailStory.css"
import Loader from '../GeneralScreens/Loader';
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import API from '../../utils/api';
import { FiEdit } from 'react-icons/fi'
import { FaRegComment } from 'react-icons/fa'
import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from 'react-icons/bs'
import CommentSidebar from '../CommentScreens/CommentSidebar';
import { getImageUrl } from '../../utils/imageUtils';

const DetailStory = () => {
  const [likeStatus, setLikeStatus] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [activeUser, setActiveUser] = useState({})
  const [story, setStory] = useState({})
  const [storyLikeUser, setStoryLikeUser] = useState([])
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false)
  const [loading, setLoading] = useState(true)
  const slug = useParams().slug
  const [storyReadListStatus, setStoryReadListStatus] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {

    const getDetailStory = async () => {
      setLoading(true)
      var activeUser = {}
      try {
        const { data } = await API.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        activeUser = data.user

        setActiveUser(activeUser)

      }
      catch (error) {
        setActiveUser({})
      }

      try {
        const { data } = await API.get(`/story/${slug}`);
        setStory(data.data);
        setLikeStatus(data.likeStatus);
        setLikeCount(data.data.likeCount);
        setStoryLikeUser(data.data.likes);
        setLoading(false);

        const story_id = data.data._id;

        if (activeUser.readList) {

          if (!activeUser.readList.includes(story_id)) {
            setStoryReadListStatus(false)
          }
          else {
            setStoryReadListStatus(true)

          }

        }

      }
      catch (error) {
        setStory({})
        navigate("/not-found")
      }

    }
    getDetailStory();

  }, [slug, setLoading])



  const handleLike = async () => {
    setTimeout(() => {
      setLikeStatus(!likeStatus)
    }, 1500)

    try {
      const { data } = await API.post(`/story/${slug}/like`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      setLikeCount(data.data.likeCount)
      setStoryLikeUser(data.data.likes)

    }
    catch (error) {
      setStory({})
      localStorage.removeItem("authToken")
      navigate("/")
    }

  }

  const handleDelete = async () => {

    if (window.confirm("Do you want to delete this post")) {

      try {

        await API.delete(`/story/${slug}/delete`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        navigate("/")

      }
      catch (error) {
        console.log(error)
      }

    }

  }


  const editDate = (createdAt) => {

    const d = new Date(createdAt)
      ;
    var datestring = d.toLocaleString('eng', { month: 'long' }).substring(0, 3) + " " + d.getDate()
    return datestring
  }

  const addStoryToReadList = async () => {

    try {

      const { data } = await API.post(`/user/${slug}/addStoryToReadList`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      setStoryReadListStatus(data.status)

      document.getElementById("readListLength").textContent = data.user.readListLength
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {
        loading ? <Loader /> :
          <>

            <div className='Inclusive-detailStory-page'>

              <div className="top_detail_wrapper">

                <h5>{story.title}</h5>

                <div className='story-general-info'>

                  <ul>
                    {story.author &&
                      <li className='story-author-info'>
                        <img src={getImageUrl(story.author.photo, 'userPhotos')} alt={story.author.username} />
                        <span className='story-author-username'>{story.author.username}  </span>
                      </li>
                    }
                    <li className='story-createdAt'>
                      {
                        editDate(story.createdAt)
                      }
                    </li>
                    <b>-</b>

                    <li className='story-readtime'>
                      {story.readtime} min read

                    </li>

                  </ul>

                  {
                    !activeUser.username &&
                    <div className='comment-info-wrap'>

                      <i onClick={(prev) => {
                        setSidebarShowStatus(!sidebarShowStatus)
                      }}>
                        <FaRegComment />
                      </i>


                      <b className='commentCount'>{story.commentCount}</b>

                    </div>
                  }

                  {activeUser && story.author &&
                    story.author._id === activeUser._id ?
                    <div className="top_story_transactions">
                      <Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
                        <FiEdit />
                      </Link>
                      <span className='deleteStoryLink' onClick={handleDelete}>
                        <RiDeleteBin6Line />
                      </span>
                    </div> : null
                  }
                </div>

              </div>

              <div className="CommentFieldEmp">

                <CommentSidebar slug={slug} sidebarShowStatus={sidebarShowStatus} setSidebarShowStatus={setSidebarShowStatus}
                  activeUser={activeUser}
                />

              </div>

              <div className='story-content' >

                <div className="story-banner-img">
                  <img 
                    src={getImageUrl(story.image, 'storyImages')} 
                    alt={story.title} 
                  />

                </div>

                <div className='content' dangerouslySetInnerHTML={{ __html: (story.content) }}>
                </div>

              </div>

              {activeUser.username &&
                <div className='fixed-story-options'>

                  <ul>
                    <li>

                      <i onClick={handleLike} >

                        {likeStatus ? <FaHeart color="#0063a5" /> :
                          <FaRegHeart />
                        }
                      </i>

                      <b className='likecount'
                        style={likeStatus ? { color: "#0063a5" } : { color: "rgb(99, 99, 99)" }}
                      >  {likeCount}
                      </b>

                    </li>


                    <li>
                      <i onClick={(prev) => {
                        setSidebarShowStatus(!sidebarShowStatus)
                      }}>
                        <FaRegComment />
                      </i>

                      <b className='commentCount'>{story.commentCount}</b>

                    </li>

                  </ul>

                  <ul>
                    <li>
                      <i onClick={addStoryToReadList}>

                        {storyReadListStatus ? <BsBookmarkFill color='#0205b1' /> :
                          <BsBookmarkPlus />
                        }
                      </i>
                    </li>

                    <li className='BsThreeDots_opt'>
                      <i  >
                        <BsThreeDots />
                      </i>

                      {activeUser &&
                        story.author._id === activeUser._id ?
                        <div className="delete_or_edit_story  ">
                          <Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
                            <p>Edit Story</p>
                          </Link>
                          <div className='deleteStoryLink' onClick={handleDelete}>
                            <p>Delete Story</p>
                          </div>
                        </div> : null
                      }

                    </li>

                  </ul>

                </div>
              }

            </div>
          </>
      }
    </>
  )
}

export default DetailStory;


// import React, { useEffect, useState, useContext } from 'react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import "../../Css/DetailStory.css";
// import Loader from '../GeneralScreens/Loader';
// import { FaRegHeart, FaHeart } from 'react-icons/fa';
// import { RiDeleteBin6Line } from 'react-icons/ri';
// import { FiEdit } from 'react-icons/fi';
// import { FaRegComment } from 'react-icons/fa';
// import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from 'react-icons/bs';
// import CommentSidebar from '../CommentScreens/CommentSidebar';
// import API from '../../utils/api';
// import { AuthContext } from '../../Context/AuthContext';

// const DetailStory = () => {
//   const [likeStatus, setLikeStatus] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const [story, setStory] = useState(null);
//   const [sidebarShowStatus, setSidebarShowStatus] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [storyReadListStatus, setStoryReadListStatus] = useState(false);
//   const [error, setError] = useState("");
//   const { activeUser } = useContext(AuthContext);
//   const { slug } = useParams();
//   const navigate = useNavigate();

//   // Get API URL for images
//   const getImageUrl = (imagePath, type = 'storyImages') => {
//     if (!imagePath) return `/default-${type === 'userPhotos' ? 'avatar' : 'story'}.png`;
//     const apiUrl = process.env.REACT_APP_API_URL || 'https://mern-blog-sr9a.onrender.com';
//     return `${apiUrl}/${type}/${imagePath}`;
//   };

//   useEffect(() => {
//     let isMounted = true;
//     const getDetailStory = async () => {
//       setLoading(true);
//       setError("");
      
//       console.log("Fetching story with slug:", slug); // Debug log
      
//       try {
//         const { data } = await API.get(`/story/${slug}`);
        
//         console.log("Story data received:", data); // Debug log
        
//         if (!isMounted) return;
        
//         if (!data || !data.data) {
//           throw new Error("Story not found");
//         }
        
//         setStory(data.data);
//         setLikeStatus(data.likeStatus || false);
//         setLikeCount(data.data.likeCount || 0);

//         // Check if story is in user's read list
//         if (activeUser?.readList?.includes(data.data._id)) {
//           setStoryReadListStatus(true);
//         } else {
//           setStoryReadListStatus(false);
//         }
//       } catch (error) {
//         console.error("Error fetching story:", error); // Debug log
        
//         if (!isMounted) return;
        
//         const errorMessage = error.response?.data?.error || error.message || "Story not found";
//         setError(errorMessage);
//         setStory(null);
        
//         if (error.response?.status === 404) {
//           navigate("/not-found");
//         }
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };
    
//     if (slug) {
//       getDetailStory();
//     } else {
//       navigate("/");
//     }
    
//     return () => { isMounted = false; };
//   }, [slug, activeUser, navigate]);

//   const handleLike = async () => {
//     if (!activeUser) {
//       navigate("/login");
//       return;
//     }
    
//     // Optimistic update
//     const newLikeStatus = !likeStatus;
//     setLikeStatus(newLikeStatus);
//     setLikeCount((prev) => newLikeStatus ? prev + 1 : prev - 1);
    
//     try {
//       const { data } = await API.post(`/story/${slug}/like`);
//       setLikeCount(data.data.likeCount);
//     } catch (error) {
//       // Revert on error
//       setLikeStatus(!newLikeStatus);
//       setLikeCount((prev) => newLikeStatus ? prev - 1 : prev + 1);
      
//       if (error.response?.status === 401) navigate("/login");
//     }
//   };

//   const handleDelete = async () => {
//     if (window.confirm("Do you want to delete this post?")) {
//       try {
//         await API.delete(`/story/${slug}/delete`);
//         navigate("/");
//       } catch (error) {
//         setError("Failed to delete story");
//       }
//     }
//   };

//   const addStoryToReadList = async () => {
//     if (!activeUser) {
//       navigate("/login");
//       return;
//     }
//     try {
//       const { data } = await API.post(`/user/${slug}/addStoryToReadList`);
//       setStoryReadListStatus(data.status);
//     } catch (error) {
//       console.error("Failed to update read list:", error);
//     }
//   };

//   const editDate = (createdAt) => {
//     if (!createdAt) return "";
//     const d = new Date(createdAt);
//     return d.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const handleImageError = (e, fallbackSrc) => {
//     e.target.src = fallbackSrc;
//     e.target.onerror = null; // Prevent infinite loop
//   };

//   if (loading) return <Loader />;
  
//   if (error || !story) {
//     return (
//       <div className="story-error">
//         <h2>Story Not Found</h2>
//         <p>{error || "The story you're looking for doesn't exist."}</p>
//         <button onClick={() => navigate("/")} className="btn-primary">
//           Back to Home
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className='Inclusive-detailStory-page'>
//       <div className="top_detail_wrapper">
//         <h1>{story.title}</h1>
//         <div className='story-general-info'>
//           <ul>
//             {story.author && (
//               <li className='story-author-info'>
//                 <img
//                   src={getImageUrl(story.author.photo, 'userPhotos')}
//                   alt={story.author.username || 'User'}
//                   onError={(e) => handleImageError(e, '/default-avatar.png')}
//                 />
//                 <span className='story-author-username'>{story.author.username}</span>
//               </li>
//             )}
//             <li className='story-createdAt'>{editDate(story.createdAt)}</li>
//             <b>-</b>
//             <li className='story-readtime'>{story.readtime || 1} min read</li>
//           </ul>
          
//           <div className='comment-info-wrap'>
//             <i onClick={() => setSidebarShowStatus((prev) => !prev)}>
//               <FaRegComment />
//             </i>
//             <b className='commentCount'>{story.commentCount || 0}</b>
//           </div>
          
//           {activeUser && story.author && story.author._id === activeUser._id && (
//             <div className="top_story_transactions">
//               <Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
//                 <FiEdit />
//               </Link>
//               <span className='deleteStoryLink' onClick={handleDelete}>
//                 <RiDeleteBin6Line />
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
      
//       <div className="CommentFieldEmp">
//         <CommentSidebar
//           slug={slug}
//           sidebarShowStatus={sidebarShowStatus}
//           setSidebarShowStatus={setSidebarShowStatus}
//           activeUser={activeUser}
//         />
//       </div>
      
//       <div className='story-content'>
//         {story.image && (
//           <div className="story-banner-img">
//             <img
//               src={getImageUrl(story.image, 'storyImages')}
//               alt={story.title}
//               onError={(e) => { e.target.style.display = 'none'; }}
//             />
//           </div>
//         )}
//         <div className='content' dangerouslySetInnerHTML={{ __html: story.content }} />
//       </div>
      
//       {activeUser?.username && (
//         <div className='fixed-story-options'>
//           <ul>
//             <li>
//               <i onClick={handleLike}>
//                 {likeStatus ? <FaHeart color="#0063a5" /> : <FaRegHeart />}
//               </i>
//               <b className='likecount' style={likeStatus ? { color: "#0063a5" } : { color: "rgb(99, 99, 99)" }}>
//                 {likeCount}
//               </b>
//             </li>
//             <li>
//               <i onClick={() => setSidebarShowStatus((prev) => !prev)}>
//                 <FaRegComment />
//               </i>
//               <b className='commentCount'>{story.commentCount || 0}</b>
//             </li>
//           </ul>
//           <ul>
//             <li>
//               <i onClick={addStoryToReadList}>
//                 {storyReadListStatus ? <BsBookmarkFill color='#0205b1' /> : <BsBookmarkPlus />}
//               </i>
//             </li>
//             <li className='BsThreeDots_opt'>
//               <i>
//                 <BsThreeDots />
//               </i>
//               {activeUser && story.author && story.author._id === activeUser._id && (
//                 <div className="delete_or_edit_story">
//                   <Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
//                     <p>Edit Story</p>
//                   </Link>
//                   <div className='deleteStoryLink' onClick={handleDelete}>
//                     <p>Delete Story</p>
//                   </div>
//                 </div>
//               )}
//             </li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DetailStory;