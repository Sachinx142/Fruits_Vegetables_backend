const Razorpay = require("razorpay");
const OrderModel = require("../models/orderModel");
const  mongoose = require("mongoose");
const Base_URL = require("../config/baseUrl")

const createRazorpayOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const {userId,products, orderId,amount } = req.body;

    const options = {
      amount: amount * 100,
      userId:userId,
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

    // Basic validation
    if (!userName || !email || !phone || !fullAddress || !paymentMode || !totalAmount) {
      return res.json({ message: "All fields are required", status: 0 });
    }

    // Function to generate 16-character order ID
    function generateCustomOrderId({ userName, email, phone, fullAddress }) {
      const prefix = "ORD";
      const year = new Date().getFullYear();

      // First 2 letters of username
      const unamePart = (userName || "XX").substring(0, 2).toUpperCase();

      // First 2 letters of email username (before @)
      let emailPart = "XX";
      if (email && email.includes("@")) {
        emailPart = email.split("@")[0].substring(0, 2).toUpperCase();
      }

      // Last 4 digits of phone
      const phonePart = (phone || "0000").slice(-4);

      // First 2 letters of fullAddress
      const addressPart = (fullAddress || "XX").substring(0, 2).toUpperCase();

      // Combine parts
      let orderId = `${prefix}${year}${unamePart}${emailPart}${phonePart}${addressPart}`;

      // Pad with random letters/numbers if less than 16 chars
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      while (orderId.length < 16) {
        orderId += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      return orderId; // exactly 16 characters
    }

    // Create new order
    const newOrder = new OrderModel({
      userId:userId,
      orderId: generateCustomOrderId({ userName, email, phone, fullAddress }),
      userName,
      products,
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

    res.status(201).json({ message: "Order saved successfully", order: newOrder, status: 1 });
  } catch (error) {
    console.error("Save order error:", error);
    res.status(500).json({ error: "Failed to save order", status: 0 });
  }
};

// Admin see all orders
const getallOrdersByAdmin = async (req, res) => {
  try {
    const data = await OrderModel.find({status:1}).sort({ createdAt: -1 });
    if(!data){
      return res.status(404).json({ message: "No orders found", status: 0 });
    }
    return res.status(200).json({ message: "Orders fetched successfully", status: 1, data: data });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Failed to fetch orders", status: 0 });
  }
};

// Get all orders by user ID (optional)
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.body;
    const data = await OrderModel.find({userId:userId}).sort({ createdAt: -1 }).populate('products.productId', 'productName productImage finalPrice');

    data?.map(order=>{
       order.products.map(item => {
        if(item.productId && item.productId.productImage){
          item.productId.productImage = `${Base_URL}/uploads/${item.productId.productImage}`;
        }
        return item;
       })
    })

    
    if (!data) {
      return res.status(404).json({ message: "No orders found for this user", status: 0 });
    }
    return res.status(200).json({ message: "User orders fetched successfully", status: 1, data: data });
  } catch (error) {
    console.error("Get user orders error:", error);
    return res.status(500).json({ message: "Failed to fetch user orders", status: 0 });
  }
}
module.exports = {
    createRazorpayOrder,
    saveOrder,
    getallOrdersByAdmin,
    getOrdersByUserId,
}