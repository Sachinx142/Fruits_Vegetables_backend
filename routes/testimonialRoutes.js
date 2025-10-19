const express = require("express");
const router = express.Router();
const {createTestimonial,updateTestimonial,deleteTestimonial,getAllTestimonials,getTestimonialsByID,getActiveTestimonials,changeStatus, getLatestTestimonials} = require("../controller/testimonialController")
const upload = require("../middleware/fileupload")


const multiUpload = upload.fields([
  { name: "userImage", maxCount: 1 },
]);


router.get("/getActiveTestimonials",getActiveTestimonials)
router.get("/getLatestTestimonials",getLatestTestimonials)
router.get("/getAllTestimonials",getAllTestimonials)                            
router.post("/getTestimonialsByID",getTestimonialsByID)
router.post("/createTestimonial",multiUpload,createTestimonial)
router.post("/updateTestimonial",multiUpload,updateTestimonial)
router.post("/changeStatus",changeStatus)
router.post("/deleteTestimonial",deleteTestimonial)

module.exports = router