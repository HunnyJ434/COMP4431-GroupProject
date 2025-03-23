export const dynamic = 'force-dynamic'
import SideBar from "@/components/Sidebar"
import Image from "next/image";




export default  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <main className="flex flex-col md:flex-row h-screen w-full font-inter">
      <SideBar/>
          <div className="flex flex-col size-full">
            {children}
          </div>

    </main>
  );
}
