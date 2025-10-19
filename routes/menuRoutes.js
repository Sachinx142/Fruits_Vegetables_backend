const express = require("express");
const router = express.Router();
const {getMenuData} = require("../controller/menuController");

router.get('/getMenuData',getMenuData)

module.exports = router;