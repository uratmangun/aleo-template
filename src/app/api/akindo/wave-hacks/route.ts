import { NextRequest, NextResponse } from "next/server";
import {
  AkindoApiError,
  fetchAllWaveHacks,
  getPaginationParams,
  isWaveHackActive,
  paginate,
} from "@/lib/akindo";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize } = getPaginationParams(searchParams, { page: 1, pageSize: 12 });

    const filter = searchParams.get("filter") ?? "all";

    const waveHacks = await fetchAllWaveHacks();
    const filteredWaveHacks =
      filter === "active"
        ? waveHacks.filter((waveHack) => isWaveHackActive(waveHack))
        : waveHacks;

    const paginated = paginate(filteredWaveHacks, page, pageSize);

    return NextResponse.json({
      filter,
      ...paginated,
    });
  } catch (error) {
    if (error instanceof AkindoApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected error while loading wave-hacks.",
      },
      { status: 500 },
    );
  }
}
