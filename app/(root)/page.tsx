import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";



const Home = async () => {
    const loggedIn = await getLoggedInUser();
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
                accounts={[]}
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
