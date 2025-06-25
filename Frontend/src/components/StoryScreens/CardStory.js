// import React from 'react';
// import { Link } from 'react-router-dom';

// const Story = ({ story }) => {

//     const editDate = (createdAt) => {
//         const monthNames = ["January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//         ];
//         const d = new Date(createdAt);
//         var datestring = d.getDate() + " " +monthNames[d.getMonth()] + " ," + d.getFullYear() 
//         return datestring
//     }

//     const truncateContent = (content) => {
//         const trimmedString = content.substr(0, 73);
//         return trimmedString
//     }
//     const truncateTitle= (title) => {
//         const trimmedString = title.substr(0, 69);
//         return trimmedString
//     }
    
//     return (

//         <div className="story-card">
//             <Link to={`/story/${story.slug}`} className="story-link">

//                 <img className=" story-image" src={`/storyImages/${story.image}`} alt={story.title} />
//                 <div className="story-content-wrapper">

//                     <h5 className="story-title">
                        
//                     {story.title.length > 76 ? truncateTitle(story.title)+"..." : story.title
                    
//                     }
//                     </h5>


//                     <p className="story-text"dangerouslySetInnerHTML={{__html : truncateContent( story.content) +"..."}}>
//                         </p>
//                     <p className="story-createdAt">{editDate(story.createdAt)} 
//                     </p>
//                 </div>
//             </Link>
//         </div>

//     )
// }

// export default Story;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CardStory = ({ story }) => {
    const [imgError, setImgError] = useState(false);

    const editDate = (createdAt) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const d = new Date(createdAt);
        return d.getDate() + " " + monthNames[d.getMonth()] + ", " + d.getFullYear();
    };

    const truncateContent = (content) => {
        if (!content) return "";
        const textOnly = content.replace(/<[^>]*>/g, '');
        return textOnly.substr(0, 73);
    };

    const truncateTitle = (title) => {
        if (!title) return "";
        return title.substr(0, 69);
    };

    const getImageUrl = (imageName) => {
        const apiUrl = process.env.REACT_APP_API_URL || 'https://mern-blog-sr9a.onrender.com';
        return `${apiUrl}/storyImages/${imageName}`;
    };

    const handleImageError = (e) => {
        if (!imgError) {
            setImgError(true);
            e.target.src = '/default-story.png'; // Fallback, loaded only once
        }
    };

    return (
        <div className="story-card">
            <Link to={`/story/${story.slug}`} className="story-link">
                <img
                    className="story-image"
                    src={
                        !imgError && story.image
                            ? getImageUrl(story.image)
                            : '/default-story.png'
                    }
                    alt={story.title || 'Story image'}
                    onError={handleImageError}
                    loading="lazy"
                />
                <div className="story-content-wrapper">
                    <h5 className="story-title">
                        {story.title && story.title.length > 76
                            ? truncateTitle(story.title) + "..."
                            : story.title || "Untitled Story"
                        }
                    </h5>
                    <p className="story-text">
                        {story.content
                            ? truncateContent(story.content) + "..."
                            : "No preview available..."
                        }
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default CardStory;
