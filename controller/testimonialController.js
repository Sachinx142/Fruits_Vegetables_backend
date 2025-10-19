const testimonialModel = require("../models/testimonialModel");
const Base_URL = require("../config/baseUrl");


// For Admin Section Get Testimonials
const getAllTestimonials = async (req,res) => {
    try {
        const data = await testimonialModel.find();
        if (!data) {
            return res.json({ message: "Unable to get testimonial data.", status: 0 });
        }
        return res.status(200).json({ message: "Testimonial get data successfully.", status: 1, data: data });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", status: 0 });
    }
};
const getTestimonialsByID = async (req,res) => {
  try {
    const {id} = req.body;
    const data = await testimonialModel.findOne({_id:id})

        if (data.userImage && data.userImage) {
      data.userImage = `${Base_URL}/uploads/${data.userImage}`;
    }


    if (!data) {
      return res.json({
        message: "Unable to get Testimonial data",
        status: 0,
      });
    }
    return res.status(200).json({ message: "Get Testimonial Successfully.", status: 1 ,data:data});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", status: 0 });
  }
};
// For Home Page Section Get Testimonials
const getActiveTestimonials = async (req,res) => {

    try {
        const data = await testimonialModel.find({ status: 1 });
        if (!data) {
            return res.json({ message: "Unable to get testimonial data.", status: 0 });
        }
        return res.status(200).json({ message: "Testimonial get data successfully.", status: 1, data: data });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", status: 0 });
    }
};
const createTestimonial = async (req, res) => {
  try {
    const {
      fullName,
      profession,
      message,
      rating,
      date,
      title,
      keywords,
      metaDescription,
    } = req.body;

    if (!fullName || !profession || !message || !rating  || !date) {
      return res.json({
        message: "Please fill all required fields.",
        status: 0,
      });
    }

    const userImage = req.files?.userImage?.[0]?.filename;

    
    const data = new testimonialModel({
      fullName,
      profession,
      message,
      rating,
      date,
      userImage,
      title,
      keywords,
      metaDescription,
      status: 1,
    });

    

    await data.save();

    return res.status(200).json({
      message: "Testimonial created successfully.",
      status: 1,
      data: data,
    });
  } catch (error) {
     console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      status: 0,
    });
  }
};
const updateTestimonial = async (req,res) => {
  try {
    const {
      id,
      fullName,
      profession,
      message,
      rating,
      date,
      title,
      keywords,
      metaDescription,
    } = req.body;
    
    if (!fullName || !profession || !message || !rating  || !date) {
      return res.json({
        message: "Please fill all required fields.",
        status: 0,
      });
    }

    
    const currentData = await testimonialModel.findById(id);
    if (!currentData) {
      return res.json({ message: "Testimonial not found", status: 0 });
    }

    const userImage = req.files?.userImage?.[0]?.filename;


    const data = await testimonialModel.findByIdAndUpdate(
      { _id: id },
      {
        fullName,
        profession,
        message,
        rating,
        date,
        userImage,
        title,
        keywords,
        metaDescription,
      },
      {new:true}
    );

    if (!data) {
      return res.json({
        message: "Unable to update data!",
        status: 0,
      });
    }

        if (data.userImage) {
          data.userImage = `${Base_URL}/uploads/${data.userImage}`;
        }


    return res.status(200).json({
      message: "Testimonial updated successfully.",
      status: 1,
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      status: 0,
    });
  }
};
const deleteTestimonial = async (req,res) => {
    try {
        const { id } = req.body;

        const data = await testimonialModel.findByIdAndDelete({ _id: id });
        if (!data) {
            return res.json({ message: "Unable to delete testimonial data.", status: 0 });
        }
        return res.json({ message: "Testimonial deleted successfully.", status: 1 ,data:data});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", status: 0 });
    }
};
const changeStatus = async (req,res) => {

    try {
        const { id, status } = req.body;
       
        const data = await testimonialModel.findByIdAndUpdate({ _id: id }, { status: status == 0 ? 1 : 0 });
        if (!data) {
            return res.json({ message: "Unable to change status", status: 0 });
        }
        return res.status(200).json({ message: "Status changed.", status: 1 });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", status: 0 });
    }
};
const getLatestTestimonials = async (req, res) => {
  try {
    const data = await testimonialModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(6);
    if (!data) {
      return res.json({
        message: "Unable to get blog data",
        status: 0,
      });
    }


     data?.forEach((testimonial)=>{
      if(testimonial.userImage){
          testimonial.userImage = `${Base_URL}/uploads/${testimonial.userImage}`
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
  getAllTestimonials,
  getTestimonialsByID,
  getActiveTestimonials,
  getLatestTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  changeStatus,
};
