'use client'
import React, { useEffect, useState } from 'react';
import BankCard from '@/components/BankCard';
import { useSession } from 'next-auth/react';

const BankAccountsPage = () => {
  const { data: session } = useSession();
  const [bankData, setAccounts] = useState<BankDetails>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBankAccounts = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch(`/api/getBankData?userId=${session.user.id}`);
        if (!response.ok) throw new Error('Failed to fetch accounts');
        const data = await response.json();
        setAccounts(data|| []);
      } catch (err) {
        setError('Error fetching accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, [session]);

  if (loading) return <p className="text-center text-gray-500">Loading bank accounts...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6 mt-[2rem]">My Bank Accounts</h1>
      <div className="relative flex items-center justify-center mt-[4rem] space-x-[9rem]">
        {bankData?.accounts.map((account) => (
        <div className="relative z-10">
          <BankCard key={account.id} account={account} username={account.name} institution={bankData?.institution} showBalance={true} />
        </div>
        ))}
      </div>
    </div>
  );
};

export default BankAccountsPage;
