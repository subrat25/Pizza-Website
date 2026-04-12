const Stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const MakePayment = async ({ amount, currency, orderId, customer, description }) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || "INR",
      metadata: {
        orderId: orderId || "N/A",
        customer: customer?.email || "guest",
      },
      description: description || "Payment",
    });

    return paymentIntent;
  } catch (error) {
    console.error("Stripe Error:", error.message);
    throw error;
  }
};

module.exports = {
  MakePayment,
};