const express = require("express");
const userAuthService = require("./userauth.service");
const router = express.Router();

//URl to get the users
router.route("/getAllUsers").get(userAuthService.getAllUsers);
router.route("/authorizeUser").post(userAuthService.findUser);
router.route("/saveRecipe").put(userAuthService.saveRecipe);
module.exports = router;
