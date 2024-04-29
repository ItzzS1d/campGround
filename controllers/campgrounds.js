const Campground = require("../models/campground");
const ExpressError = require("../utils/ErrorClass");
const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = geocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
  let result = await Campground.find({});
  res.render("campgrounds/index", { result });
};
module.exports.newCampForm = (req, res) => {
  res.render("campgrounds/new");
};
module.exports.showCampGrounds = async (req, res, next) => {
  let { id } = req.params;
  let camp = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author")
    .populate("");
  if (!camp) {
    throw new ExpressError(404, "CampGround Does Not Exist");
  }

  res.render("campgrounds/show", { camp });
};

module.exports.createCampGround = async (req, res, next) => {
  let responce = await geocodingClient
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  let coordinates = responce.body.features[0].geometry;
  let { path, filename } = req.file;
  let campground = await Campground.create({
    ...req.body.campground,
    author: req.user._id,
    image: {
      url: path,
      filename,
    },
    coordinates,
  });
  req.flash("success", "New Campground Created Successfully");
  res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.editCampForm = async (req, res, next) => {
  let { id } = req.params;
  let data = await Campground.findById(id);
  let cropedImg = data.image.url.replace("/upload", "/upload/w_250");
  res.render("campgrounds/edit", { data, cropedImg });
};

module.exports.updateCampGround = async (req, res, next) => {
  let { id } = req.params;
  await Campground.findById(id);
  let camp = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  if (typeof req.file != "undefined") {
    let { path, filename } = req.file;
    camp.image = {
      url: path,
      filename,
    };
    await camp.save();
  }

  req.flash("success", "Edit Successful");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampGround = async (req, res) => {
  let { id } = req.params;

  await Campground.findByIdAndDelete(id);
  req.flash("error", "Campground Deleted Successfully");
  res.redirect("/campgrounds");
};
