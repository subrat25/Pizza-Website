const orderMongo = require("./mongoose/orderMongo");
const orderPostgres = require("./postgres/orderPostgres");
const orderMysql = require("./mysql/orderMysql");

const DB_TYPE = process.env.DB_TYPE || "MONGO";

const dbServiceMap = {
  MONGO: orderMongo,
  POSTGRES: orderPostgres,
  MYSQL: orderMysql,
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

const createOrder = async (orderData) => {
  const dbService = getDbService();
  return await dbService.createOrder(orderData);
};

const getOrderById = async (orderId) => {
  const dbService = getDbService();
  return await dbService.getOrderById(orderId);
};

const updateOrderStatus = async (orderId, status) => {
  const dbService = getDbService();
  return await dbService.updateOrderStatus(orderId, status);
};

const getUserOrders = async (userId) => {
  const dbService = getDbService();
  return await dbService.getUserOrders(userId);
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getUserOrders,
};