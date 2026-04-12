const cartService = require("../services/service/cartService");

const addToCart = async (req, res) => {
  try {
    const { userId, itemId, qty } = req.body;

    if (!userId || !itemId || !qty) {
      return res.status(400).json({
        error: "userId, itemId, and qty are required",
      });
    }

    const cart = await cartService.addToCart(userId, itemId, qty);
    return res.json(cart);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res.status(400).json({
        error: "userId and itemId are required",
      });
    }

    const cart = await cartService.removeFromCart(userId, itemId);
    return res.json(cart);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { userId, itemId, qty } = req.body;

    if (!userId || !itemId || qty === undefined) {
      return res.status(400).json({
        error: "userId, itemId, and qty are required",
      });
    }

    const cart = await cartService.updateCart(userId, itemId, qty);
    return res.json(cart);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    const cart = await cartService.getCart(userId);
    return res.json(cart);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    const cart = await cartService.clearCart(userId);
    return res.json(cart);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  updateCart,
  getCart,
  clearCart,
};
