const Campground = require("./models/campground");
const { joireviewSchema } = require("./utils/schema");
const { joicampGroundSchema } = require("./utils/schema");
const ExpressError = require("./utils/ErrorClass");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  let { id } = req.params;
  let camp = await Campground.findById(id);

  if (!camp.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You can not edit this");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateData = (req, res, next) => {
  let { error } = joicampGroundSchema.validate(req.body);

  if (error) {
    let msg = error.details.map((el) => el.message);

    next(new ExpressError(400, msg));
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = joireviewSchema.validate(req.body);
  if (error) {
   
    let msg = error.details.map((el) => el.message);
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};
