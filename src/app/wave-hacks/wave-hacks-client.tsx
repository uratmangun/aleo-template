"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 12;

type WaveHackListItem = {
  id: string;
  title: string;
  tagline: string | null;
  description: string | null;
  communityName: string;
  builderCount: number | null;
  tags: string[];
  activeWave: {
    waveCount: number;
    startedAt: string | null;
    submissionDeadline: string | null;
    completedAt: string | null;
  } | null;
};

type WaveHackListResponse = {
  filter: string;
  items: WaveHackListItem[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
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

export default function WaveHacksClient() {
  const [filter, setFilter] = useState<"all" | "active">("active");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<WaveHackListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(PAGE_SIZE),
          filter,
        });

        const response = await fetch(`/api/akindo/wave-hacks?${params.toString()}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to load wave-hacks (${response.status})`);
        }

        const payload = (await response.json()) as WaveHackListResponse;

        if (!active) {
          return;
        }

        setData(payload);
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
  }, [filter, page]);

  const pageMeta = data?.meta;

  const totalLabel = useMemo(() => {
    if (!pageMeta) {
      return "Loading…";
    }

    return `${pageMeta.totalItems} total`;
  }, [pageMeta]);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <main className="mx-auto w-full max-w-6xl space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
            Internal Akindo Dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Wave-hacks</h1>
          <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
            Data is served from Next.js API routes. Filter for active wave-hacks and open details for submissions and timeline.
          </p>

          <div className="inline-flex rounded-lg border border-sky-200 bg-white p-1 shadow-sm dark:border-sky-900/70 dark:bg-zinc-900">
            {([
              { value: "all", label: "All wave-hacks" },
              { value: "active", label: "Active only" },
            ] as const).map((option) => {
              const active = filter === option.value;

              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => {
                    setFilter(option.value);
                    setPage(1);
                  }}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-sky-600 text-white"
                      : "text-zinc-600 hover:bg-sky-50 hover:text-sky-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-sky-300"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <span className="font-medium">Current view:</span> {filter === "active" ? "Active" : "All"} · {totalLabel}
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            Loading wave-hacks…
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        {!loading && !error ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data?.items.map((waveHack) => {
              const isActive = waveHack.activeWave?.completedAt === null;

              return (
                <article
                  key={waveHack.id}
                  className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-sky-700"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{waveHack.id}</span>
                  </div>

                  <h2 className="text-lg font-semibold leading-tight">{waveHack.title}</h2>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    {waveHack.tagline ?? "No tagline"}
                  </p>

                  <dl className="mt-4 space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
                    <div className="flex justify-between gap-2">
                      <dt>Community</dt>
                      <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                        {waveHack.communityName}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt>Builders</dt>
                      <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                        {waveHack.builderCount ?? "N/A"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt>Active wave</dt>
                      <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                        {waveHack.activeWave ? `#${waveHack.activeWave.waveCount}` : "N/A"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt>Submission deadline</dt>
                      <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                        {formatDateLabel(waveHack.activeWave?.submissionDeadline ?? null)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {waveHack.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5">
                    <Link
                      href={`/wave-hacks/${waveHack.id}`}
                      className="inline-flex items-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                    >
                      View detail
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        ) : null}

        {!loading && !error && data?.items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            No wave-hacks found for this filter.
          </div>
        ) : null}

        {!loading && !error && pageMeta ? (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Page <span className="font-semibold">{pageMeta.page}</span> of{" "}
              <span className="font-semibold">{pageMeta.totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                disabled={!pageMeta.hasPreviousPage}
                className="rounded-md border border-sky-300 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400 dark:border-sky-700 dark:text-sky-300 dark:hover:bg-sky-950/30 dark:disabled:border-zinc-800 dark:disabled:text-zinc-600"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={!pageMeta.hasNextPage}
                className="rounded-md border border-sky-300 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400 dark:border-sky-700 dark:text-sky-300 dark:hover:bg-sky-950/30 dark:disabled:border-zinc-800 dark:disabled:text-zinc-600"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
