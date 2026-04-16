/**
 * SAMPLE HOMES (mock / “lesson” data)
 *
 * DATA FLOW:
 * - Real app: the server sends JSON shaped like `{ searchResults: [...] }` and `{ lookupResults: [...] }`.
 * - Workshop: we skip the network and build that same shape from `fixtures/properties.json`.
 *
 * So the rest of the app (list + detail) does not need to know the data is fake—it gets the same envelope.
 */
import propertiesFixture from './fixtures/properties.json';

/** One home row — same shape as `property` inside each search result. */
export type MockZillowProperty = (typeof propertiesFixture)[number];

export interface MockSearchApiResponse {
  searchResults: Array<{ resultType: string; property: MockZillowProperty }>;
}

export interface MockLookupApiResponse {
  lookupResults: MockZillowProperty[];
}

const MOCK_FIXTURE_PATH = 'lib/mock/fixtures/properties.json';

/** If the user types “miami”, we only show homes whose `address.city` is Miami (see JSON file). */
const QUERY_CITY_MAP: Record<string, string> = {
  miami: 'Miami',
  brickell: 'Miami',
  'coral way': 'Miami',
  wynwood: 'Miami',
  'south beach': 'Miami',
  'key biscayne': 'Miami',
  shenandoah: 'Miami',
  'south miami': 'Miami',
  'the roads': 'Miami',
  seattle: 'Miami',
  austin: 'Miami',
  denver: 'Miami',
  'san francisco': 'Miami',
  'los angeles': 'Miami',
  chicago: 'Miami',
  boston: 'Miami',
  phoenix: 'Miami',
  portland: 'Miami',
  dallas: 'Miami',
  houston: 'Miami',
  atlanta: 'Miami',
  nashville: 'Miami',
  'san diego': 'Miami',
  tampa: 'Miami',
  orlando: 'Miami',
  charlotte: 'Miami',
  'new york': 'Miami',
};

function propertiesMatchingQuery(query: string): MockZillowProperty[] {
  const q = query.toLowerCase();
  for (const [key, city] of Object.entries(QUERY_CITY_MAP)) {
    if (q.includes(key)) {
      return propertiesFixture.filter((p) => p.address.city === city);
    }
  }
  return [...propertiesFixture];
}

/** Pretend we called the real “search homes” endpoint; returns the same top-level keys. */
export function getMockSearchResponse(query: string): MockSearchApiResponse {
  const list = propertiesMatchingQuery(query);
  return {
    searchResults: list.map((property) => ({
      resultType: 'property',
      property,
    })),
  };
}

/** Pretend we called the real “lookup one home” endpoint. */
export function getMockLookupResponse(zpid: string): MockLookupApiResponse {
  const id = Number(zpid);
  const hit = propertiesFixture.find((p) => p.zpid === id);
  return { lookupResults: hit ? [hit] : [] };
}

/** Shown in the UI teaching panel so learners know which file to edit. */
export function getMockFixturePathForDocs(): string {
  return MOCK_FIXTURE_PATH;
}

/** Tiny pause so “Loading…” is visible in demos. */
export function mockDelay(ms = 180): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
