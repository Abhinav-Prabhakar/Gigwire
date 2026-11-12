import { Suspense } from "react";
import type { Metadata } from "next";
import { SignupClient } from "./SignupClient";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Make an account",
  description:
    "Join GIGWIRE free: build a one-sheet as a player, or claim your room and post live music vacancies with the pay stated up front.",
  alternates: { canonical: pageUrl("/signup") },
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1240px] px-4 py-24 md:px-8" />}>
      <SignupClient />
    </Suspense>
  );
}
