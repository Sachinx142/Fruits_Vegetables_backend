
const  bcrypt  = require("bcryptjs");
const adminModel = require("../../models/adminModel");

 const getAllStaff = async (req,res) => {
    connectDB();
    try {
        const data = await adminModel.find({roleType:2}).select("-password");
        if (!data) {
            return res.json({ message: "Unable to get data", status: 0 });
        }

        return res.status(200).json({ message: "Get data successfully", status: 1, data: data });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", status: 0 });
    }
};
const getStaffByid = async (req,res) => {
    try {
        const { id } = req.body;
        const data = await adminModel.findById({ _id: id }).select("-password");
        if (!data) {
            return res.json({ message: "Unable to get data", status: 0 });
        }

        return res.status(200).json({ message: "Get data successfully", status: 1, data: data });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", status: 0 });
    }
};
const createStaff = async (req,res) => {
    try {
        const { name, email, password, roleId } = req.body;
        if (!name || !email || !password ) {
            return res.json({ message: "Please fill all the fields", status: 0 })
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({ message: "Invalid Email!", status: 0 })
        }
        const isEmailExist = await adminModel.findOne({ email: email });
        if (isEmailExist) {
            return res.json({ message: "Staff already exist.", status: 0 })
        }

        const hassedPassword = await bcrypt.hash(password, 10);
        const newUser = new adminModel({ name, email, password: hassedPassword, roleId });
        await newUser.save();
        return res.status(201).json({ message: "Staff created successfully.", status: 1 })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", status: 0 });
    }
};
const  updateStaff = async (req,res) => {
    try {
        let { name, email,password, id, roleId } = req.body;
        if (!name || !email || !roleId) {
            return res.json({ message: "Please fill all the fields", status: 0 })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({ message: "Invalid Email!", status: 0 })
        }
        const isEmailExist = await adminModel.findOne({ email: email, _id: { $ne: id } });
        if (isEmailExist) {
            return res.json({ message: "Staff already exist.", status: 0 })
        }

        if (!password) {
            const currentData = await adminModel.findOne({ _id: id });
            password = currentData?.password;
        } else {
            password = await bcrypt.hash(password, 10);
        }
        const data = await adminModel.findByIdAndUpdate({ _id: id }, { name, email, password, roleId });
        if (!data) {
            return res.json({ message: "Unable to update Staff.", status: 0 })
        }
        return res.status(200).json({ message: "Staff Updated successfully.", status: 1 })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", status: 0 });
    }
};
 const deleteStaff = async (req,res) => {
    try {
        const { id } = req.body;
        const data = await adminModel.findByIdAndDelete({ _id: id });
        if (!data) {
            return res.json({ message: "Unable to delete staff!", status: 0 });
        }
        return res.status(200).json({ message: 'Staff deleted successfully.', status: 1 });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!", status: 0 });
    }
};
const changeStatus = async (req,res) => {
    try {
        const { id, status } = req.body;
       
        const data = await adminModel.findByIdAndUpdate({ _id: id }, { status: status == 1 ? 0 : 1 });
        if (!data) {
            return res.json({ message: "Unable to changes status!", status: 0 });
        }
        return res.status(200).json({ message: "Status changed.", status: 1 });
    } catch (err) {
        console.log(err);
        return res.json({ message: "Internal server error!", status: 0 });
    }
};

module.exports = { createStaff,updateStaff,deleteStaff,changeStatus,getAllStaff,getStaffByid};

