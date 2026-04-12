const pgClient = require("./pgClient");

const getCartByUserId = async (userId) => {
  try {
    const client = pgClient.getClient();
    let result = await client.query(
      "SELECT id, user_id, items, total_amount FROM cart WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      const insertResult = await client.query(
        "INSERT INTO cart (user_id, items, total_amount, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, user_id, items, total_amount",
        [userId, JSON.stringify([]), 0]
      );
      return insertResult.rows[0];
    }

    return result.rows[0];
  } catch (error) {
    throw new Error(`Error fetching cart: ${error.message}`);
  }
};

const addItemToCart = async (userId, item) => {
  try {
    const client = pgClient.getClient();
    let cart = await client.query(
      "SELECT id, items, total_amount FROM cart WHERE user_id = $1",
      [userId]
    );

    let items = [];
    let totalAmount = 0;

    if (cart.rows.length === 0) {
      items = [item];
      totalAmount = item.price * item.qty;
      await client.query(
        "INSERT INTO cart (user_id, items, total_amount, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())",
        [userId, JSON.stringify(items), totalAmount]
      );
    } else {
      items = cart.rows[0].items || [];
      const existingItem = items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.qty += item.qty;
      } else {
        items.push(item);
      }
      totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);
      await client.query(
        "UPDATE cart SET items = $1, total_amount = $2, updated_at = NOW() WHERE user_id = $3",
        [JSON.stringify(items), totalAmount, userId]
      );
    }

    return { user_id: userId, items, total_amount: totalAmount };
  } catch (error) {
    throw new Error(`Error adding item to cart: ${error.message}`);
  }
};

const removeItemFromCart = async (userId, itemId) => {
  try {
    const client = pgClient.getClient();
    const cart = await client.query(
      "SELECT items, total_amount FROM cart WHERE user_id = $1",
      [userId]
    );

    if (cart.rows.length === 0) {
      throw new Error("Cart not found");
    }

    let items = cart.rows[0].items || [];
    items = items.filter((i) => i.id !== itemId);
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    await client.query(
      "UPDATE cart SET items = $1, total_amount = $2, updated_at = NOW() WHERE user_id = $3",
      [JSON.stringify(items), totalAmount, userId]
    );

    return { user_id: userId, items, total_amount: totalAmount };
  } catch (error) {
    throw new Error(`Error removing item from cart: ${error.message}`);
  }
};

const updateCartItem = async (userId, itemId, qty) => {
  try {
    const client = pgClient.getClient();
    const cart = await client.query(
      "SELECT items FROM cart WHERE user_id = $1",
      [userId]
    );

    if (cart.rows.length === 0) {
      throw new Error("Cart not found");
    }

    let items = cart.rows[0].items || [];
    const item = items.find((i) => i.id === itemId);

    if (!item) {
      throw new Error("Item not found in cart");
    }

    if (qty <= 0) {
      items = items.filter((i) => i.id !== itemId);
    } else {
      item.qty = qty;
    }

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    await client.query(
      "UPDATE cart SET items = $1, total_amount = $2, updated_at = NOW() WHERE user_id = $3",
      [JSON.stringify(items), totalAmount, userId]
    );

    return { user_id: userId, items, total_amount: totalAmount };
  } catch (error) {
    throw new Error(`Error updating cart item: ${error.message}`);
  }
};

const clearCart = async (userId) => {
  try {
    const client = pgClient.getClient();
    const result = await client.query(
      "UPDATE cart SET items = $1, total_amount = $2, updated_at = NOW() WHERE user_id = $3 RETURNING user_id, items, total_amount",
      [JSON.stringify([]), 0, userId]
    );

    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Error clearing cart: ${error.message}`);
  }
};

module.exports = {
  getCartByUserId,
  addItemToCart,
  removeItemFromCart,
  updateCartItem,
  clearCart,
};
