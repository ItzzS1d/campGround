if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const userRoute = require("./routes/users");
const User = require("./models/user");
const passport = require("passport");
const localStrategy = require("passport-local");
const flash = require("connect-flash");
const reviewRoute = require("./routes/reviews");
const camgroundRoute = require("./routes/campgrounds");
const ExpressError = require("./utils/ErrorClass");
const express = require("express");
const ejsmate = require("ejs-mate");
const methodOverride = require("method-override");

const app = express();
const port = 3000;
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
const session = require("express-session");
const MongoStore = require("connect-mongo");

const mongoose = require("mongoose");
async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}
main()
  .then(() => console.log("mongoose server started"))
  .catch((err) => console.log(err));
app.listen(port, (req, res) => {
  console.log("express server started");
});

app.use(flash());
const store = MongoStore.create({
  crypto: {
    secret: process.env.SECREAT_CODE,
  },
  mongoUrl: process.env.ATLASDB_URL,
  touchAfter: 24 * 3600,
});
app.use(
  session({
    store, //sessionInfo store in db
    secret: process.env.SECREAT_CODE,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;

  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

app.use("/campgrounds", camgroundRoute);
app.use("/campgrounds/:id/review", reviewRoute);
app.use("/", userRoute);

app.use("*", (req, res) => {
  throw new ExpressError(404, "CampGround Does Not Exist");
});

//TODO: Mongoose Error
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    err.status = 404;
    err.message = "CampGround Does Not Exist";
  } else if (err.name === "ValidationError") {
    err.status = 400;
    err.message = "Validation failed";
  } else if (err.name === "MongoError" && err.code === 11000) {
    err.status = 400;
    err.message = "Duplicate field value";
  }
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went Wrong" } = err;
  res.status(status).render("campgrounds/error", { message });
});
