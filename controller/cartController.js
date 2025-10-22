const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const Base_URL = require("../config/baseUrl");

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, qty } = req.body;

    if (!productId || !qty || qty <= 0) {
      return res.json({
        status: 0,
        message: "Product and quantity are required",
        status: 0,
      });
    }

    const product = await productModel.findById(productId);
    if (!product) return res.json({ message: "Product not found", status: 0 });


    let cartItem = await cartModel.findOne({
      user: userId,
      product: productId,
    });

    if (cartItem) {
      cartItem.qty += qty;
      cartItem.total = cartItem.qty * product.finalPrice;
      await cartItem.save();
    } else {
      cartItem = await cartModel.create({
        user: userId,
        product: productId,
        qty,
        total: qty * product.finalPrice,
        status:1
      });
    }
    res
      .status(201)
      .json({ message: "Added to cart", data: cartItem, status: 1 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 0, message: "Server error" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let data = await cartModel
      .find({ user: userId })
      .populate({
        path: "product",
        select:
          "productName finalPrice productImage stock categoryId subcategoryId",
        populate: [
          { path: "categoryId", select: "categoryName" },
          { path: "subcategoryId", select: "subCategoryName" },
        ],
      });

    if (!data || data.length === 0) {
      return res.json({ message: "Cart is empty", status: 0 });
    }

  
    data.map(ele => {
      if (ele.product && ele.product.productImage) {
        ele.product.productImage = `${Base_URL}/uploads/${ele.product.productImage}`;
      }
    });

    return res.status(200).json({
      status: 1,
      message: "Cart fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 0, message: "Server error" });
  }
};


const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, qty } = req.body;

    if (!productId || qty === undefined || qty < 0) {
      return res.json({ status: 0, message: "Invalid data" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ status: 0, message: "Product not found" });
    }

    let cartItem = await cartModel.findOne({ user: userId, product: productId });

    if (cartItem) {
      // Update quantity & total
      cartItem.qty = qty;
      cartItem.total = qty * product.finalPrice;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await cartModel.create({
        user: userId,
        product: productId,
        qty,
        total: qty * product.finalPrice,
        status: 1,
      });
    }

    return res.json({ status: 1, message: "Cart Qty and Price Have been Update Successfully", data: cartItem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 0, message: "Server error" });
  }
};

const deleteCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.json({ status: 0, message: "Product Id is required" });
    }

    let cartItem = await cartModel.findOne({ user: userId, product: productId });

    if (!cartItem) {
      return res.json({ status: 0, message: "Item not found in cart" });
    }

     await cartItem.deleteOne();

    return res.json({ status: 1, message: "Cart Item Delete Successfully", data: cartItem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 0, message: "Server error" });
  }
};







module.exports = {
  addToCart,
  getCart,
  updateCart,
  deleteCart
};
