const express = require("express");
const {signUp,Login, getAllusers}=require( "../controllers/userController.js");

const router = express.Router();

router.post("/signup",signUp);
router.post("/login",Login);
router.get("/users",getAllusers);

module.exports = router;