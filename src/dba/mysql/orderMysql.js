const mysqlClient = require("./mysqlClient");

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

    const connection = mysqlClient.getConnection();
    const [result] = await connection.query(
      "INSERT INTO orders (order_id, user_id, items, subtotal, tax, platform_fee, delivery_fee, total_amount, status, payment_intent, customer_email, customer_name, shipping_address, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
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

    return {
      order_id: orderId,
      user_id: userId,
      items,
      subtotal,
      tax,
      platform_fee: platformFee,
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      status: "pending",
      payment_intent: paymentIntent,
      customer_email: customerEmail,
      customer_name: customerName,
      shipping_address: shippingAddress,
    };
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};

const getOrderById = async (orderId) => {
  try {
    const connection = mysqlClient.getConnection();
    const [rows] = await connection.query(
      "SELECT order_id, user_id, items, subtotal, tax, platform_fee, delivery_fee, total_amount, status, payment_intent, customer_email, customer_name, shipping_address FROM orders WHERE order_id = ?",
      [orderId]
    );

    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error fetching order: ${error.message}`);
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const connection = mysqlClient.getConnection();
    await connection.query(
      "UPDATE orders SET status = ?, updated_at = NOW() WHERE order_id = ?",
      [status, orderId]
    );

    const [rows] = await connection.query(
      "SELECT order_id, user_id, items, subtotal, tax, platform_fee, delivery_fee, total_amount, status, payment_intent, customer_email, customer_name, shipping_address FROM orders WHERE order_id = ?",
      [orderId]
    );

    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error updating order status: ${error.message}`);
  }
};

const getUserOrders = async (userId) => {
  try {
    const connection = mysqlClient.getConnection();
    const [rows] = await connection.query(
      "SELECT order_id, user_id, items, subtotal, tax, platform_fee, delivery_fee, total_amount, status, payment_intent, customer_email, customer_name, shipping_address FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    return rows;
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
