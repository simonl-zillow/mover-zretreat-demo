/**
 * WHERE HOME DATA COMES FROM (the main fork in the road)
 * Workshop Stage 3 — switchboard between UI and data (Stages 4–5 flip mock vs live via VITE_DATA_MODE).
 *
 * Flow in plain language:
 *   Screen (App)  →  asks this file for search / detail
 *                         ↓
 *                   Are we in mock or live mode?  (`VITE_DATA_MODE` in .env)
 *                         ↓
 *                   mock  → read JSON from disk (`sampleHomesApi` + fixtures), then shape it like a real API
 *                   live  → `fetch` to `/api/propertysearch` (Vite proxies that to your backend—see vite.config)
 *                         ↓
 *                   List: always run through `homesListFromSearch` so cards look the same either way.
 *
 * If you’re lost in the codebase, start here, then open `sampleHomesApi.ts` (fake) or `livePropertyApi.ts` (real).
 */
import type { PropertyListing } from '../types/types.ts';
import { mapSearchResultsToListings } from './homesListFromSearch.ts';
import { liveLookupProperty, liveSearchProperties, LIVE_PROPERTY_API_PATH } from './livePropertyApi.ts';
import {
  getMockLookupResponse,
  getMockSearchResponse,
  mockDelay,
} from '../mock/sampleHomesApi.ts';

export type DataMode = 'mock' | 'live';

/** `live` only if `.env` has exactly VITE_DATA_MODE=live. Anything else (or missing) = mock = safe default for class. */
export function getDataMode(): DataMode {
  return import.meta.env.VITE_DATA_MODE === 'live' ? 'live' : 'mock';
}

export interface SearchOutcome {
  listings: PropertyListing[];
  error?: string;
}

export interface LookupOutcome {
  detail: Record<string, unknown> | null;
  error?: string;
}

/** Called when the user runs a search. Mock = no internet; live = POST to proxy. */
export async function adapterSearchProperties(query: string): Promise<SearchOutcome> {
  if (getDataMode() === 'mock') {
    await mockDelay();
    const data = getMockSearchResponse(query);
    return { listings: mapSearchResultsToListings(data) };
  }
  return liveSearchProperties(query);
}

/** Called when the user taps a card. Mock looks up the same zpid in the JSON file; live asks the server. */
export async function adapterLookupProperty(zpid: string): Promise<LookupOutcome> {
  if (getDataMode() === 'mock') {
    await mockDelay(120);
    const data = getMockLookupResponse(zpid);
    const first = data.lookupResults[0];
    return { detail: first ? (first as unknown as Record<string, unknown>) : null };
  }
  return liveLookupProperty(zpid);
}

/** Text for the “Data source / API details” panel on the detail screen. */
export function getAdapterEndpointDocs(): {
  mode: DataMode;
  searchUrl: string;
  searchAction: string;
  lookupAction: string;
} {
  return {
    mode: getDataMode(),
    searchUrl:
      getDataMode() === 'live'
        ? LIVE_PROPERTY_API_PATH
        : '(no network — lib/mock/sampleHomesApi.ts + fixtures)',
    searchAction: '/api/public/v2/mobile-search/homes/search',
    lookupAction: '/api/public/v2/mobile-search/homes/lookup',
  };
}
