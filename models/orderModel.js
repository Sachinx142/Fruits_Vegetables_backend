const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      default:null
    },
    orderId: { type: String, default: null },
    userName: {
      type: String,
      default: null,
    },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    fullAddress: { type: String, default: null },
    paymentMethod: { type: String, default: null },
    amount: { type: Number, default: null },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "productModel",
        },
        quantity: { type: Number, default: 1 },
      },
    ],

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    // 🚚 ORDER STATUS (controlled by admin)
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    razorpay_payment_id: { type: String, default: null },
    razorpay_order_id: { type: String, default: null },
    razorpay_signature: { type: String, default: null },
    orderDate: { type: Date, default: Date.now },
    status: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Ordermodel = mongoose.model("Ordermodel", orderSchema);
module.exports = Ordermodel;
