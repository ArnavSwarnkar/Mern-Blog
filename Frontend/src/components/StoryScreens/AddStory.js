// import React, { useRef, useContext } from 'react'
// import { useState } from 'react'
// import axios from 'axios'
// import { Link } from 'react-router-dom'
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { AuthContext } from "../../Context/AuthContext";
// import { AiOutlineUpload } from 'react-icons/ai'
// import '../../Css/AddStory.css'

// const AddStory = () => {

//     const { config } = useContext(AuthContext)
//     const imageEl = useRef(null)
//     const editorEl = useRef(null)
//     const [image, setImage] = useState('')
//     const [title, setTitle] = useState('')
//     const [content, setContent] = useState('')
//     const [success, setSuccess] = useState('')
//     const [error, setError] = useState('')

//     const clearInputs = () => {
//         setTitle('')
//         setContent('')
//         setImage('')
//         editorEl.current.editor.setData('')
//         imageEl.current.value = ""
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formdata = new FormData()
//         formdata.append("title", title)
//         formdata.append("image", image)
//         formdata.append("content", content)

//         try {
//             const { data } = await axios.post("/story/addstory", formdata, config)
//             setSuccess('Add story successfully ')

//             clearInputs()
//             setTimeout(() => {
//                 setSuccess('')
//             }, 7000)

//         }
//         catch (error) {
//             setTimeout(() => {
//                 setError('')

//             }, 7000)
//             setError(error.response.data.error)

//         }

//     }

//     return (

//         <div className="Inclusive-addStory-page ">

//             <form onSubmit={handleSubmit} className="addStory-form">

//                 {error && <div className="error_msg">{error}</div>}
//                 {success && <div className="success_msg">
//                     <span>
//                         {success}
//                     </span>
//                     <Link to="/">Go home</Link>
//                 </div>}

//                 <input
//                     type="text"
//                     required
//                     id="title"
//                     placeholder="Title"
//                     onChange={(e) => setTitle(e.target.value)}
//                     value={title}
//                 />

//                 <CKEditor
//                     editor={ClassicEditor}
//                     onChange={(e, editor) => {
//                         const data = editor.getData();
//                         setContent(data)
//                     }}
//                     ref={editorEl}
//                 />
//                 <div class="StoryImageField">
//                     <AiOutlineUpload />
//                     <div class="txt">
//                         {image ? image.name :
//                             " Include a high-quality image in your story to make it more inviting to readers."
//                         }
//                     </div>
//                     <input
//                         name="image"
//                         type="file"
//                         ref={imageEl}
//                         onChange={(e) => {
//                             setImage(e.target.files[0])
//                         }}
//                     />
//                 </div>
//                 <button type='submit' disabled={image ? false : true} className={image ? 'addStory-btn' : 'dis-btn'}
//                 >Publish </button>
//             </form>

//         </div>

//     )
// }

// export default AddStory


import React, { useRef, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthContext } from "../../Context/AuthContext";
import { AiOutlineUpload } from 'react-icons/ai';
import API from '../../utils/api'; // Import the API instance
import '../../Css/AddStory.css';

const AddStory = () => {
    const { config, activeUser } = useContext(AuthContext);
    const imageEl = useRef(null);
    const editorEl = useRef(null);
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const clearInputs = () => {
        setTitle('');
        setContent('');
        setImage(null);
        if (editorEl.current) {
            editorEl.current.editor.setData('');
        }
        if (imageEl.current) {
            imageEl.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        
        // Create FormData
        const formdata = new FormData();
        formdata.append("title", title);
        formdata.append("content", content);
        if (image) {
            formdata.append("image", image);
        }
        if (activeUser && activeUser._id) {
            formdata.append("author", activeUser._id);
        }

        try {
            // Use API instance with FormData
            const { data } = await API.post("/story/addstory", formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                }
            });

            setSuccess('Story added successfully!');
            clearInputs();
            
        } catch (error) {
            console.error("Add story error:", error);
            setError(error.response?.data?.error || "Failed to add story. Please try again.");
        } finally {
            setLoading(false);
            setTimeout(() => {
                setError('');
                setSuccess('');
            }, 7000);
        }
    };

    return (
        <div className="Inclusive-addStory-page">
            <form onSubmit={handleSubmit} className="addStory-form">
                {error && <div className="error_msg">{error}</div>}
                {success && <div className="success_msg">
                    <span>{success}</span>
                    <Link to="/">Go home</Link>
                </div>}

                <input
                    type="text"
                    required
                    id="title"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    disabled={loading}
                />

                <CKEditor
                    editor={ClassicEditor}
                    onChange={(e, editor) => {
                        const data = editor.getData();
                        setContent(data);
                    }}
                    ref={editorEl}
                    disabled={loading}
                />
                
                <div className="StoryImageField">
                    <AiOutlineUpload />
                    <div className="txt">
                        {image ? image.name :
                            "Include a high-quality image in your story to make it more inviting to readers."
                        }
                    </div>
                    <input
                        name="image"
                        type="file"
                        ref={imageEl}
                        onChange={(e) => setImage(e.target.files[0])}
                        accept="image/*"
                        disabled={loading}
                    />
                </div>
                
                <button 
                    type='submit' 
                    disabled={!image || loading} 
                    className={image && !loading ? 'addStory-btn' : 'dis-btn'}
                >
                    {loading ? 'Publishing...' : 'Publish'}
                </button>
            </form>
        </div>
    );
};

export default AddStory;
