const BaseUrl = "https://api.akindo.io/public";
const DefaultWaveHackId = "X4ZV12Z6GSMEkmOkX";

type TimelineWave = {
  id: string;
  waveHackId: string;
  waveCount: number;
  grantAmount: string | null;
  openedAt: string | null;
  startedAt: string | null;
  submissionDeadline: string | null;
  judgementDeadline: string | null;
  completedAt: string | null;
  totalSubmissionCount: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readStringOrNull(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" ? value : null;
}

function readNumberOrNull(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  return typeof value === "number" ? value : null;
}

function parseTimelineWave(item: unknown, index: number): TimelineWave {
  if (!isRecord(item)) {
    throw new Error(`Invalid timeline entry at index ${index}: expected object.`);
  }

  if (typeof item.id !== "string") {
    throw new Error(`Invalid timeline entry at index ${index}: missing id.`);
  }

  if (typeof item.waveHackId !== "string") {
    throw new Error(`Invalid timeline entry at index ${index}: missing waveHackId.`);
  }

  if (typeof item.waveCount !== "number") {
    throw new Error(`Invalid timeline entry at index ${index}: missing waveCount.`);
  }

  return {
    id: item.id,
    waveHackId: item.waveHackId,
    waveCount: item.waveCount,
    grantAmount: readStringOrNull(item, "grantAmount"),
    openedAt: readStringOrNull(item, "openedAt"),
    startedAt: readStringOrNull(item, "startedAt"),
    submissionDeadline: readStringOrNull(item, "submissionDeadline"),
    judgementDeadline: readStringOrNull(item, "judgementDeadline"),
    completedAt: readStringOrNull(item, "completedAt"),
    totalSubmissionCount: readNumberOrNull(item, "totalSubmissionCount"),
  };
}

function parseTimelineResponse(payload: unknown): TimelineWave[] {
  if (!Array.isArray(payload)) {
    throw new Error("Invalid timeline response: expected array.");
  }

  return payload.map((item, index) => parseTimelineWave(item, index));
}

function formatDateLabel(isoDate: string | null): string {
  if (!isoDate) {
    return "N/A";
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return date.toISOString();
}

function getCliOptions() {
  const args = process.argv.slice(2);
  const raw = args.includes("--raw");
  const waveHackId = args.find((arg) => !arg.startsWith("-")) ?? DefaultWaveHackId;

  return { raw, waveHackId };
}

async function fetchTimeline(waveHackId: string): Promise<TimelineWave[]> {
  const url = `${BaseUrl}/wave-hacks/${waveHackId}/waves`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch wave timeline: ${response.status} ${response.statusText}`);
  }

  const data: unknown = await response.json();
  const timeline = parseTimelineResponse(data);

  return [...timeline].sort((a, b) => a.waveCount - b.waveCount);
}

async function main() {
  const { raw, waveHackId } = getCliOptions();

  console.log(`Fetching timeline for WaveHack: ${waveHackId}...`);

  const timeline = await fetchTimeline(waveHackId);

  console.log(`Found ${timeline.length} waves.`);

  if (raw) {
    console.log(JSON.stringify(timeline, null, 2));
    return;
  }

  console.log("\n--- Wave Timeline ---");

  for (const wave of timeline) {
    console.log(`Wave ${wave.waveCount} (${wave.id})`);
    console.log(`  Opened: ${formatDateLabel(wave.openedAt)}`);
    console.log(`  Started: ${formatDateLabel(wave.startedAt)}`);
    console.log(`  Submission Deadline: ${formatDateLabel(wave.submissionDeadline)}`);
    console.log(`  Judgement Deadline: ${formatDateLabel(wave.judgementDeadline)}`);
    console.log(`  Completed: ${formatDateLabel(wave.completedAt)}`);
    console.log(`  Total Submissions: ${wave.totalSubmissionCount ?? "N/A"}`);
    console.log(`  Grant Amount: ${wave.grantAmount ?? "N/A"}`);
    console.log("");
  }
}

main().catch((error) => {
  console.error("Error fetching wave timeline:", error);
  process.exitCode = 1;
});
