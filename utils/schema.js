const joi = require("joi");

module.exports.joicampGroundSchema = joi.object({
  campground: joi
    .object({
      title: joi.string().required(),
      location: joi.string().required(),
      image: joi.any(),
      price: joi.number().required().min(0),
      description: joi.string().required(),
    })
    .required(),
});

module.exports.joireviewSchema = joi.object({
  review: joi
    .object({
      comment: joi.string().required(),
      rating: joi.number().required().min(1).max(5),
    })
    .required(),
});
