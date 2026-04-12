const inventoryDba = require("../../dba/inventoryDba");

const getMenu = async () => {
  return await inventoryDba.getMenu();
};

const getMenuItemById = async (itemId) => {
  return await inventoryDba.getMenuItemById(itemId);
};

const checkAvailability = async (itemId, requestedQty) => {
  return await inventoryDba.checkAvailability(itemId, requestedQty);
};

module.exports = {
  getMenu,
  getMenuItemById,
  checkAvailability,
};