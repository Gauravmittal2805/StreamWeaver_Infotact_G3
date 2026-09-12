const { MongoClient } = require("mongodb");

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || "StreamWeaver";

let client;
let db;

async function connectDB() {
  if (db) {
    return db;
  }

  const uri = process.env.MONGO_URI || mongoUri;
  if (!uri) {
    throw new Error("MONGO_URI is not defined");
  }

  const databaseName = process.env.MONGO_DB_NAME || dbName;

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(databaseName);

  console.log(`MongoDB connected: ${databaseName}`);
  return db;
}

function getDB() {
  if (!db) {
    throw new Error("Database is not connected");
  }
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = {
  connectDB,
  getDB,
  closeDB
};
