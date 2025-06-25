import React, { useEffect, useState, useContext } from 'react'
import Loader from "../GeneralScreens/Loader";
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthContext'
import { AiFillLock } from 'react-icons/ai'
import { BsThreeDots } from 'react-icons/bs'
import ReadListStoryItem from '../StoryScreens/ReadListStoryItem';
import API from '../../utils/api'; // ✅ Use API instance instead of axios
import '../../Css/ReadListPage.css'

const ReadListPage = () => {
    const navigate = useNavigate();
    const [readList, setReadList] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { activeUser } = useContext(AuthContext)

    useEffect(() => {
        const getUserReadingList = async () => {
            setLoading(true)
            setError('')

            try {
                // ✅ FIXED: Correct axios usage with API instance
                const { data } = await API.get('/user/readList');
                
                // ✅ Handle response data properly
                if (data && data.data) {
                    setReadList(data.data);
                } else {
                    setReadList([]);
                }
                
            } catch (error) {
                console.error('ReadList error:', error);
                setError('Failed to load reading list');
                
                // Handle specific error cases
                if (error.response?.status === 401) {
                    navigate("/login");
                } else if (error.response?.status === 404) {
                    setError('Reading list not found');
                } else {
                    setError('Failed to load reading list');
                }
            } finally {
                setLoading(false);
            }
        }
        
        // Only fetch if user is authenticated
        if (activeUser && activeUser._id) {
            getUserReadingList()
        } else {
            navigate("/login");
        }

    }, [activeUser, navigate])

    const editDate = (createdAt) => {
        const d = new Date(createdAt);
        var datestring = d.toLocaleString('en', { month: 'long' }).substring(0, 3) + "  " + d.getDate()
        return datestring
    }

    // ✅ Get image URL from backend
    const getImageUrl = (photo) => {
        if (!photo) return '/default-avatar.png';
        const apiUrl = process.env.REACT_APP_API_URL || 'https://mern-blog-sr9a.onrender.com';
        return `${apiUrl}/userPhotos/${photo}`;
    };

    return (
        <>
            {loading ? <Loader /> :
                <div className="Inclusive-readList-page">
                    <h2>Reading List</h2>

                    {error && (
                        <div className="error-message" style={{color: 'red', padding: '1rem', textAlign: 'center'}}>
                            {error}
                        </div>
                    )}

                    <div className="readList-top-block">
                        {/* ✅ FIXED: Use absolute URL for profile image */}
                        <img 
                            src={activeUser?.photo ? getImageUrl(activeUser.photo) : '/default-avatar.png'} 
                            alt={activeUser?.username || 'User'} 
                            onError={(e) => {
                                e.target.src = '/default-avatar.png';
                            }}
                        />

                        <div className='activeUser-info-wrapper'>
                            <b>{activeUser?.username || 'Anonymous'}</b>
                            <div>
                                <span>{editDate(Date.now())}</span>
                                <span>-</span>
                                <span>{activeUser?.readListLength || readList.length} stories</span>
                                <i><AiFillLock /></i>
                            </div>
                        </div>

                        <i className='BsThreeDots-icon'>
                            <BsThreeDots />
                        </i>
                    </div>

                    <div className="readList-story-wrapper">
                        {readList.length !== 0 ? (
                            <>
                                {readList.map(story => (
                                    <ReadListStoryItem 
                                        key={story._id} 
                                        story={story} 
                                        editDate={editDate} 
                                    />
                                ))}
                            </>
                        ) : (
                            <div className="empty-readList">
                                {error ? 'Failed to load reading list' : 'Reading List is empty'}
                            </div>
                        )}
                    </div>
                </div>
            }
        </>
    )
}

export default ReadListPage
