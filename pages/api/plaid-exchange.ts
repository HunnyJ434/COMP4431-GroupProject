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
        link_session_id,

      } = req.body;

      if (!userId || !publicToken || !accounts || accounts.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Exchange the public token for an access token
      const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
      const accessToken = response.data.access_token;

      // Fetch account balances from Plaid
      const balanceResponse = await plaidClient.accountsBalanceGet({ access_token: accessToken });

      // Map over the accounts and get balances
      const accountsWithBalance = accounts.map((account: { id: string; name: string }) => {
        const plaidAccount = balanceResponse.data.accounts.find((a) => a.account_id === account.id);
        return {
          id: account.id,
          name: account.name,
          balance: plaidAccount ? plaidAccount.balances.current : 0,
          institution,
          access_token: accessToken,
          link_session_id,
          transfer_status,
          mask: plaidAccount?.mask, 
          subtype: plaidAccount?.subtype,
        };
      });

      // Connect to the database
// Connect to the database
const db = await dbConnect();
const usersCollection:any = db.collection("users");
const userObjectId = new ObjectId(userId);

// Fetch the current bank accounts of the user
const user = await usersCollection.findOne({ _id: userObjectId });

if (!user) {
  return res.status(404).json({ error: "User not found" });
}


const existingAccounts = user?.bank_accounts || [];

// Create a Set of unique (institution + account name) combinations for existing accounts
const existingAccountKeys = new Set(
  existingAccounts.map((acc: any) => `${acc.institution.name}-${acc.name}`)
);

// Filter out new accounts that already exist in the database
const newAccounts = accountsWithBalance.filter((account: { name: string; institution: any}) => {
  const accountKey = `${account.institution.name}-${account.name}`;
  return !existingAccountKeys.has(accountKey); // Only keep accounts not already present
});

if (newAccounts.length === 0) {
  return res.status(400).json({ error: "All bank accounts are already linked." });
}

// Insert only unique accounts into the database
const updateResult = await usersCollection.updateOne(
  { _id: userObjectId },
  { $push: { bank_accounts: { $each: newAccounts } } }
);

// Respond with success
return res.status(200).json({
  message: "Bank accounts linked successfully!",
  accounts: newAccounts,
});
    } catch (error) {
      console.error("Error during Plaid token exchange:", error);
      res.status(500).json({ error: "Failed to exchange token and store bank account." });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
