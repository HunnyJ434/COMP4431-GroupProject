'use client'
import Image from "next/image";
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
    Sheet,
    SheetContent,
    SheetClose,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Footer from "./Footer";
const MobileNav = ({ user }: MobileNavProps) => {
    const pathname = usePathname();
    return (
        <section className="w-fulll max-w-[264px] ">
            <Sheet>
                
                <SheetTrigger>
                    <Image src="/icons/hamburger.svg" width={30} height={30} alt="menu" className="cursor-pointer"/>
                </SheetTrigger>
                <SheetContent side="left" className="border-none bg-white">
  <SheetHeader>
    <SheetTitle></SheetTitle> {/* Required for accessibility */}
  </SheetHeader>
  <nav className="flex flex-col gap-4">
  <Link href="/" className="cursor-pointer flex items-center gap-1">
            <Image 
              src="/icons/logo.png"
              width={50}
              height={434}
              alt="LU Banking Management logo"/>
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">LU Banking Management</h1>
          </Link>
    <div className="mobilenav-sheet">
      <SheetClose asChild>
        <nav className="flex h-full flex-col gap-6 pt-16">
          {sidebarLinks.map((item) => {
            const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
            return (
              <Link href={item.route} key={item.label} className={cn('sidebar-link', { 'bg-bank-gradient': isActive })}>
                <div className="relative size-6">
                  <Image src={item.imgURL} alt={item.label} width={20} height={20} className={cn({ 'brightness-[3] invert-0': isActive })}/>
                </div>
                <p className={cn("text-16 font-semibold text-black-2", { "text-white": isActive })}>
                  {item.label}
                </p>
              </Link>
            );
          })}
        </nav>
      </SheetClose>
      <Footer user ={user} type="mobile"/>
    </div>
    USER
  </nav>
</SheetContent>

            </Sheet>
         </section>
    )
}

export default MobileNav