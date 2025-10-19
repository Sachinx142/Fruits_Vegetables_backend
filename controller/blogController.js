const slugformatter = require("../helper/slugformatter");
const blogModel = require("../models/blogModel");
const Base_URL = require("../config/baseUrl");

// Get All Blogs
const getAllBlogs = async (req, res) => {
  try {
    const data = await blogModel.find({});

    if (!data) {
      return res.json({ message: "Unable to get data.", status: 0 });
    }

    return res.status(200).json({
      message: "Get data successfully.",
      status: 1,
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 0 });
  }
};

//Get Blog By ID
const getBlogByID = async (req, res) => {
  try {
    const { id } = req.body;
    const data = await blogModel.findOne({ _id: id });

    if (data.blogImage && data.blogImage) {
      data.blogImage = `${Base_URL}/uploads/${data.blogImage}`;
    }

    if (!data) {
      return res.json({
        message: "Unable to get blog data",
        status: 0,
      });
    }
    return res
      .status(200)
      .json({ message: "Get Blog Successfully.", status: 1, data: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 0 });
  }
};

// Create Blog
const createBlog = async (req, res) => {
  try {
    const {
      blogName,
      blogSlug,
      blogContent,
      blogDate,
      publisherName,
      blogDescription,
      title,
      keywords,
      metaDescription,
    } = req.body;

    const blogImage = req.files?.blogImage?.[0]?.filename;

    if (!blogName || !blogSlug || !blogContent  || !blogDate) {
      return res.json({
        message: "Please fill all the fields.",
        status: 0,
      });
    }

    const formattedSlug = slugformatter(blogSlug);

    const isExist = await blogModel.findOne({ blogSlug: formattedSlug });
    if (isExist) {
      return res.json({ message: "Blog already exists!", status: 0 });
    }

    const data = new blogModel({
      blogName,
      blogSlug: formattedSlug,
      blogContent,
      blogImage,
      blogDate,
      publisherName,
      blogDescription,
      title,
      keywords,
      metaDescription,
    });

    await data.save();

    return res.status(200).json({
      message: "Blog created successfully.",
      status: 1,
      data: data,
    });
  } catch (error) {
    console.error("Blog Create Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 0 });
  }
};

//Update Blog
const updateBlog = async (req, res) => {
  try {
    const {
      blogName,
      blogSlug,
      blogContent,
      blogDate,
      publisherName,
      blogDescription,
      title,
      keywords,
      metaDescription,
      id,
    } = req.body;

    const currentData = await blogModel.findById(id);
    if (!currentData) {
      return res.json({ message: "Blog not found", status: 0 });
    }



    if (!blogName || !blogSlug || !blogContent  || !blogDate) {
      return res.json({ message: "Please fill all the fields.", status: 0 });
    }

    const formattedSlug = slugformatter(blogSlug);

    const isExist = await blogModel.findOne({
      blogSlug: formattedSlug,
      _id: { $ne: id },
    });
    if (isExist) {
      return res.json({ message: "Blog already exists!", status: 0 });
    }

    // update image
    const blogImage = req.files?.blogImage?.[0]?.filename;

    const data = await blogModel.findByIdAndUpdate(
      id,
      {
        blogName,
        blogSlug: formattedSlug,
        blogContent,
        blogImage,
        blogDate,
        publisherName,
        blogDescription,
        title,
        keywords,
        metaDescription,
      },
      { new: true }
    );

    if (data.blogImage) {
      data.blogImage = `${Base_URL}/uploads/${data.blogImage}`;
    }

    return res.status(200).json({ message: "Blog updated successfully.", status: 1, data });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 0 });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { status, id } = await req.body;
    const data = await blogModel.findByIdAndUpdate(
      { _id: id },
      { status: status == 1 ? 0 : 1 }
    );
    if (!data) {
      return res.json({
        message: "Unable to change status.",
        status: 0,
      });
    }
    return res
      .status(200)
      .json({ message: "Status changed.", status: 1, data: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 0 });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = await req.body;
    const data = await blogModel.findByIdAndDelete({ _id: id });
    if (!data) {
      return res.json({ message: "Unable to delete data!", status: 0 });
    }
    return res.status(200).json({
      message: "Blog deleted successfully.",
      status: 1,
      data:data,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", status: 0 });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const { blogSlug } = req.body;
    const data = await blogModel.findOne({ blogSlug: blogSlug });

    if (!data) {
      return res.json({
        message: "Unable to get blog data",
        status: 0,
      });
    }
    return res
      .status(200)
      .json({ message: "Get Blog Successfully.", status: 1, data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      status: 0,
      error: error.message,
    });
  }
};

const getLatestBlogs = async (req, res) => {
  try {
    const data = await blogModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(6);
    if (!data) {
      return res.json({
        message: "Unable to get blog data",
        status: 0,
      });
    }


     data?.forEach((blog)=>{
      if(blog.blogImage){
          blog.blogImage = `${Base_URL}/uploads/${blog.blogImage}`
      }
    })

    return res
      .status(200)
      .json({ message: "Get Blog Successfully.", status: 1, data: data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 0 });
  }
};

module.exports = {
  createBlog,
  updateBlog,
  getAllBlogs,
  getBlogByID,
  changeStatus,
  deleteBlog,
  getBlogBySlug,
  getLatestBlogs,
};
