import { NextResponse } from "next/server";
import {
  AkindoApiError,
  fetchWaveTimeline,
  getPaginationParams,
  paginate,
} from "@/lib/akindo";

type RouteContext = {
  params: Promise<{ waveHackId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { waveHackId } = await context.params;
    const { searchParams } = new URL(request.url);
    const { page, pageSize } = getPaginationParams(searchParams, { page: 1, pageSize: 5 });

    const timeline = await fetchWaveTimeline(waveHackId);
    const paginated = paginate(timeline, page, pageSize);

    return NextResponse.json({
      waveHackId,
      ...paginated,
    });
  } catch (error) {
    if (error instanceof AkindoApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while loading timeline.",
      },
      { status: 500 },
    );
  }
}
