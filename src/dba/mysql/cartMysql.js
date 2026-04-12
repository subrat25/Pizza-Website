const mysqlClient = require("./mysqlClient");

const getCartByUserId = async (userId) => {
  try {
    const connection = mysqlClient.getConnection();
    const [rows] = await connection.query(
      "SELECT id, user_id, items, total_amount FROM cart WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      const [insertResult] = await connection.query(
        "INSERT INTO cart (user_id, items, total_amount, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
        [userId, JSON.stringify([]), 0]
      );
      return { id: insertResult.insertId, user_id: userId, items: [], total_amount: 0 };
    }

    return rows[0];
  } catch (error) {
    throw new Error(`Error fetching cart: ${error.message}`);
  }
};

const addItemToCart = async (userId, item) => {
  try {
    const connection = mysqlClient.getConnection();
    const [rows] = await connection.query(
      "SELECT id, items, total_amount FROM cart WHERE user_id = ?",
      [userId]
    );

    let items = [];
    let totalAmount = 0;

    if (rows.length === 0) {
      items = [item];
      totalAmount = item.price * item.qty;
      await connection.query(
        "INSERT INTO cart (user_id, items, total_amount, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
        [userId, JSON.stringify(items), totalAmount]
      );
    } else {
      items = rows[0].items || [];
      const existingItem = items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.qty += item.qty;
      } else {
        items.push(item);
      }
      totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);
      await connection.query(
        "UPDATE cart SET items = ?, total_amount = ?, updated_at = NOW() WHERE user_id = ?",
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
    const connection = mysqlClient.getConnection();
    const [rows] = await connection.query(
      "SELECT items, total_amount FROM cart WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      throw new Error("Cart not found");
    }

    let items = rows[0].items || [];
    items = items.filter((i) => i.id !== itemId);
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    await connection.query(
      "UPDATE cart SET items = ?, total_amount = ?, updated_at = NOW() WHERE user_id = ?",
      [JSON.stringify(items), totalAmount, userId]
    );

    return { user_id: userId, items, total_amount: totalAmount };
  } catch (error) {
    throw new Error(`Error removing item from cart: ${error.message}`);
  }
};

const updateCartItem = async (userId, itemId, qty) => {
  try {
    const connection = mysqlClient.getConnection();
    const [rows] = await connection.query(
      "SELECT items FROM cart WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      throw new Error("Cart not found");
    }

    let items = rows[0].items || [];
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

    await connection.query(
      "UPDATE cart SET items = ?, total_amount = ?, updated_at = NOW() WHERE user_id = ?",
      [JSON.stringify(items), totalAmount, userId]
    );

    return { user_id: userId, items, total_amount: totalAmount };
  } catch (error) {
    throw new Error(`Error updating cart item: ${error.message}`);
  }
};

const clearCart = async (userId) => {
  try {
    const connection = mysqlClient.getConnection();
    await connection.query(
      "UPDATE cart SET items = ?, total_amount = ?, updated_at = NOW() WHERE user_id = ?",
      [JSON.stringify([]), 0, userId]
    );

    const [rows] = await connection.query(
      "SELECT user_id, items, total_amount FROM cart WHERE user_id = ?",
      [userId]
    );

    return rows[0] || null;
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
