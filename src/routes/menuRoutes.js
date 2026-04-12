const express = require("express");
const router = express.Router();

const menuController = require("../controller/menuController");

router.get("/menu", menuController.getMenu);

module.exports = router;