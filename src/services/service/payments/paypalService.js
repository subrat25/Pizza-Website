const paypal = require("@paypal/checkout-server-sdk");

const environment =
  process.env.PAYPAL_ENV === "live"
    ? new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      )
    : new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );

const client = new paypal.core.PayPalHttpClient(environment);

/**
 * MakePayment -> Similar to Stripe PaymentIntent Creation
 * Returns an order object which contains approval URL for frontend redirection.
 */
const MakePayment = async ({
  amount,
  currency,
  orderId,
  customer,
  description,
}) => {
  try {
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderId || "N/A",
          description: description || "Payment",
          amount: {
            currency_code: (currency || "USD").toUpperCase(),
            value: (amount / 100).toFixed(2), // Stripe uses cents, PayPal expects dollars
          },
        },
      ],
      payer: {
        email_address: customer?.email || undefined,
      },
      application_context: {
        brand_name: "Pizza Store",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: process.env.PAYPAL_RETURN_URL || "http://localhost:3000/success",
        cancel_url: process.env.PAYPAL_CANCEL_URL || "http://localhost:3000/cancel",
      },
    });

    const response = await client.execute(request);

    const approvalUrl =
      response.result.links.find((link) => link.rel === "approve")?.href || null;

    return {
      id: response.result.id,
      status: response.result.status,
      approvalUrl,
      raw: response.result,
    };
  } catch (error) {
    console.error("PayPal Error:", error.message);
    throw error;
  }
};

module.exports = {
  MakePayment,
};