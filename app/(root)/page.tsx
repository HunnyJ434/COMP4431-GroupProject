import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";



const Home = async () => {
    const loggedIn = await getLoggedInUser();
    const accounts = await getAccounts({userId: loggedIn.$id })
    if(!accounts) return;

    const appwriteItemId = (id as string) || accounts?.Data[0]?.appwriteItemId;

    const account = await getAccount({ appwriteItemId })
    
    return (
    <section className="home">
        <div className="home-content">
            <header className="home-header">
                <HeaderBox
                type="greeting"
                title="Welcome"
                user={loggedIn?.name|| 'Guest'}
                subtext="Access and manage your account and transactions effciently"
                />
                <TotalBalanceBox
                accounts={[accounts?.data]}
                totalBanks={1}
                totalCurrentBalance={1110.69}
                />
            </header>

            RECENT TRANSACTIONS
        </div>

        <RightSidebar 
          user={loggedIn as any}
          transactions={[]}
          banks={[{}, {}] as any}
        />
    </section>
  );
}
export default Home
