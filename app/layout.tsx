import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SideNavBar from "@/components/ui/SideNavBar";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
    // <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* <SignedOut>
                <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn> */}
          <div className="flex bg-[#1c1c28]">
            <SideNavBar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </body>
      </html>
    // </ClerkProvider>
  );
}
