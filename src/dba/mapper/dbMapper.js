const mongoClient = require("../mongoose/mongoClient");
const pgClient = require("../postgres/pgClient");
const mysqlClient = require("../mysql/mysqlClient");
const DB_TYPES = {
  MONGO: {
    name: "MongoDB",
    SERVICE: mongoClient,
    connect: mongoClient.connectMongo,
    disconnect: mongoClient.disconnectMongo,
    getStatus: mongoClient.getMongoConnectionStatus 
  },
  POSTGRES: {
    name: "PostgreSQL",
    SERVICE: "pgClient",
    connect: pgClient.connectPostgres,
    disconnect: pgClient.disconnectPostgres,
    getStatus: pgClient.getPostgresConnectionStatus
  },
  MYSQL: {
    name: "MySQL",
    SERVICE: mysqlClient, // Placeholder for MySQL service
    connect: mysqlClient.connectMySQL, // Placeholder for MySQL connect function
    disconnect: mysqlClient.disconnectMySQL, // Placeholder for MySQL disconnect function
    getStatus: mysqlClient.getMySQLConnectionStatus // Placeholder for MySQL status function
  }

};

const dbService = process.env.DB_TYPE || "MONGO";

async function connectToDatabases(){  
    try {
        await DB_TYPES[dbService].connect();
    } catch (error) {
        console.error("Error connecting to databases: ", error.message);
        throw error;
    }
}

async function disconnectFromDatabases(){
    try {
        await DB_TYPES[dbService].disconnect();} catch (error) {
        console.error("Error disconnecting from databases: ", error.message);
        throw error;
    }   }
async function getDBConnectionStatus (){
    try {       const status =  await  DB_TYPES[dbService].getStatus();
        return status;
    } catch (error) {
        console.error("Error getting database connection status: ", error.message);
        throw error;
    }   }

    module.exports = {
        connectToDatabases,
        disconnectFromDatabases,
        getDBConnectionStatus
    };