const express = require("express");
const router = express.Router();
const {
   userLogin,
   userVerifyOtp,
   registerUser,
   registerVerifyOtp,
   getUserProfile,
   updateUserProfile
} = require("../controller/userController");
const upload = require("../middleware/fileupload")


const multiUpload = upload.fields([
  { name: "profilePicture", maxCount: 1 },
]);


router.post("/login", userLogin);
router.post("/verify-otp", userVerifyOtp);
router.post("/register", registerUser);
router.post("/registerVerifyOtp", registerVerifyOtp);

// User Profile
router.post("/getUserProfile",getUserProfile)
router.post("/updateUserProfile",multiUpload,updateUserProfile)

module.exports = router;
