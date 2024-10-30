import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SideNavBar from "@/components/ui/SideNavBar";


const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "NexCrypt",
  description: "A Nex-Gen Cryptography Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body
          className={`${jakartaSans.className} antialiased`}
        >
          <div className="flex bg-[#1c1c28]">
            <SideNavBar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </body>
      </html>
  );
}
