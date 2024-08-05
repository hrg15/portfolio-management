"use client";

import AdminAuth from "@/components/admin-auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminAuth>{children}</AdminAuth>;
}
