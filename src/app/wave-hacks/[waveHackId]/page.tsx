import type { Metadata } from "next";
import WaveHackDetailClient from "@/app/wave-hacks/[waveHackId]/wave-hack-detail-client";

type WaveHackDetailPageProps = {
  params: Promise<{ waveHackId: string }>;
};

export const metadata: Metadata = {
  title: "Wave-hack detail",
  description: "Timeline and submissions for selected wave-hack.",
};

export default async function WaveHackDetailPage({ params }: WaveHackDetailPageProps) {
  const { waveHackId } = await params;

  return <WaveHackDetailClient waveHackId={waveHackId} />;
}
