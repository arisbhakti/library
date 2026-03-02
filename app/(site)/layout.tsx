"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import {
  AUTH_STATE_CHANGED_EVENT,
  getAuthRole,
  getAuthToken,
} from "@/lib/auth";

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAccessChecked, setIsAccessChecked] = useState(false);
  const hideFooter = pathname === "/success" || pathname.startsWith("/success/");
  const isListPage = pathname === "/list" || pathname.startsWith("/list/");

  useEffect(() => {
    const enforceRouteAccess = () => {
      const token = getAuthToken();
      const role = getAuthRole();

      if (!token || !role) {
        setIsAccessChecked(true);
        return;
      }

      if (role === "ADMIN" && !isListPage) {
        setIsAccessChecked(false);
        router.replace("/list");
        return;
      }

      if (role === "USER" && isListPage) {
        setIsAccessChecked(false);
        router.replace("/home");
        return;
      }

      setIsAccessChecked(true);
    };

    enforceRouteAccess();

    window.addEventListener("storage", enforceRouteAccess);
    window.addEventListener(AUTH_STATE_CHANGED_EVENT, enforceRouteAccess);

    return () => {
      window.removeEventListener("storage", enforceRouteAccess);
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, enforceRouteAccess);
    };
  }, [isListPage, router]);

  if (!isAccessChecked) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="min-h-screen pt-16 md:pt-20">{children}</main>
      {hideFooter ? null : <Footer />}
    </div>
  );
}
