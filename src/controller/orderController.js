const orderService = require("../services/service/orderService");

const createOrder = async (req, res) => {
  try {
    const { orderId, userId } = req.body;

    if (!orderId || !userId) {
      return res.status(400).json({
        error: "orderId and userId are required",
      });
    }

    const order = await orderService.createOrderFromCart(userId, orderId, null, {});
    return res.json(order);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        error: "orderId is required",
      });
    }

    const updated = await orderService.completeOrder(orderId);

    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json({ success: true, order: updated });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!orderId) {
      return res.status(400).json({
        error: "orderId is required",
      });
    }

    const order = await orderService.getOrderStatus(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json(order);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const orders = await orderService.getUserOrders(userId);
    return res.json(orders);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
  completeOrder,
  getOrderStatus,
  getUserOrders,
};