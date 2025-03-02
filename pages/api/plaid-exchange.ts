import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import plaidClient from "../../lib/plaidClient";
import { dbConnect } from "../../lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { 
        userId, 
        publicToken, 
        institution, 
        accounts, 
        transfer_status, 
        link_session_id 
      } = req.body;

      // Validate the incoming data
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      if (!publicToken) {
        return res.status(400).json({ error: "Public token is required" });
      }

      if (!accounts || accounts.length === 0) {
        return res.status(400).json({ error: "At least one account is required" });
      }

      // Exchange the public token for an access token
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });

      const accessToken = response.data.access_token;

      // Fetch account balances from Plaid
      const balanceResponse = await plaidClient.accountsBalanceGet({
        access_token: accessToken,
      });

      // Map over the accounts and get balances
      const accountsWithBalance = accounts.map((account: { id: string; }) => {
        const plaidAccount = balanceResponse.data.accounts.find((a) => a.account_id === account.id);
        return {
          ...account,
          balance: plaidAccount ? plaidAccount.balances.current : 0, // Default to 0 if balance is unavailable
        };
      });

      // Connect to the database
      const db = await dbConnect();
      const usersCollection = db.collection("users");

      const userObjectId = new ObjectId(userId);

      // Update the bank account data in the database with the balance
      const updateResult = await usersCollection.updateOne(
        { _id: userObjectId },
        {
          $set: {
            "bank_account.access_token": accessToken,
            "bank_account.link_session_id": link_session_id,
            "bank_account.institution": institution,
            "bank_account.accounts": accountsWithBalance, // Store accounts with balance
            "bank_account.transfer_status": transfer_status,
          },
        }
      );

      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Retrieve the session to update the bank account data
      const session = await getSession({ req });

      if (session?.user) {
        session.user.bankAccount = {
          access_token: accessToken,
          link_session_id: link_session_id,
          institution: institution,
          accounts: accountsWithBalance, // Include balances
          transfer_status: transfer_status,
        };
      }

      return res.status(200).json({ 
        message: "Bank account linked successfully!", 
        access_token: accessToken, 
        accounts: accountsWithBalance, // Return accounts with balances in response
      });

    } catch (error) {
      console.error("Error during Plaid token exchange:", error);
      res.status(500).json({ error: "Failed to exchange token and store bank account." });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
