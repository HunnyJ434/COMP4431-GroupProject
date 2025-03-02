import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

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

// Log environment variables to verify they are correctly loaded
console.log("Plaid environment:", process.env.PLAID_ENV);
console.log("Plaid client ID:", process.env.PLAID_CLIENT_ID);

export default plaidClient;
