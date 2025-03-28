import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}
      <div className="auth-asset">
     <div>
          <Image 
            src="/icons/auth-image.jpg"
            alt="Auth image"
            layout="fill"
            objectFit="cover"  // Ensures the image fits well
          />
        </div>
      </div>

    </main>
  );
}