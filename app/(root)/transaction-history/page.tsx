"use client";
import React from "react";
import TransactionList from "@/components/TransactionList";
const TransactionHistory = () => {


  return (
    <div className="mx-auto bg-white shadow-md w-[35rem] rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Transaction History</h2>
      <div key={""}>      <TransactionList/></div>

    </div>
  );
};

export default TransactionHistory;
