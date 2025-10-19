const express = require("express");
const router = express.Router();
const {createSubCategory,getAllSubCategory,updateSubCategory,deleteSubCategory,changeStatus, getSubCategorybyId, getAllActiveSubcategory, getActiveSubCategoriesByCategoryId} = require("../controller/subCategoryController")

router.get("/getSubCategory",getAllSubCategory)
router.get("/getAllActiveSubcategory",getAllActiveSubcategory)
router.post("/getActiveSubCategoriesByCategoryId",getActiveSubCategoriesByCategoryId)
router.post("/getSubCategorybyId",getSubCategorybyId)
router.post("/createSubCategory",createSubCategory)
router.post("/updateSubCategory",updateSubCategory)
router.post("/deleteSubCategory",deleteSubCategory)
router.post("/changeStatus",changeStatus)


module.exports = router