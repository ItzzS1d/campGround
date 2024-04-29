const mongoose = require("mongoose");
const Review = require("./review");


const campGroundSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  location: {
    type: String,
    required: [true, "location is required"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  coordinates : {
    type: { 
      type :String, 
      enum: ["Point"], 
      required: [true, "location is required"] 
    },
    coordinates : {
      type : [Number],
      required : true
    }
  }
});

campGroundSchema.post("findOneAndDelete", async function (data) {
  if (data) {
    await Review.deleteMany({ _id: { $in: data.reviews } });
  }
});
const Campground = mongoose.model("Campground", campGroundSchema);

module.exports = Campground;
