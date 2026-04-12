const mysqlClient = require("./mysqlClient");

const getMenu = async () => {
  try {
    const connection = mysqlClient.getConnection();
    const [rows] = await connection.query(
      "SELECT id, name, price, tags, available_qty FROM inventory ORDER BY name"
    );
    return rows;
  } catch (error) {
    throw new Error(`Error fetching menu: ${error.message}`);
  }
};

const getMenuItemById = async (itemId) => {
  try {
    const connection = mysqlClient.getConnection();
    const [rows] = await connection.query(
      "SELECT id, name, price, tags, available_qty FROM inventory WHERE id = ?",
      [itemId]
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error fetching menu item: ${error.message}`);
  }
};

const checkAvailability = async (itemId, requestedQty) => {
  try {
    const connection = mysqlClient.getConnection();
    const [rows] = await connection.query(
      "SELECT available_qty FROM inventory WHERE id = ?",
      [itemId]
    );
    if (rows.length === 0) {
      throw new Error("Item not found");
    }
    return rows[0].available_qty >= requestedQty;
  } catch (error) {
    throw new Error(`Error checking availability: ${error.message}`);
  }
};

const decrementInventory = async (itemId, qty) => {
  try {
    const connection = mysqlClient.getConnection();
    await connection.query(
      "UPDATE inventory SET available_qty = available_qty - ? WHERE id = ? AND available_qty >= ?",
      [qty, itemId, qty]
    );

    const [rows] = await connection.query(
      "SELECT id, name, price, tags, available_qty FROM inventory WHERE id = ?",
      [itemId]
    );

    if (rows.length === 0 || rows[0].available_qty < 0) {
      throw new Error("Insufficient inventory");
    }
    return rows[0];
  } catch (error) {
    throw new Error(`Error updating inventory: ${error.message}`);
  }
};

const incrementInventory = async (itemId, qty) => {
  try {
    const connection = mysqlClient.getConnection();
    await connection.query(
      "UPDATE inventory SET available_qty = available_qty + ? WHERE id = ?",
      [qty, itemId]
    );

    const [rows] = await connection.query(
      "SELECT id, name, price, tags, available_qty FROM inventory WHERE id = ?",
      [itemId]
    );
    return rows[0];
  } catch (error) {
    throw new Error(`Error updating inventory: ${error.message}`);
  }
};

module.exports = {
  getMenu,
  getMenuItemById,
  checkAvailability,
  decrementInventory,
  incrementInventory,
};
