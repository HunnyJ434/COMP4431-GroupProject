import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import BankCard from './BankCard'

const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
    return (
        <aside className="right-sidebar">
            <section className="flex flex-col pb-8">
                <div className="profile-banner" />
                <div className="profile">
                    <div className="profile-img">
                        <span className="text-5xl font-bold text-blue-500">{user.name[0]}</span>
                    </div>
                    <div className="profile-details">
                        <h1 className='profile-name'>
                            {user.name}
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
                    <Link href="/" className="flex gap">
                        <Image src="/icons/auth-image.jpg" width={20} height={20} alt="Auth image" />
                        <h2 className='text-14 font-semifold text-grey-600'>Add Bank</h2>
                    </Link>
                </div>
                {banks?.length > 0 && (
                    <div className="relativeflex flex-1 flex-col items-center justify-center gap-5">
                        <div className='relative z-10'>
                            <BankCard accounts={banks} username={user.name} showBalance={false} />
                        </div>
                    </div>
                )}
            </section>
        </aside>
    )
}

export default RightSidebar