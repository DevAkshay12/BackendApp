const { MongoClient } = require("mongodb");

const mongoUri = process.env.DB_URL || process.env.ATLAS_URL || process.env.MONGODB_URI || process.env.atlas_url;
const dbName = process.env.DB_NAME || "users";

let client;
let db;

if (!mongoUri) {
  console.warn("MongoDB connection string not found. Set DB_URL or atlas_url in .env");
}

function getClient() {
  if (!client) {
    client = new MongoClient(mongoUri || "mongodb://localhost:27017/myapi");
  }

  return client;
}

async function connectDB() {
  try {
    if (!db) {
      const mongoClient = getClient();
      await mongoClient.connect();
      db = mongoClient.db(dbName);
      console.log(`Connected to MongoDB database: ${dbName}`);
    }

    return db;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

module.exports = { connectDB, client: getClient, db };
