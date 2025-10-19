const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { addToCart, getCart, updateCart, deleteCart } = require("../controller/cartController");

router.post("/addCart", authMiddleware, addToCart);
router.post("/updateCart", authMiddleware, updateCart);
router.get("/getCart", authMiddleware, getCart);
router.post("/deleteCart", authMiddleware, deleteCart);

module.exports = router;
