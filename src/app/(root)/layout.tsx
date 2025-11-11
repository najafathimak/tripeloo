import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import React from "react";

export default function RootSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
