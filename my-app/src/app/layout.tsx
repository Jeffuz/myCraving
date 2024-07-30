"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  const isSignInPage = pathName === "/signin";
  const isSignUpPage = pathName === "/signup";
  
  return (
    <html lang="en">
      <body className={inter.className}>
        {(!isSignInPage && !isSignUpPage)  && <Navbar />}
        {children}
      </body>
    </html>
  );
}
