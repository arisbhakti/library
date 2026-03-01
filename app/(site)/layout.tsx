"use client";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="min-h-screen pt-16 md:pt-20">{children}</main>
      <Footer />
    </div>
  );
}
