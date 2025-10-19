const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryName:{type:String,default:null},
    status: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const categoryModel =  mongoose.model("categoryModel",categorySchema)

module.exports = categoryModel