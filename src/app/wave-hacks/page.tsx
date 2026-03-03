import type { Metadata } from "next";
import WaveHacksClient from "@/app/wave-hacks/wave-hacks-client";

export const metadata: Metadata = {
  title: "Wave-hacks",
  description: "Browse Akindo wave-hacks through internal API routes.",
};

export default function WaveHacksPage() {
  return <WaveHacksClient />;
}
