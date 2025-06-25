// const asyncErrorWrapper = require("express-async-handler")
// const Story = require("../Models/story");
// const deleteImageFile = require("../Helpers/Libraries/deleteImageFile");
// const {searchHelper, paginateHelper} =require("../Helpers/query/queryHelpers")

// const addStory = asyncErrorWrapper(async  (req,res,next)=> {

//     const {title,content} = req.body 

//     var wordCount = content.trim().split(/\s+/).length ; 
   
//     let readtime = Math.floor(wordCount /200)   ;


//     try {
//         const newStory = await Story.create({
//             title,
//             content,
//             author :req.user._id ,
//             image : req.savedStoryImage,
//             readtime
//         })

//         return res.status(200).json({
//             success :true ,
//             message : "add story successfully ",
//             data: newStory
//         })
//     }

//     catch(error) {

//         deleteImageFile(req)

//         return next(error)
        
//     }
  
// })

// const getAllStories = asyncErrorWrapper( async (req,res,next) =>{

//     let query = Story.find();

//     query =searchHelper("title",query,req)

//     const paginationResult =await paginateHelper(Story , query ,req)

//     query = paginationResult.query  ;

//     query = query.sort("-likeCount -commentCount -createdAt")

//     const stories = await query
    
//     return res.status(200).json(
//         {
//             success:true,
//             count : stories.length,
//             data : stories ,
//             page : paginationResult.page ,
//             pages : paginationResult.pages
//         })

// })

// const detailStory =asyncErrorWrapper(async(req,res,next)=>{

//     const {slug}=req.params ;
//     const {activeUser} =req.body 

//     const story = await Story.findOne({
//         slug: slug 
//     }).populate("author likes")

//     const storyLikeUserIds = story.likes.map(json => json.id)
//     const likeStatus = storyLikeUserIds.includes(activeUser._id)


//     return res.status(200).
//         json({
//             success:true,
//             data : story,
//             likeStatus:likeStatus
//         })

// })

// const likeStory =asyncErrorWrapper(async(req,res,next)=>{

//     const {activeUser} =req.body 
//     const {slug} = req.params ;

//     const story = await Story.findOne({
//         slug: slug 
//     }).populate("author likes")
   
//     const storyLikeUserIds = story.likes.map(json => json._id.toString())
   
//     if (! storyLikeUserIds.includes(activeUser._id)){

//         story.likes.push(activeUser)
//         story.likeCount = story.likes.length
//         await story.save() ; 
//     }
//     else {

//         const index = storyLikeUserIds.indexOf(activeUser._id)
//         story.likes.splice(index,1)
//         story.likeCount = story.likes.length

//         await story.save() ; 
//     }
 
//     return res.status(200).
//     json({
//         success:true,
//         data : story
//     })

// })

// const editStoryPage  =asyncErrorWrapper(async(req,res,next)=>{
//     const {slug } = req.params ; 
   
//     const story = await Story.findOne({
//         slug: slug 
//     }).populate("author likes")

//     return res.status(200).
//         json({
//             success:true,
//             data : story
//     })

// })


// const editStory  =asyncErrorWrapper(async(req,res,next)=>{
//     const {slug } = req.params ; 
//     const {title ,content ,image ,previousImage } = req.body;

//     const story = await Story.findOne({slug : slug })

//     story.title = title ;
//     story.content = content ;
//     story.image =   req.savedStoryImage ;

//     if( !req.savedStoryImage) {
//         // if the image is not sent
//         story.image = image
//     }
//     else {
//         // if the image sent
//         // old image locatıon delete
//        deleteImageFile(req,previousImage)

//     }

//     await story.save()  ;

//     return res.status(200).
//         json({
//             success:true,
//             data :story
//     })

// })

// const deleteStory  =asyncErrorWrapper(async(req,res,next)=>{

//     const {slug} = req.params  ;

//     const story = await Story.findOne({slug : slug })

//     deleteImageFile(req,story.image) ; 

//     await story.remove()

//     return res.status(200).
//         json({
//             success:true,
//             message : "Story delete succesfully "
//     })

// })


// module.exports ={
//     addStory,
//     getAllStories,
//     detailStory,
//     likeStory,
//     editStoryPage,
//     editStory ,
//     deleteStory
// }


//backend/Controller/story.js
const asyncErrorWrapper = require("express-async-handler")
const Story = require("../Models/story");
const deleteImageFile = require("../Helpers/Libraries/deleteImageFile");
const {searchHelper, paginateHelper} = require("../Helpers/query/queryHelpers")

