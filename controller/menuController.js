const  menuModel = require("../models/menuModel");

const getMenuData = async (req,res) => {
    try {
        const data = await menuModel.find().sort({ menuName: 1 });
        if (!data) {
            return res.json({ message: "Unable to get data", status: 0 });
        }
        return res.status(200).json({ message: "Get data successfully...", status: 1, data: data });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", status: 0 });
    }
}

module.exports = { getMenuData };