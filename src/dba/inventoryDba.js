const inventoryMongo = require("./mongoose/inventoryMongo");
const inventoryPostgres = require("./postgres/inventoryPostgres");
const inventoryMysql = require("./mysql/inventoryMysql");

const DB_TYPE = process.env.DB_TYPE || "MONGO";

const dbServiceMap = {
  MONGO: inventoryMongo,
  POSTGRES: inventoryPostgres,
  MYSQL: inventoryMysql,
};

const getDbService = () => {
  const service = dbServiceMap[DB_TYPE];
  if (!service) {
    throw new Error(
      `Invalid DB_TYPE: ${DB_TYPE}. Supported types: MONGO, POSTGRES, MYSQL`
    );
  }
  return service;
};

const getMenu = async () => {
  const dbService = getDbService();
  return await dbService.getMenu();
};

const getMenuItemById = async (itemId) => {
  const dbService = getDbService();
  return await dbService.getMenuItemById(itemId);
};

const checkAvailability = async (itemId, requestedQty) => {
  const dbService = getDbService();
  return await dbService.checkAvailability(itemId, requestedQty);
};

const decrementInventory = async (itemId, qty) => {
  const dbService = getDbService();
  return await dbService.decrementInventory(itemId, qty);
};

const incrementInventory = async (itemId, qty) => {
  const dbService = getDbService();
  return await dbService.incrementInventory(itemId, qty);
};

module.exports = {
  getMenu,
  getMenuItemById,
  checkAvailability,
  decrementInventory,
  incrementInventory,
};
