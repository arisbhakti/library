import type { ReactNode } from "react";

import { PageTransition } from "@/components/layout/page-transition";

type RegisterLayoutProps = {
  children: ReactNode;
};

export default function RegisterLayout({ children }: RegisterLayoutProps) {
  return <PageTransition>{children}</PageTransition>;
}
