"use client";

import { SmoothScroll } from "./SmoothScroll";
import { CustomCursor } from "./CustomCursor";
import { PageLoader } from "./PageLoader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <PageLoader />
      <CustomCursor />
      {children}
    </SmoothScroll>
  );
}
