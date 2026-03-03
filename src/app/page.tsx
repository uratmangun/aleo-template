import type { Metadata } from "next";
import HomeClient from "@/app/home-client";

export const metadata: Metadata = {
  title: "AI IDE Template - Clone & Deploy",
  description:
    "AI IDE Template - A minimal template for AI-powered IDE projects. Clone this template using GitHub CLI to get started quickly.",
};

export default function HomePage() {
  return <HomeClient />;
}
