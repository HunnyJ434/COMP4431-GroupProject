export const dynamic = 'force-dynamic'
import SideBar from "@/components/Sidebar"
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = { firstName: 'Hunny', lastName: 'JSM', email: 'contact@jsmastery.pro'}
  return (
    <main>
      <div className="flex">
      <SideBar user={loggedIn as any}/>
        {children}

        </div>
    </main>
  );
}
