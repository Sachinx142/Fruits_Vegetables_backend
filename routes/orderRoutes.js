const express = require("express");
const router =  express.Router();
const {createRazorpayOrder,saveOrder,getallOrdersByAdmin, getOrdersByUserId, getOrderByID, updateOrderDetails} = require("../controller/orderController")

router.post("/createRazorpayOrder",createRazorpayOrder)
router.post("/saveOrder",saveOrder)
router.post("/getOrdersByUserId",getOrdersByUserId)
router.post("/getOrderByID",getOrderByID)
router.post("/updateOrderDetails",updateOrderDetails)
router.get("/getallOrdersByAdmin",getallOrdersByAdmin)

module.exports = router