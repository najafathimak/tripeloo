import { Header } from "@/components/AdminPanel/Header";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-b from-red-400/80 to-red-100 min-h-screen">
      <Header />
      <main className="p-4">{children}</main>
    </div>
  );
}
