// db.ts
import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
const host = process.env.MONGO_HOST;
const dbName = process.env.MONGO_DB;

// ✅ For MongoDB Atlas (no port, no authSource)
const uri = `mongodb+srv://${user}:${pass}@${host}/${dbName}?retryWrites=true&w=majority`;
console.log("mongo url", uri);
const client = new MongoClient(uri);
let db: Db;

export async function getDb(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    await ensureIndexes();
    console.log("✅ Connected to MongoDB Atlas");
  }
  return db;
}

async function ensureIndexes() {
  const db = client.db(dbName);
  await db.collection("categories").createIndex({ slug: 1 }, { unique: true });
  await db.collection("images").createIndex({ categoryId: 1 });
}
