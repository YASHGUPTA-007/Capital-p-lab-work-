"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./_components/landingPage/Navbar";
import { Footer } from "./_components/landingPage/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Hide Navbar and Footer on all /admin routes
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}