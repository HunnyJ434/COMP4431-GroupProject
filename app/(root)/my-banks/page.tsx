'use client';
import React, { useEffect, useState, useMemo } from 'react';
import BankCard from '@/components/BankCard';
import { useSession } from 'next-auth/react';

const BankAccountsPage = () => {
  const { data: session } = useSession();
  const [bankData, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  if (session?.user.bankAccounts?.length === 0) {
    return <h1 className='m-auto'>No Bank Account Found.</h1>;
  }

  useEffect(() => {
    const fetchBankAccounts = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch(`/api/getBankData?userId=${session.user.id}`);
        if (!response.ok) throw new Error('Failed to fetch accounts');
        const data = await response.json();
        setAccounts(data || []);
      } catch (err) {
        setError('Error fetching accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, [session]);

  // Group bank accounts by institution name
  const groupedByInstitution = useMemo(() => {
    return (bankData ?? []).reduce((acc, account) => {
      const institutionName = account.institution?.name; // Safe access
      if (!institutionName) return acc; // Skip if no institution name
  
      if (!acc[institutionName]) {
        acc[institutionName] = [];
      }
      acc[institutionName].push(account);
      return acc;
    }, {} as Record<string, typeof bankData[number][]>);
  }, [bankData]);

  if (loading) return <p className="text-center text-gray-500">Loading bank accounts...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8 overflow-scroll">
      <h1 className="text-2xl font-bold text-center mb-6 mt-[2rem] ">My Bank Accounts</h1>

      {/* Loop through grouped institutions */}
      {Object.keys(groupedByInstitution).map((institutionName) => (
        <div key={institutionName} className="mt-[4rem] ">
          <h2 className="text-xl font-semibold text-center mb-4">{institutionName}</h2>
          <div className="px-[10%] sm:px-[25%] md:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:pl-[10%]">
            {groupedByInstitution[institutionName].map((account:any) => (
              <div key={account.id} className="relative z-10">
                <BankCard
                  accountType={account.subtype}
                  accountMask={account.mask}
                  balance={account.balance}
                  username={account.name}
                  institution={account.institution.name}
                  showBalance={true}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BankAccountsPage;
