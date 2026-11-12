import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginClient } from "./LoginClient";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to GIGWIRE to see your saved nights, applications and replies from rooms.",
  alternates: { canonical: pageUrl("/login") },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1240px] px-4 py-24 md:px-8" />}>
      <LoginClient />
    </Suspense>
  );
}
