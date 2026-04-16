// ─── Autocomplete ────────────────────────────────────────────────────────────

export interface ZillowAutocompleteResult {
  display: string;
  resultType: 'Region' | 'Address';
  metaData: {
    lat: number;
    lng: number;
    regionId?: string;
    regionType?: string;
    zpid?: string;
    addressType?: string;
    streetNumber?: string;
    streetName?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

export interface ZillowAutocompleteResponse {
  results: ZillowAutocompleteResult[];
}

export interface LocationData {
  display: string;
  coordinates: { lat: number; lng: number };
  regionId?: string;
  regionType?: string;
  zpid?: string;
  addressType?: string;
  streetNumber?: string;
  streetName?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

// ─── ZG Property Search API ───────────────────────────────────────────────────

export interface ZGLatLong {
  latitude: number;
  longitude: number;
}

export interface ZGAddress {
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface ZGPhoto {
  url: string;
  caption?: string;
}

export interface ZGProperty {
  zpid: string;
  address: ZGAddress;
  latLong: ZGLatLong;
  price: number;
  bedrooms: number;
  bathrooms: number;
  homeType?: string;
  description?: string;
  photos?: ZGPhoto[];
}

export interface ZGSearchResponse {
  results?: ZGProperty[];
  // The API may wrap results in different shapes; handle both
  [key: string]: unknown;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchRequest {
  query: string;
  location?: string;
  bounds?: {
    northLatitude: number;
    southLatitude: number;
    eastLongitude: number;
    westLongitude: number;
  };
  neighborhoods?: string[];
  landmarks?: string[];
  home_features?: string[];
  neighborhood_features?: string[];
  budget?: number;
  adults?: number;
  kids?: number;
  anchor_location?: string;
  anchor_timeaway?: number;
  filters?: {
    priceRange?: { min?: number; max?: number };
    bedroomsRange?: { min?: number; max?: number };
    bathroomsRange?: { min?: number; max?: number };
  };
  property_type?: 'buy' | 'rent';
  sort_by?: string;
}

export interface PropertyListing {
  id: string;        // zpid
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  imageUrls?: string[];
  listingStatus?: string;
  marketingStatus?: string;
  pricePerSqft?: number;
  homeType?: string;
  description?: string;
}

export interface EnrichedLocationData {
  original: string;
  verified: LocationData | null;
}

export interface EnrichedSearchMetadata {
  processedFilters?: {
    budget?: number;
    familySize?: {
      adults: number;
      kids: number;
      total: number;
      recommendedBedrooms: number;
    };
    timeConstraints?: {
      anchor: string;
      maxMinutes: number;
    };
    features?: {
      home: string[];
      neighborhood: string[];
    };
  };
  neighborhoods?: EnrichedLocationData[];
  landmarks?: EnrichedLocationData[];
  anchor_location?: EnrichedLocationData;
}

export interface SearchResult {
  listings: PropertyListing[];
  totalCount: number;
  metadata?: EnrichedSearchMetadata;
}

// ─── Neighborhood Analysis ────────────────────────────────────────────────────

export interface NeighborhoodData {
  name: string;
  description?: string;
  priceRange?: string;
  thumbnailUrl?: string;
  verified: LocationData | null;
  propertyCount: number;
  topListings: PropertyListing[];
  averagePrice?: number;
  center?: { latitude: number; longitude: number };
}

export interface NeighborhoodAnalysisRequest {
  neighborhoods?: string[];
  centerPoint?: { latitude: number; longitude: number };
  location?: string;
  exclude?: string[];
  property_type?: 'buy' | 'rent';
  bedrooms?: number;
  bathrooms?: number;
  budget?: number;
  home_features?: string[];
  sort_by?: string;
}

export interface NeighborhoodAnalysisResult {
  neighborhoods: NeighborhoodData[];
  totalProperties: number;
  searchFilters: {
    budget?: number;
    property_type?: string;
    bedrooms?: number;
    bathrooms?: number;
    home_features?: string[];
    sort_by: string;
  };
}

// ─── GeoJSON ──────────────────────────────────────────────────────────────────

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}
