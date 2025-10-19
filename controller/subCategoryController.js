const subcategoryModel = require("../models/subcategoryModel");

const getAllSubCategory = async (req, res) => {
  try {
    const data = await subcategoryModel.find().populate("categoryId", "categoryName");

    if (!data || data.length === 0) {
      return res.json({
        message: "Unable to get Subcategory data",
        status: 0,
      });
    }

    return res.status(200).json({
        message: "SubCategory Data Successfully",
        status: 1,
        data: data,
    });
  } catch (error) {
     console.log(error);
    res.status(500).json({ message: "Internal server error", status: 0 })
  }
};

const getSubCategorybyId = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.json({
        message: "Unable to get Subcategory data",
        status: 0,
      });
    }

    const data = await subcategoryModel.findById(id);

    if (!data) {
      return res.json({
        message: "SubCategory not found.",
        status: 0,
      });
    }

    return res.status(200).json({
      message: "SubCategory Data Successfully",
      status: 1,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", status: 0 })
  }
};

const createSubCategory = async (req, res) => {
  try {
    const { subCategoryName, categoryId } = req.body;

    if (!subCategoryName) {
      return res.json({
        message: "SubCategory name is required",
        status: 0,
      });
    }

    if(!categoryId){
      return res.json({
        message:"SubCategory ID is required",
        status:0
      })
    }


    const isExists = await subcategoryModel.findOne({ subCategoryName:subCategoryName,categoryId:categoryId});
    
    if (isExists) {
      return res.json({
        message: "SubCategory Already Exits",
        status: 0,
      });
    }

    const data = await subcategoryModel.create({
      subCategoryName,
      categoryId,
      status: 1,
    });

    return res.status(200).json({
      message: "SubCategory is Created Successfully",
      data: data,
      status: 1,
    });
  } catch (error) {
     console.log(error);
    res.status(500).json({ message: "Internal server error", status: 0 })
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const { id, subCategoryName, categoryId } = req.body;

    if (!id) {
      return res.json({
        message: "SubCategory ID is Not Found",
        status: 0,
      });
    }

    if (!subCategoryName) {
      return res.json({
        message: "SubCategory name is required",
        status: 0,
      });
    }

    if(!categoryId){
      return res.json({
        message:"SubCategory ID is required"
      })
    }

    const data = await subcategoryModel.findByIdAndUpdate(
      { _id: id },
      { subCategoryName, categoryId }
    );

    if (!data) {
      return res.json({
        message: "Unable to update category data",
        status: 0,
      });
    }

    return res.status(200).json({
      message: "SubCatatgory Upadated Successfully",
      status: 1,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", status: 0 })
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.body;

      if(!id){
         return res
        .json({ message: "SubCategory Id is required", status: 0 });
    }


    const data = await subcategoryModel.findByIdAndDelete(id);

    if (!data) {
      res
        .json({ message: "Unable to update category data", status: 0 });
    }

    return res.status(200).json({
      message: "SubCategory Deleted Successfully",
      status: 1,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", status: 0 })
  }
};

const changeStatus = async (req, res) => {
  try {
    const { status, id } = req.body;

    const data = await subcategoryModel.findByIdAndUpdate(
      { _id: id },
      { status: status === 1 ? 0 : 1 }
    );

    if (!data) {
      res.json({ message: "Unable to Change Status", status: 0 });
    }

    return res
      .status(200)
      .json({ message: "Status Changed", status: 1, data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", status: 0 })
  }
};

const getAllActiveSubcategory = async (req, res) => {
  try {
    const data = await subcategoryModel.find({ status: 1 });

    if (!data) {
      return res.json({
        message: "Unable to get Subcategory data",
        status: 0,
      });
    }

    return res.status(200).json({
         message: "SubCategory Data Successfully",
        status: 1,
        data: data,
    })

  } catch (error) {
     console.log(error);
    res.status(500).json({ message: "Internal server error", status: 0 })
  }
};

const getActiveSubCategoriesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.body;

    console.log(categoryId)

    if (!categoryId) {
      return res.json({
        message: "Category ID is required",
        status: 0,
      });
    }

    const subcategories = await subcategoryModel.find({
      categoryId,
      status: 1
    });

    if (!subcategories || subcategories.length === 0) {
      return res.json({
        message: "No active subcategories found for this category",
        status: 0
      });
    }

    return res.status(200).json({
      message: "Active Subcategories fetched successfully",
      status: 1,
      data: subcategories
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: 0
    });
  }
};


module.exports = {
  getAllSubCategory,
  getSubCategorybyId,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  changeStatus,
  getAllActiveSubcategory,
  getActiveSubCategoriesByCategoryId
};
