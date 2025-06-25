const express = require("express");
const { 
  register, 
  login,
  resetpassword,
  forgotpassword,
  getPrivateData
} = require('../Controllers/auth.js');
const { getAccessToRoute } = require("../Middlewares/Authorization/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotpassword);
router.put("/resetpassword", resetpassword);

// ✅ JWT Protected Route
router.get("/private", getAccessToRoute, getPrivateData);

module.exports = router;
