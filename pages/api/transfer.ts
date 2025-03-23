import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { dbConnect } from "../../lib/dbConnect";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" as any});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { userId, senderAccountId, receiverEmailId,  receiverAccountId, transferType, amount, message ,senderEmailId} = req.body;

      if (!senderAccountId || !amount) {
        return res.status(400).json({ error: "Missing required fields." });
      }
      if (!receiverEmailId &&  !receiverAccountId) {
        return res.status(400).json({ error: "Missing required fields." });
      }
      const db = await dbConnect();
      const usersCollection = db.collection("users");
      const transactionsCollection = db.collection("transactions");

      // Find sender
      const sender = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!sender) return res.status(404).json({ error: "Sender not found." });

      // Find sender's bank account
      const senderAccount = sender.bank_accounts.find((account: { id: string }) => account.id === senderAccountId);
      if (!senderAccount) return res.status(404).json({ error: "Sender's account not found." });

      if (senderAccount.balance < amount) {
        return res.status(400).json({ error: "Insufficient funds." });
      }
      // depending on the payment type receiver account is selected
      var receiverAccount;
      var receiverId;
      var receiver
      if(transferType == "personal-accounts"){
        receiverAccount =  sender.bank_accounts.find((account: { id: string }) => account.id === receiverAccountId);
        if (!receiverAccount) return res.status(404).json({ error: "receving account not found." });
        receiverId = senderEmailId;
      }
      else if(transferType == "other-accounts"){
       receiver = await usersCollection.findOne({ email: receiverEmailId });
        if (!receiver) return res.status(404).json({ error: "Receiver not found." });
        receiverAccount = receiver.bank_accounts[0];
        if (!receiverAccount) return res.status(404).json({ error: "Receiver's account not found." });
        receiverId = receiverEmailId;
      }

      // Create a transaction entry before processing the transfer
      const transaction = {
        senderId: userId,
        senderAccountName:senderAccount.name,
        receiverAccountName:receiverAccount.name,
        transferType,
        senderAccountId,
        senderEmailId,
        receiverId,
        amount,
        status: "pending",
        timestamp: new Date(),
        paymentIntentId: "",
        message: message,
      };

      const transactionResult = await transactionsCollection.insertOne(transaction);
      const transactionId = transactionResult.insertedId;

      // Initiate Stripe Payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "usd",
        metadata: {
          senderId: userId,
          senderAccountId,
          receiverId,
        },
      });

      // Update transaction with Stripe Payment ID and mark as completed
      await transactionsCollection.updateOne(
        { _id: transactionId },
        { $set: { paymentIntentId: paymentIntent.id, status: "completed" } }
      );

      // Adjust sender and receiver balances
      senderAccount.balance -= amount;
      receiverAccount.balance += amount;

      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { "bank_accounts": sender.bank_accounts } }
      );
      if(transferType === "other-accounts"){

        await usersCollection.updateOne(
          { email: receiverEmailId },
          { $set: { "bank_accounts": receiver?.bank_accounts } }
        );
      }

 

      return res.status(200).json({
        message: "Transfer successful",
        paymentIntentId: paymentIntent.id,
      });

    } catch (error) {
      console.error("Error during transfer:", error);
      return res.status(500).json({ error: "An error occurred while processing the transfer." });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
