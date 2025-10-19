const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userName: {
    type: String,
    default: null,
  },
  email: { type: String,default:null },
  phone: { type: String ,default:null},
  fullAddress: { type: String ,default:null},
  paymentMethod: { type: String,default:null},
  amount: { type: Number, default:null},
  razorpay_payment_id: { type: String ,default:null},
  razorpay_order_id: { type: String,default:null },
  razorpay_signature: { type: String ,default:null},
  status: { type: String, default: "Pending"},
},{ timestamps: true });

const Ordermodel = mongoose.model("Ordermodel",orderSchema)
module.exports = Ordermodel