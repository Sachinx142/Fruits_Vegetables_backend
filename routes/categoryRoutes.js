const express = require("express");
const router = express.Router();
const {getCategory,getCategorybyId,getAllActiveCategory,createCategory,updateCategory,deleteCategory,changeStatus} = require("../controller/categoryController")

router.get('/getCategory',getCategory)
router.get('/getAllActiveCategory',getAllActiveCategory)
router.post('/getCategorybyId',getCategorybyId)
router.post('/createCategory',createCategory)
router.post('/updateCategory',updateCategory)
router.post('/deleteCategory',deleteCategory)
router.post('/changeStatus',changeStatus)


module.exports = router