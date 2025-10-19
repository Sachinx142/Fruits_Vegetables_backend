const express = require("express");
const router = express.Router();
const {createRoles,getAllRoles} = require("../controller/roleController");

router.post("/createRoles", createRoles);
router.get("/getAllRoles", getAllRoles);

module.exports = router;