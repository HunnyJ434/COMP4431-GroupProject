'use client';
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
const TransactionList = ()=>{ 
    const { data: session } = useSession();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchTransactions = async () => {
        if (!session?.user?.id) return;
  
        try {
          const response = await fetch("/api/transactions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user: session?.user,
              }),
            });
          if (!response.ok) throw new Error("Failed to fetch transactions");
          const data = await response.json();
          setTransactions(data);
  
        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTransactions();
    }, [session]);
    return (
        <div>
            {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-600">No transactions found.</p>
      ) : (
        <ul className="space-y-4">
        {transactions.map((txn: any) => (
          <li key={txn._id} className="border-b pb-2">
            {session?.user.email === txn.receiverEmailId? <><p><strong>Sent By:</strong> {txn.senderEmailId}</p>
            <p><strong>Sent from account:</strong> {session?.user.bankAccount?.accounts.find((obj) => obj.id === txn.senderAccountId)?.name || "Account not found"}</p></>
            : <p><strong>Recipient:</strong> ${txn.receiverEmailId}</p> }  
            <p><strong>Amount:</strong> ${txn.amount}</p>
            <p><strong>Status:</strong> {txn.status}</p>
            <p><strong>Message:</strong> {txn.message || "No message"}</p>
            <p className="text-sm text-gray-500">{new Date(txn.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      )}
        
      </div>
    );
}

export default TransactionList



