import type { Metadata } from "next";

import { AdminAccessGate } from "@/components/admin-access-gate";
import { AdminDashboardNav } from "@/components/admin-dashboard-nav";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAccessGate>
      <AdminDashboardNav />
      {children}
    </AdminAccessGate>
  );
}
