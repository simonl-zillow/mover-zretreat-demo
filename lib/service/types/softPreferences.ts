/**
 * Soft Preferences Types
 *
 * Defines types for soft search preferences that require multi-point searches
 * and result aggregation (e.g., "near coffee shops", "walkable neighborhood")
 */

export interface POI {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
  distance?: number; // Distance from search center in meters
}

export type SoftPreferenceType = 'poi' | 'lifestyle' | 'proximity';

export interface SoftPreference {
  type: SoftPreferenceType;
  description: string; // Original user description: "near coffee shops"
  category?: string; // Normalized category: "coffee", "parks", "gym"
  pois?: POI[]; // Discovered POIs matching this preference
  radius?: number; // Search radius around each POI in meters (default: 500)
  weight?: number; // Importance weight (0-1, default: 1)
}

export interface ParsedSearchQuery {
  // Location information
  location?: {
    name: string;
    latitude: number;
    longitude: number;
  };

  // Hard filters (map directly to Zillow API)
  hardFilters: {
    priceRange?: {
      min?: number;
      max?: number;
    };
    bedroomsRange?: {
      min?: number;
      max?: number;
    };
    bathroomsRange?: {
      min?: number;
      max?: number;
    };
    homeTypes?: string[];
    homeStatuses?: string[];
  };

  // Soft preferences (require POI discovery and multi-point search)
  softPreferences: SoftPreference[];

  // Original query
  originalQuery: string;

  // Confidence scores
  confidence?: {
    location: number;
    filters: number;
    softPreferences: number;
  };
}

export interface POISearchRequest {
  category: string; // "coffee", "parks", "gym", "restaurants"
  location: string; // "Burbank, CA"
  latitude?: number;
  longitude?: number;
  radius?: number; // Search radius in meters (default: 5000)
  limit?: number; // Max POIs to return (default: 5)
}

export interface POISearchResult {
  pois: POI[];
  category: string;
  searchLocation: string;
  totalFound: number;
}

export interface PropertyWithProximity {
  id: string;
  price: number;
  latitude: number;
  longitude: number;
  address?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  imageUrl?: string;

  // Proximity data
  proximityScores: {
    [preferenceDescription: string]: {
      nearestPOI: POI;
      distanceMeters: number;
      distanceMiles: number;
      score: number; // 0-1, closer = higher score
    };
  };

  // Overall soft preference match score
  softPreferenceScore?: number;
}
