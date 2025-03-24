'use client';

import dynamic from 'next/dynamic';

// Dynamically import the ResetPassword component, ensuring it's client-side only
const Password = dynamic(() => import('./Password'), { ssr: false });

export default function ResetPasswordPage() {
  return (
    <div>
      <Password />
    </div>
  );
}