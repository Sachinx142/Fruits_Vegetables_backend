const express = require("express");
const router =  express.Router();
const {createRazorpayOrder,saveOrder} = require("../controller/paymentController")

router.post("/createRazorpayOrder",createRazorpayOrder)
router.post("/saveOrder",saveOrder)

module.exports = router