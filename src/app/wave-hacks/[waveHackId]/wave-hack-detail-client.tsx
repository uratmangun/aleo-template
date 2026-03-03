"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useMemo, useState } from "react";

type Wave = {
  id: string;
  waveCount: number;
  openedAt: string | null;
  startedAt: string | null;
  submissionDeadline: string | null;
  judgementDeadline: string | null;
  completedAt: string | null;
  totalSubmissionCount: number | null;
  grantAmount: string | null;
};

type WaveHackDetail = {
  id: string;
  title: string;
  tagline: string | null;
  description: string | null;
  communityName: string;
  tags: string[];
  builderCount: number | null;
  activeWave: Wave | null;
  latestWave: Wave | null;
};

type WaveHackDetailResponse = {
  waveHack: WaveHackDetail;
};

type TimelineResponse = {
  waveHackId: string;
  items: Wave[];
  meta: {
    page: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
};

type Submission = {
  id: string;
  createdAt: string | null;
  waveId: string;
  waveCount: number | null;
  comment: string | null;
  product: {
    name: string;
    tagline: string | null;
    deliverableUrl: string | null;
    githubRepositoryName: string | null;
  };
};

type SubmissionsResponse = {
  waveHackId: string;
  selectedWaveId: string | null;
  search: string;
  availableWaves: Wave[];
  items: Submission[];
  meta: {
    page: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    totalItems: number;
  };
};

function formatDateLabel(isoDate: string | null): string {
  if (!isoDate) {
    return "N/A";
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export default function WaveHackDetailClient({ waveHackId }: { waveHackId: string }) {
  const [detail, setDetail] = useState<WaveHackDetail | null>(null);
  const [timelinePage, setTimelinePage] = useState(1);
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [selectedWaveId, setSelectedWaveId] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [timelineData, setTimelineData] = useState<TimelineResponse | null>(null);
  const [submissionsData, setSubmissionsData] = useState<SubmissionsResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const detailResponse = await fetch(`/api/akindo/wave-hacks/${waveHackId}`, {
          cache: "no-store",
        });

        if (!detailResponse.ok) {
          throw new Error(`Failed to load wave-hack detail (${detailResponse.status})`);
        }

        const detailPayload = (await detailResponse.json()) as WaveHackDetailResponse;

        const timelineParams = new URLSearchParams({
          page: String(timelinePage),
          pageSize: "4",
        });

        const timelineResponse = await fetch(
          `/api/akindo/wave-hacks/${waveHackId}/timeline?${timelineParams.toString()}`,
          {
            cache: "no-store",
          },
        );

        if (!timelineResponse.ok) {
          throw new Error(`Failed to load timeline (${timelineResponse.status})`);
        }

        const timelinePayload = (await timelineResponse.json()) as TimelineResponse;

        const submissionsParams = new URLSearchParams({
          page: String(submissionsPage),
          pageSize: "8",
        });

        if (selectedWaveId !== "all") {
          submissionsParams.set("waveId", selectedWaveId);
        }

        if (searchQuery.trim()) {
          submissionsParams.set("search", searchQuery.trim());
        }

        const submissionsResponse = await fetch(
          `/api/akindo/wave-hacks/${waveHackId}/submissions?${submissionsParams.toString()}`,
          {
            cache: "no-store",
          },
        );

        if (!submissionsResponse.ok) {
          throw new Error(`Failed to load submissions (${submissionsResponse.status})`);
        }

        const submissionsPayload = (await submissionsResponse.json()) as SubmissionsResponse;

        if (!active) {
          return;
        }

        setDetail(detailPayload.waveHack);
        setTimelineData(timelinePayload);
        setSubmissionsData(submissionsPayload);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Unknown error");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [waveHackId, timelinePage, submissionsPage, selectedWaveId, searchQuery]);

  const availableWaves = submissionsData?.availableWaves ?? [];

  const selectedWaveLabel = useMemo(() => {
    if (selectedWaveId === "all") {
      return "All waves";
    }

    const matchedWave = availableWaves.find((wave) => wave.id === selectedWaveId);
    return matchedWave ? `Wave #${matchedWave.waveCount}` : "Selected wave";
  }, [availableWaves, selectedWaveId]);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <main className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/wave-hacks"
            className="inline-flex items-center rounded-md border border-sky-300 px-3 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-50 dark:border-sky-700 dark:text-sky-300 dark:hover:bg-sky-950/30"
          >
            ← Back to wave-hacks
          </Link>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{waveHackId}</p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            Loading wave-hack detail…
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        {!loading && !error && detail ? (
          <>
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    detail.activeWave?.completedAt === null
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {detail.activeWave?.completedAt === null ? "Active" : "Inactive"}
                </span>

                <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                  {detail.communityName}
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight">{detail.title}</h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                {detail.tagline ?? "No tagline"}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {detail.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid gap-3 text-sm md:grid-cols-2">
                <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                  <p className="text-zinc-500 dark:text-zinc-400">Builders</p>
                  <p className="mt-1 text-lg font-semibold">{detail.builderCount ?? "N/A"}</p>
                </div>

                <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                  <p className="text-zinc-500 dark:text-zinc-400">Current active wave</p>
                  <p className="mt-1 text-lg font-semibold">
                    {detail.activeWave ? `#${detail.activeWave.waveCount}` : "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Description
                </h2>
                {detail.description?.trim() ? (
                  <div className="prose prose-zinc max-w-none text-sm dark:prose-invert prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-a:text-sky-700 dark:prose-a:text-sky-300 prose-img:rounded-md prose-img:border prose-img:border-zinc-200 dark:prose-img:border-zinc-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {detail.description.trim()}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    No description provided.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Timeline</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Page {timelineData?.meta.page ?? 1} / {timelineData?.meta.totalPages ?? 1}
                </p>
              </div>

              <div className="space-y-3">
                {timelineData?.items.map((wave) => (
                  <article
                    key={wave.id}
                    className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    <h3 className="text-sm font-semibold">Wave #{wave.waveCount}</h3>
                    <dl className="mt-2 grid gap-1 text-sm text-zinc-600 dark:text-zinc-300 md:grid-cols-2">
                      <div className="flex justify-between gap-2 md:block">
                        <dt className="text-zinc-500 dark:text-zinc-400">Opened</dt>
                        <dd>{formatDateLabel(wave.openedAt)}</dd>
                      </div>
                      <div className="flex justify-between gap-2 md:block">
                        <dt className="text-zinc-500 dark:text-zinc-400">Started</dt>
                        <dd>{formatDateLabel(wave.startedAt)}</dd>
                      </div>
                      <div className="flex justify-between gap-2 md:block">
                        <dt className="text-zinc-500 dark:text-zinc-400">Submission deadline</dt>
                        <dd>{formatDateLabel(wave.submissionDeadline)}</dd>
                      </div>
                      <div className="flex justify-between gap-2 md:block">
                        <dt className="text-zinc-500 dark:text-zinc-400">Judgement deadline</dt>
                        <dd>{formatDateLabel(wave.judgementDeadline)}</dd>
                      </div>
                      <div className="flex justify-between gap-2 md:block">
                        <dt className="text-zinc-500 dark:text-zinc-400">Completed</dt>
                        <dd>{formatDateLabel(wave.completedAt)}</dd>
                      </div>
                      <div className="flex justify-between gap-2 md:block">
                        <dt className="text-zinc-500 dark:text-zinc-400">Submissions</dt>
                        <dd>{wave.totalSubmissionCount ?? "N/A"}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTimelinePage((current) => Math.max(1, current - 1))}
                  disabled={!timelineData?.meta.hasPreviousPage}
                  className="rounded-md border border-sky-300 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400 dark:border-sky-700 dark:text-sky-300 dark:hover:bg-sky-950/30 dark:disabled:border-zinc-800 dark:disabled:text-zinc-600"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => setTimelinePage((current) => current + 1)}
                  disabled={!timelineData?.meta.hasNextPage}
                  className="rounded-md border border-sky-300 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400 dark:border-sky-700 dark:text-sky-300 dark:hover:bg-sky-950/30 dark:disabled:border-zinc-800 dark:disabled:text-zinc-600"
                >
                  Next
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Submissions</h2>
                <div className="flex items-center gap-2">
                  <label htmlFor="wave-filter" className="text-sm text-zinc-600 dark:text-zinc-300">
                    Wave
                  </label>
                  <select
                    id="wave-filter"
                    value={selectedWaveId}
                    onChange={(event) => {
                      setSelectedWaveId(event.target.value);
                      setSubmissionsPage(1);
                    }}
                    className="rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-800 outline-none ring-sky-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  >
                    <option value="all">All waves</option>
                    {availableWaves.map((wave) => (
                      <option key={wave.id} value={wave.id}>
                        Wave #{wave.waveCount}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <form
                className="mb-4 flex flex-wrap items-center gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSearchQuery(searchInput.trim());
                  setSubmissionsPage(1);
                }}
              >
                <label htmlFor="submission-search" className="text-sm text-zinc-600 dark:text-zinc-300">
                  Search
                </label>
                <input
                  id="submission-search"
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search by product name"
                  className="min-w-[220px] flex-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-800 outline-none ring-sky-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <button
                  type="submit"
                  className="rounded-md bg-sky-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-sky-700"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchQuery("");
                    setSubmissionsPage(1);
                  }}
                  disabled={!searchInput && !searchQuery}
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:disabled:text-zinc-600"
                >
                  Clear
                </button>
              </form>

              <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                Showing {selectedWaveLabel} · {submissionsData?.meta.totalItems ?? 0} submissions
                {searchQuery ? ` · Search: "${searchQuery}"` : ""}
              </p>

              <div className="space-y-3">
                {submissionsData?.items.map((submission) => (
                  <article
                    key={submission.id}
                    className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold">{submission.product.name}</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300">
                          {submission.product.tagline ?? "No tagline"}
                        </p>
                      </div>

                      <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                        Wave #{submission.waveCount ?? "?"}
                      </span>
                    </div>

                    <dl className="mt-3 grid gap-1 text-sm text-zinc-600 dark:text-zinc-300 md:grid-cols-2">
                      <div className="flex justify-between gap-2 md:block">
                        <dt className="text-zinc-500 dark:text-zinc-400">Created</dt>
                        <dd>{formatDateLabel(submission.createdAt)}</dd>
                      </div>
                      <div className="flex justify-between gap-2 md:block">
                        <dt className="text-zinc-500 dark:text-zinc-400">Repository</dt>
                        <dd>{submission.product.githubRepositoryName ?? "N/A"}</dd>
                      </div>
                    </dl>

                    {submission.comment ? (
                      <p className="mt-3 whitespace-pre-wrap break-words rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {submission.comment}
                      </p>
                    ) : null}

                    {submission.product.deliverableUrl ? (
                      <a
                        href={submission.product.deliverableUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center text-sm font-medium text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200"
                      >
                        Open deliverable ↗
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>

              {submissionsData?.items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-300">
                  No submissions found for this filter.
                </div>
              ) : null}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubmissionsPage((current) => Math.max(1, current - 1))}
                  disabled={!submissionsData?.meta.hasPreviousPage}
                  className="rounded-md border border-sky-300 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400 dark:border-sky-700 dark:text-sky-300 dark:hover:bg-sky-950/30 dark:disabled:border-zinc-800 dark:disabled:text-zinc-600"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => setSubmissionsPage((current) => current + 1)}
                  disabled={!submissionsData?.meta.hasNextPage}
                  className="rounded-md border border-sky-300 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400 dark:border-sky-700 dark:text-sky-300 dark:hover:bg-sky-950/30 dark:disabled:border-zinc-800 dark:disabled:text-zinc-600"
                >
                  Next
                </button>
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
