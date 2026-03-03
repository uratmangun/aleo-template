const AKINDO_BASE_URL = "https://api.akindo.io/public";
const AKINDO_REVALIDATE_SECONDS = 60;
const MAX_PAGE_SIZE = 50;

type UnknownRecord = Record<string, unknown>;

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type PaginatedResult<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type AkindoWave = {
  id: string;
  waveHackId: string | null;
  waveCount: number;
  grantAmount: string | null;
  openedAt: string | null;
  startedAt: string | null;
  submissionDeadline: string | null;
  judgementDeadline: string | null;
  completedAt: string | null;
  nextWaveEnabled: boolean | null;
  totalSubmissionCount: number | null;
};

export type AkindoWaveHack = {
  id: string;
  title: string;
  tagline: string | null;
  description: string | null;
  communityName: string;
  isPublic: boolean | null;
  builderCount: number | null;
  firstWaveStartedAt: string | null;
  buildingDays: number | null;
  judgingDays: number | null;
  grantFixedAmount: string | null;
  communityUrl: string | null;
  githubRepoUrl: string | null;
  feePer: string | null;
  totalIdeas: number | null;
  totalProducts: number | null;
  tags: string[];
  activeWave: AkindoWave | null;
  latestWave: AkindoWave | null;
};

export type AkindoSubmission = {
  id: string;
  createdAt: string | null;
  waveId: string;
  waveCount: number | null;
  productId: string | null;
  comment: string | null;
  product: {
    id: string | null;
    name: string;
    tagline: string | null;
    deliverableUrl: string | null;
    githubRepositoryName: string | null;
    isPublic: boolean | null;
  };
};

export type WaveSubmissionCollection = {
  waves: AkindoWave[];
  submissions: AkindoSubmission[];
};

export class AkindoApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AkindoApiError";
    this.status = status;
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}

function readBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function parsePositiveInteger(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getPaginationParams(
  searchParams: URLSearchParams,
  defaults: { page: number; pageSize: number } = { page: 1, pageSize: 12 },
): { page: number; pageSize: number } {
  const page = parsePositiveInteger(searchParams.get("page"), defaults.page);
  const requestedPageSize = parsePositiveInteger(searchParams.get("pageSize"), defaults.pageSize);
  const pageSize = Math.min(MAX_PAGE_SIZE, requestedPageSize);

  return { page, pageSize };
}

export function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: items.slice(startIndex, endIndex),
    meta: {
      page: safePage,
      pageSize,
      totalItems,
      totalPages,
      hasPreviousPage: safePage > 1,
      hasNextPage: safePage < totalPages,
    },
  };
}

