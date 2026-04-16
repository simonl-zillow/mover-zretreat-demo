# lib

Shared library for Zillow property search experiments. Provides services for natural language property search, location resolution, AI-powered neighborhood and POI discovery, and soft preference matching.

No platform dependencies — works in any browser or Node.js environment.

---

## Structure

```
lib/
├── ai.ts                        # AI conversation stub (replace with your API)
├── config.ts                    # Top-level config re-exports
├── service/
│   ├── config.ts                # API endpoints and chat defaults
│   ├── zillowApi.ts             # Core property search service
│   ├── poiService.ts            # POI discovery and proximity scoring
│   ├── queryParser.ts           # Natural language query parser
│   └── autocompleteService.ts   # Location autocomplete
└── types/
    ├── types.ts                 # Core property and search types
    └── softPreferences.ts       # POI and soft preference types
```

---

## Services

### `ai.ts` — AI Conversation Stub

A placeholder `conversation()` function that logs requests to the console and returns a stub response. **You must replace this with a real AI API** before the neighborhood discovery and POI features will work.

```ts
import { conversation } from './ai';

const response = await conversation(messages, { model: 'gpt-4o-mini', temperature: 0.3 });
// response.data is a string (plain text or JSON)
```

The function signature matches the OpenAI chat completions shape. An example OpenAI replacement is included in the file's JSDoc comment.

---

### `service/zillowApi.ts` — Property Search (`ZillowApiService`)

The main search service. Accepts natural language or structured requests and returns property listings.

**Key methods:**

| Method | Description |
|---|---|
| `searchProperties(request)` | Main entry point. Parses the query, picks a search strategy (standard / rental / investment), and fetches listings. |
| `analyzeNeighborhoods(request)` | Discovers neighborhoods in an area via AI, then searches each one in parallel and returns aggregate data. |
| `discoverNeighborhoodsWithGPT(center, location, exclude)` | Uses the AI conversation stub to get a list of neighborhood names and center coordinates for a given area. |
| `searchNearPOIs(request, softPreferences)` | Searches around a set of POIs, deduplicates results across all search points, and ranks properties by proximity score. |
| `lookupPropertyByZPID(zpid)` | Fetch a single property's details by Zillow property ID. |

Internally uses `PropertyQueryParser` to extract structured filters from a free-text query, and `AutocompleteService` to resolve location strings to coordinates.

---

### `service/poiService.ts` — POI Discovery & Proximity

Finds real Points of Interest (coffee shops, parks, gyms, etc.) in a given area using the AI conversation stub, and provides distance/scoring utilities.

**Exported functions:**

| Function | Description |
|---|---|
| `discoverPOIs(request)` | Calls the AI to find geographically distributed POIs for a category and location. Validates coordinates and warns if results are clustered. |
| `findNearestPOI(lat, lng, pois)` | Returns the closest POI to a point and its distance in meters. |
| `calculateProximityScore(distanceMeters)` | Maps distance to a 0–1 score. 0 m → 1.0, 1000 m+ → 0. |
| `calculateAverageDistance(lat, lng, pois)` | Mean distance from a point to all POIs in a set. |
| `calculateDistance(lat1, lng1, lat2, lng2)` | Haversine distance between two coordinates, in meters. |
| `metersToMiles(meters)` | Unit conversion helper. |

---

### `service/queryParser.ts` — Natural Language Parser (`PropertyQueryParser`)

Extracts structured search parameters from a free-text query string via regex. No AI required.

```ts
const parser = new PropertyQueryParser();
const parsed = await parser.parseQuery('3+ bed condo under $800k near downtown');
// { homeTypes: ['condo'], bedroomsRange: { min: 3 }, priceRange: { max: 800000 }, ... }
```

**Detects:**
- Listing type: for-rent, for-sale, foreclosure, new construction, coming soon
- Price ranges with `k`/`M` suffix support (`$500k–$1.2M`)
- Bedroom and bathroom counts (`3+ bed`, `2.5 bath`)
- Home types: condo, townhome, single family, multi-family, apartment
- Investment search intent
- Feature keywords: pool, garage, waterfront, fireplace, view, etc.

---

### `service/autocompleteService.ts` — Location Autocomplete (`AutocompleteService`)

Resolves location strings to coordinates and region metadata using Zillow's public autocomplete API.

```ts
const svc = new AutocompleteService();
const location = await svc.getBestLocationMatch('Burbank, CA');
// { display: 'Burbank, CA', coordinates: { lat: 34.18, lng: -118.31 }, regionId: ..., ... }
```

**Key methods:**

| Method | Description |
|---|---|
| `searchLocations(query)` | Returns up to N location suggestions with coordinates and region metadata. |
| `getBestLocationMatch(query)` | Returns the single best match, preferring exact matches then regions over individual addresses. |
| `getCleanAddress(locationData)` | Formats a street-level address from location components, omitting any business name prefix. |
| `shouldUseAutocomplete(query)` | Heuristic to decide whether a query string looks like a location (vs. a filter-only query like "3 bed under $500k"). |

---

### `service/config.ts` — Configuration

```ts
import { apiConfig, chatConfig } from './config';
```

| Export | Description |
|---|---|
| `apiConfig.zillowApiUrl` | Supabase edge function endpoint for property search |
| `apiConfig.clientId` | Client identifier sent with API requests |
| `apiConfig.timeout` | Request timeout in ms (default 10 000) |
| `chatConfig.conversationModel` | Default AI model (`gpt-4`) |
| `chatConfig.maxMessages` | Max messages kept in conversation history |
| `chatConfig.maxContextProperties` | Max properties included in AI context |

---

## AI Dependency

Two services require an AI model:

- `discoverNeighborhoodsWithGPT` in `zillowApi.ts` — neighborhood name + coordinate discovery
- `discoverPOIs` in `poiService.ts` — POI name + coordinate discovery

Both call `conversation()` from `ai.ts`. The stub logs the prompt and returns an empty response. Replace the function body in `ai.ts` with a call to your preferred model (OpenAI, Anthropic, etc.) — see the inline example in that file.
