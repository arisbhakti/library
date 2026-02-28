import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

type PageShellProps = {
  children: ReactNode;
  isLoggedIn?: boolean;
};

export function PageShell({ children, isLoggedIn = false }: PageShellProps) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Header isLoggedIn={isLoggedIn} />
      {children}
      <Footer />
    </div>
  );
}
