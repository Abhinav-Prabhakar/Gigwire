import type { Metadata } from "next";
import { PostClient } from "./PostClient";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Post a vacancy",
  description:
    "Post a live music vacancy on GIGWIRE: date, set lengths, pay, backline, curfew and exactly who's missing. Free for rooms, 0% commission.",
  alternates: { canonical: pageUrl("/post") },
};

export default function PostPage() {
  return <PostClient />;
}
