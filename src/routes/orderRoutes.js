const express = require("express");
const router = express.Router();

const orderController = require("../controller/orderController");

router.post("/create-order", orderController.createOrder);
router.post("/order-complete", orderController.completeOrder);
router.get("/order-status/:id", orderController.getOrderStatus);
router.get("/orders/:userId", orderController.getUserOrders);

module.exports = router;