const express = require("express");
const router =  express.Router();
const {createRazorpayOrder,saveOrder,getOrders} = require("../controller/paymentController")

router.post("/createRazorpayOrder",createRazorpayOrder)
router.post("/saveOrder",saveOrder)
router.get("/getOrders",getOrders)

module.exports = router