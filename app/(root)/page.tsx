import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import Image from "next/image";



const Home = () => {
    const loggedIn = { firstName: 'Hunny', lastName: 'JSM', email: 'TeamProjectt@COMP4431.com'}
  return (
    <section className="home">
        <div className="home-content">
            <header className="home-header">
                <HeaderBox
                type="greeting"
                title="Welcome"
                user="Hunny"
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
