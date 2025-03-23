import React from 'react'
import DoughnutChart from './DoughnutChart'
import AnimatedCounter from './AnimatedCounter'
const TotalBalanceBox = ({
    accounts, totalBanks, totalCurrentBalance
}: TotalBalanceBoxProps) => {
    return (
        <section className="total-balance">
            <div className="total-balance-chart">
                <DoughnutChart accounts={accounts || []}/>
            </div>

            <div className="flex flex-col gap-6">
                <h2 className="header-2">
                    Bank Accounts:{totalBanks}
                </h2>

                <div className="flex flex-col gap-2">
                    <p className="total-balance-label">
                        Total Current Balance
                    </p>
                    <div className="total-balance-amount flex-center gap-2">
                        <AnimatedCounter amount={totalCurrentBalance}/>
                    </div>
                </div>
            </div>
            <p className='text-[0.6rem] lg:text-[0.8rem]  w-[14rem]'>Since this is a development mode, you can add bank accounts by selecting
  any bank, skipping through mobile verification, and using the credentials "user_good" and "pass_good"
  to add accounts.</p>
        </section>
    )
}

export default TotalBalanceBox;