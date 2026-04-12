const pgClient = require("./pgClient");

const getMenu = async () => {
  try {
    const client = pgClient.getClient();
    const result = await client.query(
      "SELECT id, name, price, tags, available_qty FROM inventory ORDER BY name"
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching menu: ${error.message}`);
  }
};

const getMenuItemById = async (itemId) => {
  try {
    const client = pgClient.getClient();
    const result = await client.query(
      "SELECT id, name, price, tags, available_qty FROM inventory WHERE id = $1",
      [itemId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Error fetching menu item: ${error.message}`);
  }
};

const checkAvailability = async (itemId, requestedQty) => {
  try {
    const client = pgClient.getClient();
    const result = await client.query(
      "SELECT available_qty FROM inventory WHERE id = $1",
      [itemId]
    );
    if (result.rows.length === 0) {
      throw new Error("Item not found");
    }
    return result.rows[0].available_qty >= requestedQty;
  } catch (error) {
    throw new Error(`Error checking availability: ${error.message}`);
  }
};

const decrementInventory = async (itemId, qty) => {
  try {
    const client = pgClient.getClient();
    const result = await client.query(
      "UPDATE inventory SET available_qty = available_qty - $1 WHERE id = $2 AND available_qty >= $1 RETURNING id, name, price, tags, available_qty",
      [qty, itemId]
    );
    if (result.rows.length === 0) {
      throw new Error("Insufficient inventory");
    }
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error updating inventory: ${error.message}`);
  }
};

const incrementInventory = async (itemId, qty) => {
  try {
    const client = pgClient.getClient();
    const result = await client.query(
      "UPDATE inventory SET available_qty = available_qty + $1 WHERE id = $2 RETURNING id, name, price, tags, available_qty",
      [qty, itemId]
    );
    return result.rows[0];
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
