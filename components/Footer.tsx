'use client';
import React from 'react'
import Image from 'next/image'
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

const Footer = ({user, type='desktop'}: FooterProps)=>{
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({ redirect: true, callbackUrl: '/sign-in' });
    };
    return (
        <footer className ="footer">
            <div className ={type ===  'mobile' ? 'footer_name-mobile' : 'footer_name'}>
                <p className ="text-xl font-bold truncate text-gray-700 ">
                    {user?.firstName[0]}
                </p>

            </div>
            <div className = {type ===  'mobile' ? 'footer_email-mobile' : 'footer_email'}>
             <h1 className="text-14 truncate text-gray-700 font-semibold" >
                {user?.firstName}
             </h1>
             <p className="text-14 truncate text-gray-700 ">
                {user?.email}

             </p>
            </div>
            <div className =" " onClick={handleSignOut}>
                <button  className="text-left truncate text-gray-700 ">Log Out</button>
            </div>
        </footer>
    )
}

export default Footer