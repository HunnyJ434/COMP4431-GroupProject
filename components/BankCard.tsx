'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
const BankCard = ({accounts, username, showBalance} : {accounts:Bank[] & Account[], username:string, showBalance: boolean}) => {

    return (
        <div className='text-black'>
            <div className='flex flex-col space-y-[1rem]'>
            {accounts[0] && (
                <Link href="/" className='relative z-10'>
                    <div className="bg-cover bg-center rounded-[1rem]"   style={{backgroundImage: "url('/icons/4.jpg')", backgroundSize: "cover", backgroundPosition: "center", height: "175px", width: "280px",}}>
                    <div className='z-50'><Image className='' src="/icons/lines.svg" width={300} height={150} alt="card"/></div>
                        <div className='w-[65%] z-100 top-0 absolute h-full bg-[#344054] rounded-l-[1rem]'>
                            <div className=' absolute right-[1rem] text-[0.9rem] text-white bottom-[2.5rem]'><p>09/25</p></div>
                            <div className=' absolute left-[1rem] text-[1.05rem] text-white top-[1rem]'><p>Daniel Jaglen</p></div>
                        </div>
                        <div className=' absolute right-[2.5rem] bottom-[1rem]'><Image className='z-51' src="/icons/visa.svg" width={50} height={50} alt='card1'/></div>
                        <div className=' absolute right-[2.8rem] top-[1rem]'><Image className='z-51' src="/icons/PayPass.svg" width={20} height={20} alt='card1'/></div>
                        <div className=' absolute left-[1rem] text-[0.9rem] text-white bottom-[2.5rem]'><p>DJ</p></div>
                        <div className=' absolute left-[1rem] text-[1.05rem] text-white bottom-[1rem]'><p>1234 1234 1234 1234</p></div>     
                    </div>
                </Link>
            )}
             {accounts[1] && (
                <Link href="" className='absolute top-8 right-0 z-0 w-[90%]'>
                    <div className='bg-[#4893FF] rounded-[1rem]'>
                        <Image className='' src="/icons/lines.svg" width={380} height={150} alt="card"/>
                    </div>
                    <div className=' absolute right-[0.8rem] bottom-[0.8rem]'><Image className='z-51' src="/icons/mastercard.svg" width={50} height={50} alt='card1'/></div>
                    <div className=' absolute right-[1.15rem] top-[1rem]'><Image className='z-51' src="/icons/PayPass.svg" width={20} height={20} alt='card1'/></div>          
                   
                    <div className=' absolute left-[1rem] text-[1rem] text-white bottom-[1rem]'><p>1234 1234 1234 1234</p></div>     
                </Link>
            )}
            </div>           
        </div>
    )
}
export default BankCard
