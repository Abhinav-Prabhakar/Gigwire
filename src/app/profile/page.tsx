import type { Metadata } from "next";
import { ProfileClient } from "./ProfileClient";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Your one-sheet",
  description: "Your GIGWIRE one-sheet, application tracker and pinned nights.",
  alternates: { canonical: pageUrl("/profile") },
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
