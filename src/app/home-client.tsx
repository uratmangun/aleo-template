"use client";

import { useEffect, useRef, useState } from "react";

const TEMPLATE_REPO = "uratmangun/vinext-template";

const SELECT_ARROW_STYLE = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='%2371717a'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Cpolyline%20points='6%209%2012%2015%2018%209'%3E%3C/polyline%3E%3C/svg%3E\")",
  backgroundPosition: "right 0.75rem center",
  backgroundRepeat: "no-repeat",
} as const;

type Visibility = "public" | "private";

export default function HomeClient() {
  const [repoNameInput, setRepoNameInput] = useState("my-new-repo");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const hasSpaces = repoNameInput.includes(" ");

  const safeRepoName = repoNameInput.trim() || "my-new-repo";
  const command = `gh repo create ${safeRepoName} --template ${TEMPLATE_REPO} --${visibility} --clone`;

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setShowToast(true);

      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }

      resetTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2000);
    } catch {
      setCopied(false);
      setShowToast(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 px-8 py-10 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[20%] top-[20%] h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute left-[80%] top-[80%] h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <main className="w-full max-w-2xl space-y-7">
        <header className="space-y-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
              aria-hidden
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            VINEXT Template
          </span>

          <h1 className="bg-gradient-to-br from-zinc-950 to-zinc-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-zinc-50 dark:to-zinc-400">
            Clone this template
          </h1>

          <p className="text-base text-zinc-600 dark:text-zinc-400">
            Use the GitHub CLI to create a new repository from this template:
          </p>
        </header>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex-1 space-y-1.5">
              <input
                type="text"
                value={repoNameInput}
                onChange={(event) => setRepoNameInput(event.target.value)}
                placeholder="Repository name"
                autoComplete="off"
                className={`w-full rounded-lg border bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 shadow-xs outline-none transition-all dark:bg-zinc-900 dark:text-zinc-50 ${
                  hasSpaces
                    ? "border-amber-500/80 focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20"
                    : "border-zinc-300 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/20 dark:border-zinc-700"
                }`}
                aria-invalid={hasSpaces}
                aria-describedby="repo-name-error"
              />

              <p
                id="repo-name-error"
                className={`text-xs text-amber-600 transition-opacity dark:text-amber-400 ${
                  hasSpaces ? "opacity-100" : "opacity-0"
                }`}
              >
                Repository names cannot contain spaces. Use hyphens instead.
              </p>
            </div>

            <select
              value={visibility}
              onChange={(event) => setVisibility(event.target.value as Visibility)}
              style={SELECT_ARROW_STYLE}
              className="w-full cursor-pointer appearance-none rounded-lg border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 pr-10 text-sm text-zinc-900 shadow-xs outline-none transition-all focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 sm:w-auto sm:min-w-[120px]"
              aria-label="Repository visibility"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </section>

        <div className="relative overflow-hidden rounded-xl bg-zinc-900 p-4 shadow-md dark:bg-zinc-800">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-500 to-cyan-500" />

          <code className="block break-all pr-14 font-mono text-sm leading-6 text-emerald-400">
            {command}
          </code>

          <button
            type="button"
            onClick={copyToClipboard}
            className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
            aria-label="Copy command"
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-emerald-400"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            )}
          </button>
        </div>

        <section className="space-y-3">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Options:</p>
          <ul className="space-y-2 pl-2">
            <li className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="text-emerald-500">•</span>
              <code className="rounded bg-zinc-200 px-2 py-0.5 font-mono text-xs text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                --public
              </code>
              <span className="text-zinc-500 dark:text-zinc-400">— Create a public repository</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="text-emerald-500">•</span>
              <code className="rounded bg-zinc-200 px-2 py-0.5 font-mono text-xs text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                --private
              </code>
              <span className="text-zinc-500 dark:text-zinc-400">— Create a private repository</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="text-emerald-500">•</span>
              <code className="rounded bg-zinc-200 px-2 py-0.5 font-mono text-xs text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                --clone
              </code>
              <span className="text-zinc-500 dark:text-zinc-400">— Clone the new repository locally</span>
            </li>
          </ul>
        </section>

        <footer className="flex justify-center gap-5 border-t border-zinc-300 pt-4 dark:border-zinc-700">
          <a
            href="https://github.com/uratmangun/vinext-template"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
          </a>

          <a
            href="https://cli.github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            Get GitHub CLI
          </a>
        </footer>
      </main>

      <div
        className={`fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-zinc-900 px-5 py-3 text-sm text-zinc-100 shadow-lg transition-all duration-300 dark:bg-zinc-800 ${
          showToast ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4.5 w-4.5 text-emerald-400"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>Command copied to clipboard!</span>
      </div>
    </div>
  );
}
