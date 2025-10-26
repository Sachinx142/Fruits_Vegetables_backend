const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        default:null
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "productModel",
        default:null
    },
    qty:{
        type: Number,
        min:1,
        default:null
    },
    total:{
        type: Number,
        default:null,
        min:1
    },
    status:{
        type:Number,
        default:0
    }
})

const cartModel = new mongoose.model("cartModel",CartSchema)

module.exports = cartModel