export const dynamic = 'force-dynamic'
import SideBar from "@/components/Sidebar"
import Image from "next/image";
import MobileNav from "@/components/MobileNav"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = { firstName: 'Hunny', lastName: 'JSM', email: 'contact@jsmastery.pro'}
  return (
    <main className="flex h-screen w-full font-inter">

        <SideBar user={loggedIn as any}/>
          <div className="flex flex-col size-full">
            <div className="root-layout">
              <Image src="/icons/logo.png" width={30} height={30} alt="menu icon" />
              <MobileNav user={loggedIn as any}/>
            </div>
            {children}
          </div>
    </main>
  );
}
