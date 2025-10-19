const categoryModel = require("../models/categoryModel");

const getCategory = async (req, res) => {
  try {
    const data = await categoryModel.find();

    if (!data || data.length === 0) {
      return res.json({
        status: 0,
        message: "Unable to get data",
      });
    }

    return res.status(200).json({
      message: "Get Data Successfully",
      status: 1,
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", status: 0 });
  }
};
const getCategorybyId = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.json({
        message: "Unable to get category data",
        status: 0,
      });
    }

    const data = await categoryModel.findById(id);

    if (!data) {
      return res.json({
        message: "Category not found.",
        status: 0,
      });
    }

    return res.status(200).json({
      message: "Category Data Successfully",
      status: 1,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal server error", status: 0 });
  }
};

const getAllActiveCategory = async (req, res) => {
  try {
    const data = await categoryModel.find({ status: 1 });

    

    if (!data || data.length === 0) {
      return res.json({
        message: "Unable to get category data",
        status: 0,
      });
    }

    return res.json({
      message: "Category Data Successfully",
      status: 1,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal server error", status: 0 });
  }
};

const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.json({
        message: "Category name is required",
        status: 0,
      });
    }

    const isExists = await categoryModel.findOne({
      categoryName: categoryName,
    });

    if (isExists) {
      return res.json({
        message: "Category Already Exits",
        status: 0,
      });
    }

    const data = await categoryModel.create({
      categoryName,
      status: 1,
    });

    return res.status(200).json({
      message: "Category is Created Successfully",
      data: data,
      status: 1,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal server error", status: 0 });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id, categoryName } = req.body;

    if (!id || !categoryName) {
      return res.json({
        message: "Category ID and Category Name is Required",
        status: 0,
      });
    }

    const data = await categoryModel.findByIdAndUpdate(
      { _id: id },
      { categoryName: categoryName },
      {new:true}
    );

    if (!data) {
      return res.json({
        message: "Unable to update category data",
        status: 0,
      });
    }

    return res.status(200).json({
      message: "Catatgory Upadated Successfully",
      status: 1,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", status: 0 });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.json({ message: "Category Id is required", status: 0 });
    }

    const data = await categoryModel.findByIdAndDelete(id);

    if (!data) {
      res.json({ message: "Unable to update category data", status: 0 });
    }

    return res.status(200).json({
      message: "Category Deleted Successfully",
      status: 1,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", status: 0 });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { status, id } = req.body;

    const data = await categoryModel.findByIdAndUpdate(
      { _id: id },
      { status: status === 1 ? 0 : 1 }
    );

    if (!data) {
      res.json({ message: "Unable to Change Status", status: 0 });
    }

    return res.json({ message: "Status Changed", status: 1, data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", status: 0 });
  }
};



module.exports = {
  getCategory,
  getCategorybyId,
  createCategory,
  updateCategory,
  deleteCategory,
  changeStatus,
  getAllActiveCategory
};
