import { NextResponse } from "next/server";
import { AkindoApiError, fetchWaveHackDetail } from "@/lib/akindo";

type RouteContext = {
  params: Promise<{ waveHackId: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const { waveHackId } = await context.params;
    const waveHack = await fetchWaveHackDetail(waveHackId);

    return NextResponse.json({ waveHack });
  } catch (error) {
    if (error instanceof AkindoApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while loading wave-hack detail.",
      },
      { status: 500 },
    );
  }
}
