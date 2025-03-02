import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCard from './BankCard'
import { countTransactionCategories } from '@/lib/utils'
import Category from './Category'
import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useSession ,signOut} from "next-auth/react";
const RightSidebar = ({ user, bankAccount,  transactions }: RightSidebarProps) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    // Fetch link token from API
    const fetchLinkToken = async () => {
      try {
        const response = await fetch("/api/plaid", { method: "POST" });
        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error("Error fetching link token:", error);
      }
    };
    fetchLinkToken();
  }, []);

  // Initialize Plaid Link
  const { open, ready } = usePlaidLink({
    token: linkToken!,
    onSuccess: async (publicToken, metadata) => {
      console.log("Plaid public token:", publicToken);
      console.log("Bank metadata:", metadata);

      const userId = session?.user.id; // Replace with actual user ID, possibly from context or state

      // Extract relevant data from metadata
      const institution = metadata.institution;
      const accounts = metadata.accounts;
      const transfer_status = metadata.transfer_status;
      const link_session_id = metadata.link_session_id;

      // Send data to your API
      const res = await fetch("/api/plaid-exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,         // Add userId to the request body
          publicToken,    // Send public token here
          institution,    // Send institution info
          accounts,       // Send accounts info
          transfer_status, // Send transfer status
          link_session_id // Send link session ID
        }),
      });

      const data = await res.json();
      await signOut({ redirect: true, callbackUrl: '/sign-in' });

    },
    onExit: (error, metadata) => console.log("User exited Plaid:", error, metadata),
  });

  const categories: CategoryCount[] = countTransactionCategories(transactions);
    if(!user) return;
  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">any</span>
          </div>

          <div className="profile-details">
            <h1 className='profile-name'>
              {user.firstName} {user.lastName}
            </h1>
            <p className="profile-email">
              {user.email}
            </p>
          </div>
        </div>
      </section>

      <section className="banks">
        <div className="flex w-full justify-between">
          <h2 className="header-2">My Banks</h2>
          <button onClick={() => open()} disabled={!ready} className="flex gap-2">
            <Image 
               src="/icons/plus.svg"
              width={20}
              height={20}
              alt="plus"
            />
            <h2 className="text-14 font-semibold text-gray-600">
              Add Bank
            </h2>
          </button>
        </div>

        {bankAccount?.accounts?.length? (
  <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
    {bankAccount?.accounts[0] && (
      <div className="relative z-10">
        <BankCard 
          key={bankAccount.accounts[0].id}
          account={bankAccount.accounts[0]}
          username={`${user.firstName} ${user.lastName}`}
          showBalance={true}
          institution={bankAccount.institution}
        />
      </div>
    )}
    
    {bankAccount?.accounts[1] && (
      <div className="absolute right-0 top-8 z-0 w-[90%]">
        <BankCard 
          key={bankAccount.accounts[1].id}
          account={bankAccount.accounts[1]}
          username={`${user.firstName} ${user.lastName}`}
          showBalance={true}
          institution={bankAccount.institution}
        />
      </div>
    )}
  </div>
) : (
  <p>No bank accounts linked.</p> // You can replace this with a message or UI element
)}


        <div className="mt-10 flex flex-1 flex-col gap-6">
          <h2 className="header-2">Top categories</h2>

          <div className='space-y-5'>
            {categories.map((category, index) => (
              <Category key={category.name} category={category} />
            ))}
          </div>
        </div>
      </section>
    </aside>
  )
}

export default RightSidebar