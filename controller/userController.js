const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const { generateToken } = require("../utils/jwt");
const Base_URL = require("../config/baseUrl");
// const {generateOtp } = require("../utils/otp")

const userLogin = async (req, res) => {
  try {
    const { contact, type } = req.body;

    if (!contact || !type) {
      return res.json({ message: "Email and Phone are required", status: 0 });
    }

    // Type = 2 => Phone && Type = 1 => Email

    const contactType = type === 1 ? "email" : type === 2 ? "phone" : null;

    if (!contactType) {
      return res.json({ message: "Invalid type value", status: 0 });
    }

    const user = await userModel.findOne({ [contactType]: contact });

    if (!user) {
      return res.json({ message: "User not found", status: 0 });
    }

    const emailOtp = 1234;
    const phoneOtp = 1234;
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    if (contactType === "email") {
      user.emailOtp = emailOtp;
      // await sendEmail(
      //   user.email,
      //   "Your Login OTP",
      //   `Hello ${user.name},\nYour OTP is ${emailOtp}. It expires in 5 minutes.`,
      //   `<p>Hello ${user.name},</p><p>Your OTP is <b>${emailOtp}</b>.</p><p>It expires in 5 minutes.</p>`
      // );
    } else if (contactType === "phone") {
      user.phoneOtp = phoneOtp;
      // await sendOtpSms(user.phone, phoneOtp);
    }
    user.otpExpiry = otpExpiry;
    await user.save();

    return res.status(200).json({
      message: "OTP sent successfully",
      status: 1,
      data: {
        id: user._id,
        type: type,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message, status: 0 });
  }
};

const userVerifyOtp = async (req, res) => {
  try {
    const { id, otp, type } = req.body;

    if (!id) {
      return res.json({ status: 0, message: "User ID is required" });
    }

    const contactType =
      type === 1 ? "emailOtp" : type === 2 ? "phoneOtp" : null;
    if (!contactType) {
      return res.json({ message: "Invalid type value", status: 0 });
    }

    const user = await userModel.findOne({ _id: id });

    if (!user) {
      return res.json({ message: "User not found", status: 0 });
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return res.json({ message: "OTP expired", status: 0 });
    }

    if (String(user[contactType]) !== String(otp)) {
      const errMsg = type === 1 ? "Invalid Email OTP" : "Invalid Phone OTP";
      return res.json({ status: 0, message: errMsg });
    }

    user.emailOtp = null;
    user.phoneOtp = null;
    user.otpExpiry = null;
    await user.save();

    const token = generateToken({ id: user._id });

    return res.status(200).json({
      message: "OTP verified, login successful",
      data: {
        id: user._id,
        role: user.role,
        name: user.fullName,
        token,
      },
      status: 1,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      status: 0,
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;

    if (!fullName || !email || !phone) {
      return res.json({ message: "All fields are required", status: 0 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.json({ message: "Invalid email format", status: 0 });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.json({ message: "Invalid phone number format", status: 0 });
    }

    const isExists = await userModel.findOne({
      $or: [
        { email, otpVefication: 1 },
        { phone, otpVefication: 1 },
      ],
    });

    if (isExists) {
      if (isExists.email === email) {
        return res.json({
          message: "Email already registered Please Login.",
          status: 0,
        });
      }
      if (isExists.phone === phone) {
        return res.json({
          message: "Phone number already registered Please Login.",
          status: 0,
        });
      }
    }

    //  OTP Generate
    const emailOtp = 1234;
    const phoneOtp = 1234;
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const user = await userModel.create({
      fullName,
      email,
      phone,
      emailOtp,
      phoneOtp,
      otpExpiry,
      status: 1,
    });
    await phone, phoneOtp;
    // await sendEmail(
    //   user.email,
    //   "Your OTP Code",
    //   `Hello ${user.name},\nYour OTP is ${emailOtp}. It expires in 5 minutes.`,
    //   `<p>Hello ${user.name},</p><p>Your OTP is <b>${emailOtp}</b>.</p><p>It expires in 5 minutes.</p>`
    // );
    await user.email;
    user.otpExpiry = otpExpiry;
    await user.save();

    return res.status(201).json({
      message: "Register successfully",
      status: 1,
      data: {
        id: user._id,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message, status: 0 });
  }
};

const registerVerifyOtp = async (req, res) => {
  try {
    const { id, emailOtp, phoneOtp } = req.body;

    if (!id) {
      return res.json({ status: 0, message: "User ID is required" });
    }

    if (!emailOtp || !phoneOtp) {
      return res.json({
        status: 0,
        message: "Email OTP, and Phone OTP are required",
      });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return res.json({ message: "User not found", status: 0 });
    }

    if (new Date() > user.otpExpiry) {
      return res.json({ message: "OTP expired", status: 0 });
    }

    if (user.phoneOtp != phoneOtp) {
      return res.json({ message: "Invalid Phone OTP", status: 0 });
    }
    if (user.emailOtp != emailOtp) {
      return res.json({ message: "Invalid Email OTP", status: 0 });
    }

    user.otpVefication = 1;
    user.phoneOtp = null;
    user.emailOtp = null;
    user.otpExpiry = null;
    await user.save();

    // Remove Duplicates Data
    await userModel.deleteMany({
      _id: { $ne: user._id },
      otpVefication: 0,
      $or: [{ email: user.email }, { phone: user.phone }],
    });

    return res.status(200).json({
      message: "OTP verified successfully",
      status: 1,
      data: {
        id: user._id,
        formCounter: user.formCounter,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message, status: 0 });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ error: "Invalid User Id", status: 0 });
    }

    const data = await userModel.findById(id);

    if (data.profilePicture) {
      data.profilePicture = `${Base_URL}/uploads/${data.profilePicture}`;
    }

    if (!data) {
      return res.json({
        message: "Unable to user Profile get Data",
        status: 0,
      });
    }

    return res
      .status(200)
      .json({
        message: "User Profile Data get Successfully",
        status: 1,
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intenal Server Error!" });
  }
};
// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { id, fullName, email, phone, date_of_birth, address } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ error: "Invalid User Id", status: 0 });
    }

    if (!fullName || !email || !phone || !date_of_birth || !address) {
      return res.json({
        message: "Please fill all required fields.",
        status: 0,
      });
    }

    const currentData = await userModel.findById(id);
    if (!currentData) {
      return res.json({ message: "User Profile not found", status: 0 });
    }

    const profilePicture = req.files?.profilePicture?.[0]?.filename;

    const data = await userModel.findByIdAndUpdate(
      { _id: id },
      { fullName, email, phone, date_of_birth, address, profilePicture },
      { new: true }
    );

    if (!data) {
      return res.json({
        message: "Unable to update User Profile data!",
        status: 0,
      });
    }

    if (data.profilePicture) {
      data.profilePicture = `${Base_URL}/uploads/${data.profilePicture}`;
    }

    return res.status(200).json({
      message: "User Profile updated successfully.",
      status: 1,
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error:!", status: 0 });
  }
};

module.exports = {
  userLogin,
  userVerifyOtp,
  registerUser,
  registerVerifyOtp,
  getUserProfile,
  updateUserProfile,
};
