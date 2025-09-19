// db.ts
import { MongoClient, Db } from "mongodb";

import dotenv from "dotenv";
dotenv.config();

const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
const dbName = process.env.MONGO_DB;
const uri = `mongodb://${user}:${pass}@${host}:${port}/?authSource=admin`;
const client = new MongoClient(uri);
let db: Db;

export async function getDb() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    await ensureIndexes();
  }
  return db;
}

async function ensureIndexes() {
  const db = client.db(dbName);
  await db.collection("categories").createIndex({ slug: 1 }, { unique: true });
  await db.collection("images").createIndex({ categoryId: 1 });
}
