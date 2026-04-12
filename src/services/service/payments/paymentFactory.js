const StripeService = require("./stripeService");
const PayPalService = require("./paypalService");

// Default to Stripe if PAYMENT_PARTNER is not PayPal
const paymentPartner =
  process.env.PAYMENT_PARTNER === "PayPal" ? PayPalService : StripeService;

const createPaymentIntent = async ({ amount, orderId, customer }) => {
  const paymentData = await paymentPartner.MakePayment({
    amount,
    currency: "INR",
    orderId,
    customer,
    description: "Pizza order payment",
  });

  return paymentData;
};

module.exports = {
  createPaymentIntent,
};