const BaseUrl = "https://api.akindo.io/public";

type WaveHack = Record<string, unknown> & {
  id: string;
  title: string;
};

type WaveHacksResponse = {
  items: WaveHack[];
  meta: {
    totalPages: number;
    totalItems: number;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseWaveHacksResponse(payload: unknown, page: number): WaveHacksResponse {
  if (!isRecord(payload)) {
    throw new Error(`Invalid response shape on page ${page}: expected object.`);
  }

  const { items, meta } = payload;

  if (!Array.isArray(items)) {
    throw new Error(`Invalid response shape on page ${page}: expected items array.`);
  }

  if (!isRecord(meta)) {
    throw new Error(`Invalid response shape on page ${page}: expected meta object.`);
  }

  if (typeof meta.totalPages !== "number" || typeof meta.totalItems !== "number") {
    throw new Error(`Invalid response meta on page ${page}: missing totalPages/totalItems.`);
  }

  const parsedItems: WaveHack[] = items.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`Invalid wave-hack item at page ${page}, index ${index}: expected object.`);
    }

    if (typeof item.id !== "string" || typeof item.title !== "string") {
      throw new Error(
        `Invalid wave-hack item at page ${page}, index ${index}: missing id/title.`,
      );
    }

    return item as WaveHack;
  });

  return {
    items: parsedItems,
    meta: {
      totalPages: meta.totalPages,
      totalItems: meta.totalItems,
    },
  };
}

async function fetchWaveHacksPage(page: number): Promise<WaveHacksResponse> {
  const url = `${BaseUrl}/wave-hacks?page=${page}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch wave-hacks page ${page}: ${response.status} ${response.statusText}`);
  }

  const data: unknown = await response.json();
  return parseWaveHacksResponse(data, page);
}

function getStringField(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" ? value : null;
}

function getNumberField(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  return typeof value === "number" ? value : null;
}

function getCommunityName(waveHack: WaveHack): string {
  const community = waveHack.community;
  if (!isRecord(community)) {
    return "Unknown community";
  }

  const name = getStringField(community, "name");
  return name ?? "Unknown community";
}

function getWaveCountLabel(waveHack: WaveHack): string {
  const activeWave = waveHack.activeWave;
  if (isRecord(activeWave)) {
    const activeWaveCount = getNumberField(activeWave, "waveCount");
    if (activeWaveCount !== null) {
      return `active wave ${activeWaveCount}`;
    }
  }

  const latestWave = waveHack.latestWave;
  if (isRecord(latestWave)) {
    const latestWaveCount = getNumberField(latestWave, "waveCount");
    if (latestWaveCount !== null) {
      return `latest wave ${latestWaveCount}`;
    }
  }

  return "no wave info";
}

async function fetchAllWaveHacks(): Promise<WaveHack[]> {
  const allWaveHacks: WaveHack[] = [];

  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const pageData = await fetchWaveHacksPage(currentPage);

    totalPages = pageData.meta.totalPages;
    allWaveHacks.push(...pageData.items);

    console.log(
      `Fetched page ${currentPage}/${totalPages} (${pageData.items.length} wave-hacks, accumulated ${allWaveHacks.length}/${pageData.meta.totalItems}).`,
    );

    currentPage += 1;
  }

  return allWaveHacks;
}

async function main() {
  console.log("Fetching all public wave-hacks from Akindo...");

  const waveHacks = await fetchAllWaveHacks();

  if (process.argv.includes("--raw")) {
    console.log(JSON.stringify(waveHacks, null, 2));
    return;
  }

  console.log(`\nTotal wave-hacks fetched: ${waveHacks.length}`);
  console.log("\n--- Wave Hacks ---");

  for (const [index, waveHack] of waveHacks.entries()) {
    const tagline = getStringField(waveHack, "tagline") ?? "No tagline";
    const builderCount = getNumberField(waveHack, "builderCount") ?? 0;

    console.log(
      `${index + 1}. ${waveHack.title} (${waveHack.id})`,
    );
    console.log(`   Community: ${getCommunityName(waveHack)}`);
    console.log(`   Builders: ${builderCount}`);
    console.log(`   Wave: ${getWaveCountLabel(waveHack)}`);
    console.log(`   Tagline: ${tagline}`);
    console.log("");
  }
}

main().catch((error) => {
  console.error("Error fetching wave-hacks:", error);
  process.exitCode = 1;
});
