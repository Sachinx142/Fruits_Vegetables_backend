const Razorpay = require("razorpay");
const OrderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const Base_URL = require("../config/baseUrl");
const {
  generateCustomOrderId,
  generateProductItemId,
} = require("../utils/generateId");
const mongoose = require("mongoose");

const createRazorpayOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { userId, products, orderId, amount } = req.body;

    const options = {
      amount: amount * 100,
      userId: userId,
      products,
      currency: "INR",
      receipt: orderId || `order_rcptid_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Razorpay order creation failed" });
  }
};

const saveOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      products,
      email,
      phone,
      fullAddress,
      paymentMode,
      totalAmount,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (
      !userName ||
      !email ||
      !phone ||
      !fullAddress ||
      !paymentMode ||
      !totalAmount
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", status: 0 });
    }

    // Assign unique productItemId to each product
    const productsWithIds = products.map((p) => ({
      ...p,
      productItemId: generateProductItemId(),
    }));

    // Create new order
    const newOrder = new OrderModel({
      userId,
      orderId: generateCustomOrderId({ userName, email, phone, fullAddress }),
      userName,
      products: productsWithIds,
      email,
      phone,
      fullAddress,
      paymentMethod: paymentMode,
      amount: totalAmount,
      paymentStatus: paymentMode === "cod" ? "Pending" : "Paid",
      orderStatus: "Pending",
      orderDate: new Date(),
      razorpay_payment_id: razorpay_payment_id || null,
      razorpay_order_id: razorpay_order_id || null,
      razorpay_signature: razorpay_signature || null,
      status: 1,
    });

    await newOrder.save();

    // Remove only ordered products from cart
    const orderedProductIds = products.map((p) => p.productId);
    await cartModel.deleteMany({
      user: userId,
      product: { $in: orderedProductIds },
      status: 1,
    });

    res.status(201).json({
      message: "Order saved successfully",
      order: newOrder,
      status: 1,
    });
  } catch (error) {
    console.error("Save order error:", error);
    res.status(500).json({ error: "Failed to save order", status: 0 });
  }
};
// Admin see all orders
const getallOrdersByAdmin = async (req, res) => {
  try {
    const data = await OrderModel.find({ status: 1 }).sort({ createdAt: -1 });
    if (!data) {
      return res.status(404).json({ message: "No orders found", status: 0 });
    }
    return res
      .status(200)
      .json({ message: "Orders fetched successfully", status: 1, data: data });
  } catch (error) {
    console.error("Get orders error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch orders", status: 0 });
  }
};
// Get all orders by user ID (optional)
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.body;
    const data = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("products.productId", "productName productImage finalPrice");

    data?.map((order) => {
      order.products.map((item) => {
        if (item.productId && item.productId.productImage) {
          item.productId.productImage = `${Base_URL}/uploads/${item.productId.productImage}`;
        }
        return item;
      });
    });

    if (!data) {
      return res
        .status(404)
        .json({ message: "No orders found for this user", status: 0 });
    }
    return res.status(200).json({
      message: "User orders fetched successfully",
      status: 1,
      data: data,
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch user orders", status: 0 });
  }
};
//get Order Details by id
const getOrderByID = async (req, res) => {
  try {
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      return res.json({ message: "User Id is required", status: 0 });
    }

    const data = await OrderModel.findById(id).populate({
      path: "products.productId",
      select: "productName finalPrice productImage",
    });

    if (data?.products?.length > 0) {
      data.products = data.products?.map((item) => {
        if (item.productId && item.productId.productImage) {
          item.productId.productImage = `${Base_URL}/uploads/${item.productId.productImage}`;
        }
        return item;
      });
    }

    if (!data) {
      return res.json({ message: "Unable to get Data", status: 0 });
    }

    return res.json({
      message: "Order Data get Successfully",
      data: data,
      status: 1,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error:!", status: 0 });
  }
};
//Update Order By Admin Panel
const updateOrderDetails = async (req, res) => {
  try {
    const { id, orderDate, paymentStatus, orderStatus, fullAddress } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ message: "Order Id is required", status: 0 });
    }

    const order = await OrderModel.findById(id);

    if (!order) {
      return res.json({ message: "Order not found", status: 0 });
    }

    let finalPaymentStatus = paymentStatus;

    if (order.paymentMethod === "cod") {
      if (orderStatus === "Delivered") {
        finalPaymentStatus = "Paid";
      } else {
        finalPaymentStatus = "Pending";
      }
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      {
        orderDate,
        paymentStatus: finalPaymentStatus,
        orderStatus,
        fullAddress,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Order Details Updated Successfully",
      status: 1,
      data: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 0 });
  }
};

module.exports = {
  createRazorpayOrder,
  saveOrder,
  getallOrdersByAdmin,
  getOrdersByUserId,
  getOrderByID,
  updateOrderDetails,
};
