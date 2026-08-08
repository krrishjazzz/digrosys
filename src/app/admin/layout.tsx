import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-root bg-white">{children}</div>;
}
