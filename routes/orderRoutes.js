const express = require("express");
const router =  express.Router();
const {createRazorpayOrder,saveOrder,getallOrdersByAdmin, getOrdersByUserId} = require("../controller/orderController")

router.post("/createRazorpayOrder",createRazorpayOrder)
router.post("/saveOrder",saveOrder)
router.post("/getOrdersByUserId",getOrdersByUserId)
router.get("/getallOrdersByAdmin",getallOrdersByAdmin)

module.exports = router