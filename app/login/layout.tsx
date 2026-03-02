import type { ReactNode } from "react";

import { PageTransition } from "@/components/layout/page-transition";

type LoginLayoutProps = {
  children: ReactNode;
};

export default function LoginLayout({ children }: LoginLayoutProps) {
  return <PageTransition>{children}</PageTransition>;
}