function dateToEpoch(isoDate: string | null): number {
  if (!isoDate) {
    return 0;
  }

  const parsed = Date.parse(isoDate);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function akindoFetch(path: string): Promise<unknown> {
  const response = await fetch(`${AKINDO_BASE_URL}${path}`, {
    next: { revalidate: AKINDO_REVALIDATE_SECONDS },
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new AkindoApiError(
      `Akindo request failed (${response.status}) for ${path}`,
      response.status,
    );
  }

  return response.json();
}

function parseWave(input: unknown, context: string): AkindoWave {
  if (!isRecord(input)) {
    throw new Error(`Invalid wave payload at ${context}: expected object.`);
  }

  if (typeof input.id !== "string") {
    throw new Error(`Invalid wave payload at ${context}: missing id.`);
  }

  if (typeof input.waveCount !== "number") {
    throw new Error(`Invalid wave payload at ${context}: missing waveCount.`);
  }

  return {
    id: input.id,
    waveHackId: readString(input.waveHackId),
    waveCount: input.waveCount,
    grantAmount: readString(input.grantAmount),
    openedAt: readString(input.openedAt),
    startedAt: readString(input.startedAt),
    submissionDeadline: readString(input.submissionDeadline),
    judgementDeadline: readString(input.judgementDeadline),
    completedAt: readString(input.completedAt),
    nextWaveEnabled: readBoolean(input.nextWaveEnabled),
    totalSubmissionCount: readNumber(input.totalSubmissionCount),
  };
}

function parseTags(rawTags: unknown): string[] {
  if (!Array.isArray(rawTags)) {
    return [];
  }

  const tags: string[] = [];

  for (const tagItem of rawTags) {
    if (!isRecord(tagItem)) {
      continue;
    }

    const nestedTag = isRecord(tagItem.tag) ? tagItem.tag : null;
    const name = nestedTag ? readString(nestedTag.name) : null;

    if (name) {
      tags.push(name);
    }
  }

  return tags;
}

function parseWaveHack(input: unknown, context: string): AkindoWaveHack {
  if (!isRecord(input)) {
    throw new Error(`Invalid wave-hack payload at ${context}: expected object.`);
  }

  if (typeof input.id !== "string") {
    throw new Error(`Invalid wave-hack payload at ${context}: missing id.`);
  }

  if (typeof input.title !== "string") {
    throw new Error(`Invalid wave-hack payload at ${context}: missing title.`);
  }

  const community = isRecord(input.community) ? input.community : null;
  const communityName = community ? readString(community.name) : null;

  const activeWave = isRecord(input.activeWave)
    ? parseWave(input.activeWave, `${context}.activeWave`)
    : null;

  const latestWave = isRecord(input.latestWave)
    ? parseWave(input.latestWave, `${context}.latestWave`)
    : null;

  return {
    id: input.id,
    title: input.title,
    tagline: readString(input.tagline),
    description: readString(input.description),
    communityName: communityName ?? "Unknown community",
    isPublic: readBoolean(input.isPublic),
    builderCount: readNumber(input.builderCount),
    firstWaveStartedAt: readString(input.firstWaveStartedAt),
    buildingDays: readNumber(input.buildingDays),
    judgingDays: readNumber(input.judgingDays),
    grantFixedAmount: readString(input.grantFixedAmount),
    communityUrl: readString(input.communityUrl),
    githubRepoUrl: readString(input.githubRepoUrl),
    feePer: readString(input.feePer),
    totalIdeas: readNumber(input.totalIdeas),
    totalProducts: readNumber(input.totalProducts),
    tags: parseTags(input.waveHackTags),
    activeWave,
    latestWave,
  };
}

function parseWaveHackPage(payload: unknown, page: number): { items: AkindoWaveHack[]; totalPages: number } {
  if (!isRecord(payload)) {
    throw new Error(`Invalid wave-hacks page ${page}: expected object response.`);
  }

  const rawItems = payload.items;
  if (!Array.isArray(rawItems)) {
    throw new Error(`Invalid wave-hacks page ${page}: missing items array.`);
  }

  const items = rawItems.map((item, index) =>
    parseWaveHack(item, `page-${page}.items[${index}]`),
  );

  const meta = isRecord(payload.meta) ? payload.meta : null;
  const totalPages = meta ? readNumber(meta.totalPages) : null;

  return {
    items,
    totalPages: totalPages && totalPages > 0 ? totalPages : page,
  };
}

function parseSubmission(input: unknown, wave: AkindoWave, index: number): AkindoSubmission {
  if (!isRecord(input)) {
    throw new Error(`Invalid submission at wave ${wave.id}, index ${index}: expected object.`);
  }

  if (typeof input.id !== "string") {
    throw new Error(`Invalid submission at wave ${wave.id}, index ${index}: missing id.`);
  }

  const product = isRecord(input.product) ? input.product : null;

  return {
    id: input.id,
    createdAt: readString(input.createdAt),
    waveId: readString(input.waveId) ?? wave.id,
    waveCount: wave.waveCount,
    productId: readString(input.productId),
    comment: readString(input.comment),
    product: {
      id: product ? readString(product.id) : null,
      name: (product ? readString(product.name) : null) ?? "Unknown product",
      tagline: product ? readString(product.tagline) : null,
      deliverableUrl: product ? readString(product.deliverableUrl) : null,
      githubRepositoryName: product ? readString(product.githubRepositoryName) : null,
      isPublic: product ? readBoolean(product.isPublic) : null,
    },
  };
}

function parseSubmissionsEnvelope(payload: unknown, wave: AkindoWave): AkindoSubmission[] {
  if (!isRecord(payload)) {
    throw new Error(`Invalid submissions response for wave ${wave.id}: expected object.`);
  }

  const submissions = payload.submissions;
  if (!Array.isArray(submissions)) {
    throw new Error(`Invalid submissions response for wave ${wave.id}: missing submissions array.`);
  }

  return submissions.map((submission, index) => parseSubmission(submission, wave, index));
}

export function isWaveHackActive(waveHack: AkindoWaveHack): boolean {
  if (!waveHack.activeWave) {
    return false;
  }

  return waveHack.activeWave.completedAt === null;
}

export function sortWaveHacksForDisplay(waveHacks: AkindoWaveHack[]): AkindoWaveHack[] {
  return [...waveHacks].sort((left, right) => {
    const activePriority = Number(isWaveHackActive(right)) - Number(isWaveHackActive(left));
    if (activePriority !== 0) {
      return activePriority;
    }

    const rightDate = dateToEpoch(right.activeWave?.startedAt ?? right.firstWaveStartedAt);
    const leftDate = dateToEpoch(left.activeWave?.startedAt ?? left.firstWaveStartedAt);

    return rightDate - leftDate;
  });
}

export async function fetchAllWaveHacks(): Promise<AkindoWaveHack[]> {
  const byId = new Map<string, AkindoWaveHack>();

  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const payload = await akindoFetch(`/wave-hacks?page=${currentPage}`);
    const parsedPage = parseWaveHackPage(payload, currentPage);

    totalPages = parsedPage.totalPages;

    for (const waveHack of parsedPage.items) {
      if (!byId.has(waveHack.id)) {
        byId.set(waveHack.id, waveHack);
      }
    }

    currentPage += 1;
  }

  return sortWaveHacksForDisplay([...byId.values()]);
}

export async function fetchWaveHackDetail(waveHackId: string): Promise<AkindoWaveHack> {
  const payload = await akindoFetch(`/wave-hacks/${waveHackId}`);
  return parseWaveHack(payload, `wave-hacks/${waveHackId}`);
}

export async function fetchWaveTimeline(waveHackId: string): Promise<AkindoWave[]> {
  const payload = await akindoFetch(`/wave-hacks/${waveHackId}/waves`);

  if (!Array.isArray(payload)) {
    throw new Error(`Invalid wave timeline for ${waveHackId}: expected array.`);
  }

  const parsedWaves = payload.map((wave, index) =>
    parseWave(wave, `wave-hacks/${waveHackId}/waves[${index}]`),
  );

  return parsedWaves.sort((left, right) => right.waveCount - left.waveCount);
}

export async function fetchWaveHackSubmissions(
  waveHackId: string,
  waveId?: string,
): Promise<WaveSubmissionCollection> {
  const timeline = await fetchWaveTimeline(waveHackId);
  const targetWaves = waveId ? timeline.filter((wave) => wave.id === waveId) : timeline;

  if (waveId && targetWaves.length === 0) {
    throw new AkindoApiError(`Wave ${waveId} not found for ${waveHackId}.`, 404);
  }

  const submissionsByWave = await Promise.all(
    targetWaves.map(async (wave) => {
      const payload = await akindoFetch(`/wave-hacks/${waveHackId}/waves/${wave.id}/submissions`);
      return parseSubmissionsEnvelope(payload, wave);
    }),
  );

  const submissions = submissionsByWave
    .flat()
    .sort((left, right) => dateToEpoch(right.createdAt) - dateToEpoch(left.createdAt));

  return {
    waves: timeline,
    submissions,
  };
}
