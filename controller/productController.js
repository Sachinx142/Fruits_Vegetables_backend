const mongoose = require("mongoose");
const productModel = require("../models/productModel");
const slugformatter = require("../helper/slugformatter");
const Base_URL = require("../config/baseUrl")



// get All Products
const getAllProducts = async (req,res) => {
      try {
            const data = await productModel.find();
            if(!data || data.length === 0){
                  return res.json({message:'Unable to get Product Data'})
            };
        
            return res.status(200).json({message:'all Products Data get Succesfully',data:data,status:1})

      } catch (error) {
         console.log(error) 
      }
}

// Get All Active Products
const getAllActiveProducts = async (req,res) => {
    try {
       const data = await productModel.find({status:1}).sort({id:-1}).limit(8)

       data?.map((ele) => {
         if (ele.productImage) {
           ele.productImage = `${Base_URL}/uploads/${ele.productImage}`;
         }
       });

        if(!data || data.length === 0){
          return res.json({message:'Unable to get Product Data',status:0})
        }
        return res.status(200).json({message:'all Active Products Data get Succesfully',data:data,status:1})
    } catch (error) {
       console.log(error);
        return res.json({message:'Internal server error',status:0})
    }
}

//get Product by ID
const getProductById = async (req, res) => {
    try {
       const {id} = req.body;

       if(!id) {
         return res.json({message:"Id is required",status:0})
       }

       const data = await productModel.findOne({_id:id});

       if(!data){
          return res.json({message:"Unable to get Product data",status:0})
       }


           if (data.productImage) {
      data.productImage = `${Base_URL}/uploads/${data.productImage}`;
    }


        return res.status(200).json({message:"Get Product Successfully",status:1,data:data})

    } catch (error) {
        console.log(error);
    }
}

// ✅ Create Product
const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productSlug,
      categoryId,
      subcategoryId,
      subcategory,
      actualPrice,
      discountedPrice,
      stock,
      description,
      seoTitle,
      metaKeywords,
      metaDescription,
    } = req.body;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.json({ message: "Invalid category ID.", status: 0 });
    }

    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
      return res.json({ message: "Invalid Subcategory ID.", status: 0 });
    }


    const productImage = req?.files?.productImage?.[0]?.filename;

    if (
      !productName ||
      !productSlug ||
      !categoryId ||
      !subcategoryId ||
      !actualPrice ||
      stock == null
    ) {
      return res
        .json({ message: "Missing required fields.", status: 0 });
    }

    const formattedSlug = slugformatter(productSlug);

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .json({ message: "Invalid category ID.", status: 0 });
    }

    const finalPrice = actualPrice - (discountedPrice || 0);


    const newProduct = await productModel.create({
      productName,
      productSlug: formattedSlug,
      categoryId,
      subcategoryId,
      subcategory,
      actualPrice,
      discountedPrice,
      finalPrice,
      stock,
      productImage,
      description,
      seoTitle,
      metaKeywords,
      metaDescription,
    });

    return res.status(201).json({
      message: "Product created successfully.",
      status: 1,
      data: newProduct,
    });
  } catch (error) {
    console.error("Product Create Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 0 });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const {
      id,
      productName,
      productSlug,
      categoryId,
      subcategoryId,
      actualPrice,
      discountedPrice,
      stock,
      description,
      seoTitle,
      metaKeywords,
      metaDescription,
    } = req.body;

    if (!id) {
      return res.json({ message: "Id is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.json({ message: "Invalid category ID.", status: 0 });
    }

    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
      return res.json({ message: "Invalid Subcategory ID.", status: 0 });
    }

    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.json({ message: "Product not found." }, { status: 0 });
    }

    const productImage = req?.files?.productImage?.[0]?.filename;



    if (
      !productName ||
      !productSlug ||
      !categoryId ||
      !subcategoryId ||
      !actualPrice ||
      stock == null
    ) {
      return res.json({
        message: "Missing required fields.",
        status: 0,
      });
    }

    const formattedSlug = slugformatter(productSlug);

    // const slugConflict = await productModel.findOne({
    //   productSlug: formattedSlug,
    //   _id: { $ne: id },
    // });

    // if (slugConflict) {
    //   return res.json(
    //     { message: "Product slug already exists." },
    //     { status: 0 }
    //   );
    // }

    const finalPrice = actualPrice - (discountedPrice || 0);

    const updateProduct = await productModel.findByIdAndUpdate(
      {_id: id },
      {
        productName,
        productSlug: formattedSlug,
        categoryId,
        subcategoryId,
        actualPrice,
        discountedPrice,
        finalPrice,
        stock,
        productImage,
        description,
        seoTitle,
        metaKeywords,
        metaDescription,
      },
      { new: true }
    );

    return res.status(201).json({
      message: "Product created successfully.",
      status: 1,
      data: updateProduct,
    });
  } catch (error) {
    console.error("Product Create Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 0 });
  }
};

// Change Status 
const changeStatus = async (req, res) => {
  try {
    const { status, id } = req.body;

    const data = await productModel.findByIdAndUpdate(
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

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.json({ message: "Category Id is required", status: 0 });
    }

    const data = await productModel.findByIdAndDelete(id);

    if (!data) {
      res.json({ message: "Unable to delete product", status: 0 });
    }

    return res.status(200).json({
      message: "Product Deleted Successfully",
      status: 1,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", status: 0 });
  }
};

const getProductBySlug = async (req,res) => {
     try {
        const {productSlug} = req.body;

        const data = await productModel.findOne({productSlug}).populate("categoryId","categoryName").populate("subcategoryId","subCategoryName")

        if(data && data.productImage){
          data.productImage = `${Base_URL}/uploads/${data.productImage}`;
        }


        if(!data){
           return  res.json({message:"Unable to get Product Data",status:0})
        }

        return res.status(200).json({message:"Product Data get Succesfully",status:1,data:data})

     } catch (error) {
       console.log(error)
     }
}



module.exports = {getAllProducts,getProductById, createProduct,updateProduct,deleteProduct,changeStatus ,getAllActiveProducts,getProductBySlug};
