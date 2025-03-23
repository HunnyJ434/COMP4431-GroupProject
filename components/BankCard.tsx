'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import lineIcon from "../public/icons/lines.png"
import visaIcon from "../public/icons/visa.svg"
import paypalIcon from "../public/icons/Paypass.svg"
interface BankCardProps {
  accountType: string;
  accountMask: string;
  balance: number;
  username: string;
  showBalance: boolean;
  institution?: string; // Allow passing institution separately
}

const BankCard = ({ accountType, accountMask , balance, username, showBalance ,institution}: BankCardProps) => {
    return (
      <div className='text-black w-[18rem]'>
        <div className='flex flex-col space-y-[1rem]'>
          {accountType && (
            <Link href="/" className='relative z-10'>
              <div className="bg-cover bg-center rounded-[1rem]" style={{backgroundImage: "url('/icons/4.jpg')", backgroundSize: "cover", backgroundPosition: "center", height: "175px", width: "280px"}}>
                <div className='z-50'><Image className='' src={lineIcon.src} width={300} height={150} alt="card"/></div>
                <div className='w-[65%] z-100 top-0 absolute h-full bg-[#344054] rounded-l-[1rem]'>
                  <div className='absolute right-[1rem] text-[0.9rem] text-white bottom-[2.5rem]'><p>09/25</p></div>
                  <div className='absolute left-[1rem] text-[1.05rem] max-w-[16rem] overflow-hidden max-h-[1.7rem] text-white top-[1rem]'><p>{username}</p></div>
                </div>
                <div className='absolute right-[2.5rem] bottom-[1rem]'><Image className='z-51' src={visaIcon.src} width={50} height={50} alt='card1'/></div>
                <div className='absolute right-[2.8rem] top-[1rem]'><Image className='z-51' src={paypalIcon.src} width={20} height={20} alt='card1'/></div>
                <div className='absolute left-[1rem] text-[0.9rem] text-white bottom-[2.5rem]'><p>{institution}</p></div>
                <div className='absolute left-[1rem] text-[0.9rem] text-white bottom-[1rem]'>
                  <p>•••• •••• •••• {accountMask.replace(/.(?=.{4})/g, '*')}</p> {/* Masking account number except last 4 digits */}
                </div>
                {showBalance && (
                  <div className='absolute left-[1rem] text-[1.2rem] text-white top-[3rem]'>
                    <p>${balance?.toFixed(2) || "0.00"}</p> {/* Show balance if available */}
                  </div>
                )}
              </div>
            </Link>
          )}
        </div>
      </div>
    )
  }

export default BankCard;
