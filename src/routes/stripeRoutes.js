const express = require("express");
const router = express.Router();

const paymentController = require("../controller/paymentController");

router.post("/create-payment-intent", paymentController.createPaymentIntent);
router.get("/stripe-publishable-key", paymentController.getPublishableKey);

module.exports = router;