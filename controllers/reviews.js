const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let camground = await Campground.findById(id);

  let review = await Review.create({
    ...req.body.review,
    author: req.user._id,
  });
  camground.reviews.push(review);
  await camground.save();

  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(req.user.id)) {
    req.flash("error", "You can not delete review");
    return res.redirect(`/campgrounds/${id}`);
  } else {
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/campgrounds/${id}`);
  }
};
