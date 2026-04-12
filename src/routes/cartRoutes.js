const express = require("express");
const router = express.Router();

const cartController = require("../controller/cartController");

router.post("/add", cartController.addToCart);
router.post("/remove", cartController.removeFromCart);
router.post("/update", cartController.updateCart);
router.get("/:userId", cartController.getCart);
router.post("/clear", cartController.clearCart);

module.exports = router;
