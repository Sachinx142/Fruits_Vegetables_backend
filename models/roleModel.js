const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        default: null
    },
    roleType: {
        type: Number,
        default: 2
    }
});

const roleModel =  new mongoose.model("roleModel", roleSchema);
module.exports = roleModel;