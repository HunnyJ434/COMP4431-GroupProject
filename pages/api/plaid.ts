import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { Products, CountryCode } from "plaid";

// Initialize Plaid client
const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"], 
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID!,
      "PLAID-SECRET": process.env.PLAID_SECRET!,
    },
  },
});

const plaidClient = new PlaidApi(config);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Ensure that client_user_id is dynamically generated (use a unique value for each user)
      const client_user_id = req.body.client_user_id || "default-user-id"; // Use user-specific ID if available

      // Step 1: Create Link Token
      const response = await plaidClient.linkTokenCreate({
        user: { client_user_id },
        client_name: "Your App", // Change this to your app's name
        products: ['auth'] as Products[], // Specify the products you want to use
        country_codes: ['US','CA'] as CountryCode[], // Adjust according to the supported countries
        language: "en", // Language for the UI
      });

      // Return the link token to the frontend
      res.status(200).json({ link_token: response.data.link_token });
    } catch (error:any) {
      console.error("Error creating link token:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to create link token" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
