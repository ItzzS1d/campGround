const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

const userController = require("../controllers/users");

router
  .route("/register")
  .get(userController.registerUserForm)
  .post(wrapAsync(userController.registerUser));

router
  .route("/login")
  .get(userController.loginForm)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userController.loginUser
  );

router.get("/logout", userController.logOut);

router.get("/profile/:authorId", userController.profile);

//TODO: delete User
router.delete("/delete/:id", userController.deleteProfile);

module.exports = router;
