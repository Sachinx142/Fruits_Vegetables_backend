const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    default: null,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productModel",
    default: null,
  },
  status:{
    type:Number,
    default:0
  }
});

const wishlistModel = mongoose.model("wishlistModel",wishlistSchema);
module.exports = wishlistModel
