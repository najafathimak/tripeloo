import { AdminHeader } from "@/components/AdminPanel/AdminHeader";
import AdminAuth from "@/components/AdminPanel/AdminAuth";
import AnimatedBackground from "@/components/AdminPanel/AnimatedBackground";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <AdminAuth>
          <AdminHeader />
          <main className="p-4">{children}</main>
        </AdminAuth>
      </div>
    </div>
  );
}
