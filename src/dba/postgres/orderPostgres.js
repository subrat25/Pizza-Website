const pgClient = require("./pgClient");

const createOrder = async (orderData) => {
  try {
    const {
      orderId,
      userId,
      items,
      subtotal,
      tax,
      platformFee,
      deliveryFee,
      totalAmount,
      paymentIntent,
      customerEmail,
      customerName,
      shippingAddress,
    } = orderData;

    const client = pgClient.getClient();
    const result = await client.query(
      "INSERT INTO orders (order_id, user_id, items, subtotal, tax, platform_fee, delivery_fee, total_amount, status, payment_intent, customer_email, customer_name, shipping_address, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()) RETURNING order_id, user_id, items, subtotal, tax, platform_fee, delivery_fee, total_amount, status, payment_intent, customer_email, customer_name, shipping_address",
      [
        orderId,
        userId,
        JSON.stringify(items),
        subtotal,
        tax,
        platformFee,
        deliveryFee,
        totalAmount,
        "pending",
        paymentIntent,
        customerEmail,
        customerName,
        JSON.stringify(shippingAddress),
      ]
    );

    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};

const getOrderById = async (orderId) => {
  try {
    const client = pgClient.getClient();
    const result = await client.query(
      "SELECT order_id, user_id, items, subtotal, tax, platform_fee, delivery_fee, total_amount, status, payment_intent, customer_email, customer_name, shipping_address FROM orders WHERE order_id = $1",
      [orderId]
    );

    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Error fetching order: ${error.message}`);
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const client = pgClient.getClient();
    const result = await client.query(
      "UPDATE orders SET status = $1, updated_at = NOW() WHERE order_id = $2 RETURNING order_id, user_id, items, subtotal, tax, platform_fee, delivery_fee, total_amount, status, payment_intent, customer_email, customer_name, shipping_address",
      [status, orderId]
    );

    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Error updating order status: ${error.message}`);
  }
};

const getUserOrders = async (userId) => {
  try {
    const client = pgClient.getClient();
    const result = await client.query(
      "SELECT order_id, user_id, items, subtotal, tax, platform_fee, delivery_fee, total_amount, status, payment_intent, customer_email, customer_name, shipping_address FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching user orders: ${error.message}`);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getUserOrders,
};
