import { NextApiRequest, NextApiResponse } from "next";
import {dbConnect} from "@/lib/dbConnect"; // Ensure correct import
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Connect to MongoDB
    const db = await dbConnect();
    const usersCollection = db.collection("users");

    // Find user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(userId as string) });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's bank data
    return res.status(200).json(user.bank_accounts || {});
  } catch (error) {
    console.error("Error fetching bank data:", error);
    return res.status(500).json({ error: "Error fetching bank data" });
  }
}
