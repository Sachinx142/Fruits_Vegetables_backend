const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    date_of_birth:{
      type:Date,
      default:null,
    },
    address:{
      type:String,
      default:null
    },
    profilePicture:{
      type:String,
      default:null
    },
    emailOtp: {
      type: Number,
      default: null,
    },
    phoneOtp: {
      type: Number,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },

    //OTP Verification
    otpVefication: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: "User",
    },
    status: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