const addStory = asyncErrorWrapper(async (req, res, next) => {
    const {title, content} = req.body 

    var wordCount = content.trim().split(/\s+/).length; 
    let readtime = Math.floor(wordCount / 200);

    try {
        const newStory = await Story.create({
            title,
            content,
            author: req.user._id,
            image: req.savedStoryImage,
            readtime
        })

        return res.status(200).json({
            success: true,
            message: "add story successfully",
            data: newStory
        })
    }
    catch(error) {
        deleteImageFile(req)
        return next(error)
    }
})

const getAllStories = asyncErrorWrapper(async (req, res, next) => {
    let query = Story.find();

    query = searchHelper("title", query, req)

    const paginationResult = await paginateHelper(Story, query, req)

    query = paginationResult.query;

    query = query.sort("-likeCount -commentCount -createdAt")

    const stories = await query
    
    return res.status(200).json({
        success: true,
        count: stories.length,
        data: stories,
        page: paginationResult.page,
        pages: paginationResult.pages
    })
})

const detailStory = asyncErrorWrapper(async (req, res, next) => {
    const { slug } = req.params;
    
    try {
        const story = await Story.findOne({ slug: slug }).populate("author likes");

        if (!story) {
            return res.status(404).json({
                success: false,
                error: "Story not found"
            });
        }

        // Optional: Check like status if user is authenticated
        let likeStatus = false;
        if (req.user && story.likes && story.likes.length > 0) {
            const storyLikeUserIds = story.likes.map(user => user._id.toString());
            likeStatus = storyLikeUserIds.includes(req.user._id.toString());
        }

        return res.status(200).json({
            success: true,
            data: story,
            likeStatus: likeStatus
        });

    } catch (error) {
        console.error("Error in detailStory:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
});



// ✅ FIXED: likeStory function
const likeStory = asyncErrorWrapper(async (req, res, next) => {
    const {slug} = req.params;
    const activeUser = req.user; // Get from auth middleware, not body

    if (!activeUser) {
        return res.status(401).json({
            success: false,
            error: "Authentication required"
        });
    }

    try {
        const story = await Story.findOne({
            slug: slug 
        }).populate("author likes");

        if (!story) {
            return res.status(404).json({
                success: false,
                error: "Story not found"
            });
        }
       
        const storyLikeUserIds = story.likes.map(user => user._id.toString());
       
        if (!storyLikeUserIds.includes(activeUser._id.toString())) {
            story.likes.push(activeUser._id);
            story.likeCount = story.likes.length;
            await story.save();
        } else {
            const index = storyLikeUserIds.indexOf(activeUser._id.toString());
            story.likes.splice(index, 1);
            story.likeCount = story.likes.length;
            await story.save();
        }
 
        return res.status(200).json({
            success: true,
            data: story
        });

    } catch (error) {
        console.error("Error in likeStory:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
})

const editStoryPage = asyncErrorWrapper(async (req, res, next) => {
    const {slug} = req.params;
   
    try {
        const story = await Story.findOne({
            slug: slug 
        }).populate("author likes");

        if (!story) {
            return res.status(404).json({
                success: false,
                error: "Story not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: story
        });

    } catch (error) {
        console.error("Error in editStoryPage:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
})

const editStory = asyncErrorWrapper(async (req, res, next) => {
    const {slug} = req.params;
    const {title, content, image, previousImage} = req.body;

    try {
        const story = await Story.findOne({slug: slug});

        if (!story) {
            return res.status(404).json({
                success: false,
                error: "Story not found"
            });
        }

        story.title = title;
        story.content = content;
        story.image = req.savedStoryImage;

        if (!req.savedStoryImage) {
            story.image = image;
        } else {
            deleteImageFile(req, previousImage);
        }

        await story.save();

        return res.status(200).json({
            success: true,
            data: story
        });

    } catch (error) {
        console.error("Error in editStory:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
})

const deleteStory = asyncErrorWrapper(async (req, res, next) => {
    const {slug} = req.params;

    try {
        const story = await Story.findOne({slug: slug});

        if (!story) {
            return res.status(404).json({
                success: false,
                error: "Story not found"
            });
        }

        deleteImageFile(req, story.image);

        // Use deleteOne() instead of remove() (deprecated)
        await Story.deleteOne({slug: slug});

        return res.status(200).json({
            success: true,
            message: "Story deleted successfully"
        });

    } catch (error) {
        console.error("Error in deleteStory:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
})

module.exports = {
    addStory,
    getAllStories,
    detailStory,
    likeStory,
    editStoryPage,
    editStory,
    deleteStory
}
