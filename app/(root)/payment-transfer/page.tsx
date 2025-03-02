'use client'
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const TransferForm = () => {
  const { data: session, status } = useSession();
  const [senderAccountId, setSenderAccountId] = useState("");
  const [receiverEmailId, setReceiverEmailId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [bankData, setBankData] = useState<any>(null);
  const [transactionMessage, setTransactionMessage] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBankData = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/getBankData?userId=${session.user.id}`);
        if (!response.ok) throw new Error("Failed to fetch bank data");
        const data = await response.json();
        setBankData(data);
      } catch (error) {
        console.error("Error fetching bank data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchBankData();
    }
    console.log(bankData)
  }, [session]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(senderAccountId, receiverEmailId, amount)
    if (!senderAccountId || !receiverEmailId || !amount) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user.id,
          senderAccountId,
          receiverEmailId,
          senderEmailId: session?.user.email,
          amount: parseFloat(amount),
          message: transactionMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError("");
      } else {
        setError(data.error);
        setMessage("");
      }
    } catch (error) {
      setError("An error occurred while processing the transfer.");
      setMessage("");
    }
  };

  return (
    <div className=" mx-auto bg-white shadow- w-[35rem] rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Transfer Funds</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Sender Account</label>
            <select
                value={senderAccountId}
                onChange={(e) => setSenderAccountId(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                   
                    {bankData?.accounts.map((account:BankAccount) => (
                        <option key={account.id} value={account.id}>
                        {account.name} - {"•••• •••• •••• "} {account.mask} (${account.balance})
                        </option>
                    ))}
            </select>
</div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Receiver Email</label>
          <input
            type="text"
            value={receiverEmailId}
            onChange={(e) => setReceiverEmailId(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter receiver email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <input
            type="text"
            value={transactionMessage}
            onChange={(e) => setTransactionMessage(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter a message (optional)"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Transfer
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      {message && <p className="text-green-500 text-sm mt-2 text-center">{message}</p>}
    </div>
  );
};

export default TransferForm;
