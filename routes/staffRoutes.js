const express = require("express");
const router = express.Router();
const { createStaff,updateStaff,deleteStaff,changeStatus,getAllStaff,getStaffByid} = require("../controller/admin/staffController");

router.post("/createStaff", createStaff);
router.post("/updateStaff", updateStaff);
router.post("/deleteStaff", deleteStaff);
router.post("/changeStatus", changeStatus);
router.get("/getAllStaff", getAllStaff);
router.post("/getStaffByid", getStaffByid);

module.exports = router;