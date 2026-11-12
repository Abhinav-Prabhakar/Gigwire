import { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Booker's desk",
  description: "Your nights, your applicant pile and one-click 'mark filled' — the room side of GIGWIRE.",
  alternates: { canonical: pageUrl("/dashboard") },
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1240px] px-4 py-24 md:px-8" />}>
      <DashboardClient />
    </Suspense>
  );
}
