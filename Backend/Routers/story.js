// const express = require("express")
// const imageupload = require("../Helpers/Libraries/imageUpload");

// const { getAccessToRoute } = require("../Middlewares/Authorization/auth");
// const {addStory,getAllStories,detailStory,likeStory, editStory, deleteStory, editStoryPage } = require("../Controllers/story")
// const { checkStoryExist, checkUserAndStoryExist } = require("../Middlewares/database/databaseErrorhandler");

// const router = express.Router() ;

// router.post("/addstory" ,[getAccessToRoute, imageupload.single("image")],addStory)

// router.get("/:slug", checkStoryExist, detailStory)

// router.post("/:slug/like",[getAccessToRoute,checkStoryExist] ,likeStory)

// router.get("/editStory/:slug",[getAccessToRoute,checkStoryExist,checkUserAndStoryExist] , editStoryPage)

// router.put("/:slug/edit",[getAccessToRoute,checkStoryExist,checkUserAndStoryExist, imageupload.single("image")] ,editStory)

// router.delete("/:slug/delete",[getAccessToRoute,checkStoryExist,checkUserAndStoryExist] ,deleteStory)

// router.get("/getAllStories",getAllStories)


// module.exports = router

//backend/Routers/Story.js
const express = require("express");
const imageupload = require("../Helpers/Libraries/imageUpload");
const { getAccessToRoute } = require("../Middlewares/Authorization/auth");
const {
    addStory,
    getAllStories,
    detailStory,
    likeStory,
    editStoryPage,
    editStory,
    deleteStory
} = require("../Controllers/story");
const { checkStoryExist, checkUserAndStoryExist } = require("../Middlewares/database/databaseErrorhandler");

const router = express.Router();

// ✅ IMPORTANT: Specific routes BEFORE parameterized routes
router.get("/getAllStories", getAllStories);
router.post("/addstory", [getAccessToRoute, imageupload.single("image")], addStory);

// ✅ Story detail route - MUST be GET, and consider making it public
router.get("/:slug", checkStoryExist, detailStory) // No auth required for viewing

// ✅ Protected routes
router.post("/:slug/like", [getAccessToRoute, checkStoryExist], likeStory);
router.get("/editStory/:slug", [getAccessToRoute, checkStoryExist, checkUserAndStoryExist], editStoryPage);
router.put("/:slug/edit", [getAccessToRoute, checkStoryExist, checkUserAndStoryExist, imageupload.single("image")], editStory);
router.delete("/:slug/delete", [getAccessToRoute, checkStoryExist, checkUserAndStoryExist], deleteStory);

module.exports = router;
