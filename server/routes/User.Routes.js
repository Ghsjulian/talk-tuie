const express = require("express");
const path = require("path");
const router = express.Router();
const USerController = require("../controllers/User.Controller");
const upload = require("../config/avatar.config");
//const uploadFolder = path.join(__dirname, "../public/users/");
//const upload = UpdateAvatar(uploadFolder);

router.post("/user-signup",upload.single('avatar'), USerController.UserSignup);
router.post("/user-login", USerController.UserLogin);


module.exports = router;
