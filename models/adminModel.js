const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
       name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    //for next auth
    role: {
        type: String,
        default: "Admin"
    },
    //For not going on frontend
    roleType: {
        type: Number,
        default: 2
    },
    //for getting permission data
    roleId:{
        type:String,
        default:null
    },
    status: {
        type: Number,
        default: 1
    }
});

const adminModel = mongoose.model("adminModel", adminSchema);
module.exports = adminModel;