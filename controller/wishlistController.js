const wishlistModel = require("../models/wishlistModel");
const Base_URL = require("../config/baseUrl");

// Save Wishlist In data
const saveWishlist = async (req, res) => {
  try {
    const { user, product } = req.body;

    //  Exising Duplicates check
    const existing = await wishlistModel.findOne({ user, product });
    if (existing) {
      return res.json({ message: "Product already in wishlist", status: 0 });
    }

    const wishlist = new wishlistModel({ user, product ,status:1});
    await wishlist.save();

    return res
      .status(201)
      .json({ message: "Product added to wishlist", wishlist, status: 1 });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message, status: 0 });
  }
};

// get all Wishlist 
const getAllWishlists = async (req, res) => {
  try {
    const { user } = req.body; 
    if (!user) {
      return res.json({ message: "User ID is required", status: 0 });
    }

    const wishlist = await wishlistModel.find({ user }).populate("product").lean();

    wishlist?.map((ele)=>{
       if(ele.product && ele.product.productImage){
         ele.product.productImage = `${Base_URL}/uploads/${ele.product.productImage}`
       }
       return ele;
    })

    if (!wishlist || wishlist.length === 0) {
      return res.json({ message: "No wishlist Data found", status: 0});
    }

    return res.status(200).json({
      message: "Wishlist Data retrieved successfully",
      status: 1,
      data: wishlist,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      status: 0,
    });
  }
};

// Delete Wishlist
const deleteWishlist = async (req,res) => {
   try {
    const { user, product } = req.body;

      if (!user || !product) {
      return res.json({ message: "User and Product are required",status:0});
    }

    const deleted = await wishlistModel.findOneAndDelete({ user, product });

    if (!deleted) {
      return res.json({
        message: "Item not found in wishlist",
        status:0
      });
    }

    res.status(200).json({
      status: 1,
      message: "Product removed from wishlist",
      deleted
    });
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    res.status(500).json({
      status: 0,
      message: "Server error",
      error: error.message,
    });

}
}

module.exports = {
    saveWishlist,
    getAllWishlists,
    deleteWishlist
}