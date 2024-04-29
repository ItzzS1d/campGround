const ExpressError = require("../utils/ErrorClass");
const Campground = require("../models/campground");
const User = require("../models/user");

module.exports.registerUserForm = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    let newUser = new User({ email, username });
    let registredUser = await User.register(newUser, password);

    req.login(registredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "WELCOME TO CAMPGROUND");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      next(err);
    } else {
      req.flash("success", "goodby");
      res.redirect("/campgrounds");
    }
  });
};

module.exports.profile = async (req, res, next) => {
  try {
    let { authorId } = req.params;
    let camps = await Campground.find({ author: authorId });
    res.render("campgrounds/profile", { camps });
  } catch {
    next(new ExpressError(404, "Profile Not Found"));
  }
};

module.exports.deleteProfile = async (req, res) => {
  let { id } = req.params;
  await User.findByIdAndDelete(id);
  req.flash("success", "Account deletation Successfull");
  res.redirect("/campgrounds");
};
