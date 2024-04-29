const mongoose = require('mongoose');
const { Schema } = mongoose;

let reviewSchema = new Schema({
    comment: {
        type : String,
        require : [true , "Please Leave a review"]
    },
    rating: {
        type : Number , 
        require: [true , "Please Leave a rating"]
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "USER"
      }

})

module.exports = mongoose.model("Review" , reviewSchema)
