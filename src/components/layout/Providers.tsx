"use client";

import { usePathname } from "next/navigation";
import { SmoothScroll } from "./SmoothScroll";
import { CustomCursor } from "./CustomCursor";
import { PageLoader } from "./PageLoader";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isConnect = pathname?.startsWith("/connect");

  // Digital business card: keep it light — no loader, cursor, or Lenis
  if (isConnect) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <PageLoader />
      <CustomCursor />
      {children}
    </SmoothScroll>
  );
}
