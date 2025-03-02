// lib/dbConnect.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri:any = process.env.MONGODB_URI;

const client = new MongoClient(uri);
let isConnected = false; // This will keep track of the connection status

export async function dbConnect() {
  if (!isConnected) {
    await client.connect();
    isConnected = true; // Set to true once connected
    console.log("Connected to MongoDB");
  }
  return client.db('bankingApp'); // Adjust 'yourDatabaseName' accordingly
}

// New function to check database connection
export async function checkDbConnection() {
  try {
    const db = await dbConnect();
    return db !== null;
  } catch (error) {
    console.error("DB Connection Error:", error);
    return false;
  }
}
