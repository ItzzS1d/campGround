const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middleware");
const reviewController = require("../controllers/reviews");
const { validateReview } = require("../middleware");


router.post("/", validateReview, isLoggedIn, reviewController.createReview);

router.delete("/:reviewId", isLoggedIn, reviewController.deleteReview);

module.exports = router;
