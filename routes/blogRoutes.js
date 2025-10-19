const express = require("express");
const router = express.Router();
const {createBlog, updateBlog, getAllBlogs, getBlogByID, getLatestBlogs, getBlogBySlug, deleteBlog, changeStatus} = require("../controller/blogController")
const upload = require("../middleware/fileupload")


const multiUpload = upload.fields([
  { name: "blogImage", maxCount: 1 },
]);



router.get("/getAllBlogs",getAllBlogs)
router.get("/getLatestBlogs",getLatestBlogs)
router.post("/getBlogByID",getBlogByID)
router.post("/createBlog",multiUpload,createBlog)
router.post("/updateBlog",multiUpload,updateBlog)
router.post("/changeStatus",changeStatus)
router.post("/deleteBlog",deleteBlog)
router.post("/getBlogBySlug",getBlogBySlug)

module.exports = router