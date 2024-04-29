const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage: storage });
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const campGroundController = require("../controllers/campgrounds");
const { isLoggedIn, isAuthor, validateData } = require("../middleware");

router.get("/", wrapAsync(campGroundController.index));

router
  .route("/new")
  .get(isLoggedIn, campGroundController.newCampForm)
  .post(
    isLoggedIn,
    upload.single("campground[image]"),
    validateData,
    wrapAsync(campGroundController.createCampGround)
  );

router
  .route("/:id/edit")
  .get(
    isLoggedIn,
    isAuthor,

    wrapAsync(campGroundController.editCampForm)
  )
  .patch(
    isLoggedIn,
    isAuthor,
    upload.single("campground[image]"),
    validateData,
    wrapAsync(campGroundController.updateCampGround)
  );

router
  .route("/:id")
  .get(wrapAsync(campGroundController.showCampGrounds))
  .delete(
    isAuthor,
    isLoggedIn,
    wrapAsync(campGroundController.deleteCampGround)
  );

module.exports = router;
