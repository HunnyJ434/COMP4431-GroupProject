import Image from 'next/image'
import React from 'react'
import BankCard from './BankCard'
import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useSession ,signOut} from "next-auth/react";
import Alert from './Alert';
const RightSidebar = ({ user, bankAccount,  transactions }: RightSidebarProps) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [alertKey, setAlertKey] = useState<number>(0);
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
      if(data.error){
          setAlertKey(prevKey => prevKey + 1);
      }
      else{
        await signOut({ redirect: true, callbackUrl: '/sign-in' });
      }
  

    },
    onExit: (error, metadata) => console.log("User exited Plaid:", error, metadata),
  });

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
      { alertKey > 0 && (
        <Alert key={alertKey} message="All bank accounts are already linked." type="error" />
      )}
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

        {bankAccount?.length ? (
  <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
    {bankAccount[0] && (
      <div className="relative z-10">
        <BankCard 
          key={bankAccount[0].id}
          accountType={bankAccount[0].subtype}
          accountMask={bankAccount[0].mask}
          balance={bankAccount[0].balance}
          username={`${user.firstName} ${user.lastName}`}
          showBalance={true}
          institution={bankAccount[0].institution.name}
        />
      </div>
    )}
    
    {bankAccount[1] && (
      <div className="absolute right-0 top-8 z-0 w-[90%]">
      <BankCard 
          key={bankAccount[1].id}
          accountType={bankAccount[1].subtype}
          accountMask={bankAccount[1].mask}
          balance={bankAccount[1].balance}
          username={`${user.firstName} ${user.lastName}`}
          showBalance={true}
          institution={bankAccount[1].institution.name}
        />
      </div>
    )}
    <h1 className='mt-[3rem]'>Since this is a development mode, you can add bank account by selecting
      any bank, skipping  through mobile verification, and using the credentials "user_good" and "pass_good"
      to add accounts.
    </h1>
  </div>
) : (
  <p>No bank accounts linked. Since this is a development mode, you can add bank account by selecting
  any bank, skipping  through mobile verification, and using the credentials "user_good" and "pass_good"
  to add accounts.</p> // You can replace this with a message or UI element
)}
      </section>
    </aside>
  )
}

export default RightSidebar