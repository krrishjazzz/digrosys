"use client";

import { usePathname } from "next/navigation";
import { SmoothScroll } from "./SmoothScroll";
import { PageLoader } from "./PageLoader";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isConnect = pathname?.startsWith("/connect");
  const isAdmin = pathname?.startsWith("/admin");

  // Connect + Admin: keep light — no loader or Lenis
  if (isConnect || isAdmin) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <PageLoader />
      {children}
    </SmoothScroll>
  );
}
