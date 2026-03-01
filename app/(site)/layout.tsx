"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname();
  const hideFooter = pathname === "/success" || pathname.startsWith("/success/");

  return (
    <div className="min-h-screen">
      <Header />

      <main className="min-h-screen pt-16 md:pt-20">{children}</main>
      {hideFooter ? null : <Footer />}
    </div>
  );
}
