const paymentMapper = require("../services/service/payments/paymentFactory");

const createPaymentIntent = async (req, res) => {
  try {
    const { orderId, amount, customer } = req.body;

    if (!orderId || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid order data or amount" });
    }

    const paymentIntent = await paymentMapper.createPaymentIntent({
      amount,
      orderId,
      customer,
    });

    // Order creation is now handled separately via /api/create-order endpoint
    // The payment intent here is just for processing the payment

    res.json({ clientSecret: paymentIntent.client_secret, orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Payment intent creation failed",
      details: err.message,
    });
  }
};

const getPublishableKey = (req, res) => {
  return res.json({
    publishableKey:
      process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_000000000000000000000000",
  });
};

module.exports = {
  createPaymentIntent,
  getPublishableKey,
};