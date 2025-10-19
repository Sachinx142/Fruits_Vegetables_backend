const Razorpay = require("razorpay");
const OrderModel = require("../models/orderModel");

const createRazorpayOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
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
      userName,
      email,
      phone,
      fullAddress,
      paymentMode,
      totalAmount,
      orderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (!userName || !email || !phone || !fullAddress || !paymentMode) {
      return res.json({ message: "Please all fields is required",status:0 });
    }

    const newOrder = new OrderModel({
      userName,
      email,
      phone,
      fullAddress,
      paymentMethod: paymentMode,
      amount: totalAmount,
      orderId,
      razorpay_payment_id: razorpay_payment_id || null,
      razorpay_order_id: razorpay_order_id || null,
      razorpay_signature: razorpay_signature || null,
      status: paymentMode === "cod" ? "Pending (COD)" : "Paid",
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order Save Successfully", order: newOrder,status:1 });
  } catch (error) {
    console.error("Save order error:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
};

module.exports = {
    createRazorpayOrder,
    saveOrder
}