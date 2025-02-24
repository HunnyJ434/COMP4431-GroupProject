import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const Home = async () => {
    // const { id, page } = searchParams; // await not needed since it's already passed as props

    const loggedIn = await getLoggedInUser();
    console.log(loggedIn?.$id);
    const accounts = await getAccounts({ userId: loggedIn?.$id });
    
    // const appwriteItemId = (id as string) || accounts?.Data[0]?.appwriteItemId;

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome"
                        user={loggedIn?.name || 'Guest'}
                        subtext="Access and manage your account and transactions efficiently"
                    />
                    <TotalBalanceBox
                        accounts={[accounts?.data]}
                        totalBanks={1}
                        totalCurrentBalance={1110.69}
                    />
                </header>

                <div>RECENT TRANSACTIONS</div>
            </div>

            <RightSidebar
                user={loggedIn as any}
                transactions={[]}
                banks={[{}, {}] as any}
            />
        </section>
    );
};

export default Home;
