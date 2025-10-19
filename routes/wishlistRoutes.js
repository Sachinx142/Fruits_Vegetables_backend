const express = require("express");
const router = express.Router();
const {saveWishlist,getAllWishlists,deleteWishlist} = require("../controller/wishlistController")

router.post("/saveWishlist",saveWishlist)
router.post("/getAllWishlists",getAllWishlists)
router.post("/deleteWishlist",deleteWishlist)

module.exports = router