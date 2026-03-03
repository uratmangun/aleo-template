import { NextResponse } from "next/server";
import {
  AkindoApiError,
  fetchWaveHackSubmissions,
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
    const { page, pageSize } = getPaginationParams(searchParams, { page: 1, pageSize: 10 });

    const waveId = searchParams.get("waveId") ?? undefined;
    const search = searchParams.get("search")?.trim() ?? "";
    const normalizedSearch = search.toLowerCase();

    const submissionCollection = await fetchWaveHackSubmissions(waveHackId, waveId);

    const filteredSubmissions = normalizedSearch
      ? submissionCollection.submissions.filter((submission) => {
          const haystack = [
            submission.product.name,
            submission.product.tagline,
            submission.comment,
            submission.product.githubRepositoryName,
            submission.product.deliverableUrl,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return haystack.includes(normalizedSearch);
        })
      : submissionCollection.submissions;

    const paginatedSubmissions = paginate(filteredSubmissions, page, pageSize);

    return NextResponse.json({
      waveHackId,
      selectedWaveId: waveId ?? null,
      search,
      availableWaves: submissionCollection.waves,
      ...paginatedSubmissions,
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
            : "Unexpected error while loading submissions.",
      },
      { status: 500 },
    );
  }
}
