import type { Metadata } from "next";
import { ConnectCard } from "@/components/connect/ConnectCard";

export const metadata: Metadata = {
  title: "Connect · Abhishek Tamang",
  description:
    "Digital business card for Abhishek Tamang, Founder of DIGROSYS — call, WhatsApp, email, or save contact.",
  openGraph: {
    title: "Connect with DIGROSYS",
    description:
      "Abhishek Tamang · Founder · Creative growth, production & performance marketing.",
    url: "https://www.digrosys.com/connect",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ConnectPage() {
  return <ConnectCard />;
}
