/**
 * LIVE NETWORK PATH (only used when VITE_DATA_MODE=live)
 *
 * DATA FLOW:
 * 1. We POST JSON to `/api/propertysearch` (same origin in the browser).
 * 2. Vite’s dev server (see vite.config) forwards that to your real backend URL from .env—
 *    the browser never sees your secret host name in bundled code.
 * 3. Search uses one `action` string in the body; detail/lookup uses another.
 * 4. Search responses are passed to `homesListFromSearch` so the grid matches mock mode.
 */
import type { PropertyListing } from '../types/types.ts';
import { PropertyQueryParser } from '../service/queryParser.ts';
import { mapSearchResultsToListings } from './homesListFromSearch.ts';

const queryParser = new PropertyQueryParser();

/** Always this path in the browser; Vite rewrites it to your server. */
export const LIVE_PROPERTY_API_PATH = '/api/propertysearch';

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  seattle: { lat: 47.6062, lng: -122.3321 },
  miami: { lat: 25.7617, lng: -80.1918 },
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  burbank: { lat: 34.1808, lng: -118.309 },
  chicago: { lat: 41.8781, lng: -87.6298 },
  austin: { lat: 30.2672, lng: -97.7431 },
  denver: { lat: 39.7392, lng: -104.9903 },
  boston: { lat: 42.3601, lng: -71.0589 },
  'new york': { lat: 40.7128, lng: -74.006 },
  phoenix: { lat: 33.4484, lng: -112.074 },
  portland: { lat: 45.5152, lng: -122.6784 },
  dallas: { lat: 32.7767, lng: -96.797 },
  houston: { lat: 29.7604, lng: -95.3698 },
  atlanta: { lat: 33.749, lng: -84.388 },
  nashville: { lat: 36.1627, lng: -86.7816 },
  'san diego': { lat: 32.7157, lng: -117.1611 },
  tampa: { lat: 27.9506, lng: -82.4572 },
  orlando: { lat: 28.5383, lng: -81.3792 },
  charlotte: { lat: 35.2271, lng: -80.8431 },
};

function getCoordsForQuery(query: string): { lat: number; lng: number } {
  const q = query.toLowerCase();
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (q.includes(city)) return coords;
  }
  return CITY_COORDS.seattle;
}

export async function liveSearchProperties(
  query: string,
  apiUrl: string = LIVE_PROPERTY_API_PATH
): Promise<{ listings: PropertyListing[]; error?: string }> {
  try {
    let parsed: Record<string, unknown>;
    try {
      parsed = (await queryParser.parseQuery(query)) as Record<string, unknown>;
    } catch {
      parsed = {};
    }

    const coords = getCoordsForQuery(query);

    // This payload mirrors what this repo already used with the propertysearch proxy.
    const body: Record<string, unknown> = {
      regionParameters: {
        boundaries: {
          northLatitude: coords.lat + 0.1,
          eastLongitude: coords.lng + 0.1,
          southLatitude: coords.lat - 0.1,
          westLongitude: coords.lng - 0.1,
        },
      },
      paging: { pageNumber: 1, pageSize: 100 },
      homeStatuses: parsed.homeStatuses ?? ['fsbo', 'fsba', 'comingSoon', 'newConstruction'],
      homeTypes: parsed.homeTypes ?? ['singleFamily', 'condo', 'townhome', 'multiFamily'],
      sortOrder: 'relevance',
      sortAscending: false,
      listingCategoryFilter: 'all',
      action: '/api/public/v2/mobile-search/homes/search',
    };

    if (parsed.priceRange) body.priceRange = parsed.priceRange;
    if (parsed.bedroomsRange) body.bedroomsRange = parsed.bedroomsRange;
    if (parsed.bathroomsRange) body.bathroomsRange = parsed.bathroomsRange;
    if (Array.isArray(parsed.keywords) && parsed.keywords.length)
      body.keywords = (parsed.keywords as string[]).join(' ');

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { listings: [], error: `API ${resp.status}: ${text.slice(0, 200)}` };
    }

    const data = await resp.json();
    const listings = mapSearchResultsToListings(data);
    return { listings };
  } catch (err) {
    return { listings: [], error: err instanceof Error ? err.message : String(err) };
  }
}

export async function liveLookupProperty(
  zpid: string,
  apiUrl: string = LIVE_PROPERTY_API_PATH
): Promise<{ detail: Record<string, unknown> | null; error?: string }> {
  // Different `action` than search — same URL, server branches on the body.
  const body = {
    propertyIds: [Number(zpid)],
    sortOrder: 'relevance',
    sortAscending: false,
    listingCategoryFilter: 'all',
    action: '/api/public/v2/mobile-search/homes/lookup',
  };

  try {
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { detail: null, error: `API ${resp.status}: ${text.slice(0, 200)}` };
    }

    const data = await resp.json();
    const lookupResults: unknown[] = data.lookupResults ?? [];
    if (lookupResults.length > 0) {
      return { detail: lookupResults[0] as Record<string, unknown> };
    }

    const searchResults = (data.searchResults ?? []) as Array<Record<string, unknown>>;
    const withProp = searchResults.find((r) => r.property != null) as { property?: unknown } | undefined;
    const fromSearch = withProp?.property ?? searchResults[0];
    if (fromSearch) return { detail: fromSearch as Record<string, unknown> };

    return { detail: data as Record<string, unknown> };
  } catch (err) {
    return { detail: null, error: err instanceof Error ? err.message : String(err) };
  }
}
