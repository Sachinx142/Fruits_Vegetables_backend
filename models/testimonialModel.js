const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: null,
  },
  profession: {
    type: String,
    default: null,
  },
  message: {
    type: String,
    default: null,
  },
  userImage: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: null,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  title: {
    type: String,
    default: null,
  },
  keywords: {
    type: String,
    default: null,
  },
  metaDescription: {
    type: String,
    default: null,
  },
  status: {
    type: Number,
    default: 1,
  },
});


const testimonialModel = mongoose.model("testimonialModel", testimonialSchema);

module.exports = testimonialModel
