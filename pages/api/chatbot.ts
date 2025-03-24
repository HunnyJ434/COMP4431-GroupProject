import type { NextApiRequest, NextApiResponse } from 'next';
import {dbConnect} from "@/lib/dbConnect"; // Ensure correct import
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, userId } = req.body;
    console.log(userId)
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
  
    const db = await dbConnect();
    const usersCollection = db.collection("users");
  
    // Find user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(userId as string) });
  
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    var totalBalance = 0;
    if(user.bank_accounts?.length > 0) {
      totalBalance = user.bank_accounts?.reduce((sum: number, account: any) => sum + (account.balance || 0), 0) || 0;
    }
    const totalAccounts = user.bank_accounts?.length || 0;
    const customMessage = `user message: ${message} -- user data in case user specifically inqury about it -- 
    name: ${user.firstName + " " + user.lastName}, email: ${user.email}, address: ${user.address + " " + user.city + " " +
      user.state + " " + user.postalCode}, User total balance ${totalBalance}, total bank accounts ${totalAccounts}`

    const response = await fetch('https://api.chatpdf.com/v1/chats/message', {
      method: 'POST',
      headers: {
          "Content-Type": "application/json",
          "x-api-key": "sec_xfYgJ2zgP2IM0FF7HqGMtfHL5KOk8lTz" // Replace with your API key
      },
      body: JSON.stringify({
          sourceId: "cha_GpyuonqqqzNLGWFaD9zA1",
          messages: [{role: "user", content: customMessage}],
      }),
    });
  

    if (!response.ok) {
      throw new Error(`ChatPDF API error: ${response.statusText}`);
    }

    const data = await response.json();

    res.status(200).json({ response: data.content || 'No response' });
  } catch (error) {
    console.error('ChatPDF API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
