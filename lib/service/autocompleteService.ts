import {
  ZillowAutocompleteResponse,
  ZillowAutocompleteResult,
  LocationData
} from '../types/types';

export class AutocompleteService {
  private readonly baseUrl = '/api/autocomplete';
  private readonly timeout = 5000; // 5 second timeout

  /**
   * Search for location suggestions using Zillow's autocomplete API
   */
  async searchLocations(query: string): Promise<LocationData[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    try {
      const url = `${this.baseUrl}?q=${encodeURIComponent(query.trim())}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`Autocomplete API returned ${response.status}: ${response.statusText}`);
        return [];
      }

      const data: ZillowAutocompleteResponse = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        console.warn('Invalid response format from autocomplete API');
        return [];
      }

      return this.transformResults(data.results);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Autocomplete request timed out');
      } else {
        console.warn('Error fetching autocomplete suggestions:', error);
      }
      return [];
    }
  }

  /**
   * Get the best location match for a query
   */
  async getBestLocationMatch(query: string): Promise<LocationData | null> {
    const results = await this.searchLocations(query);
    
    if (results.length === 0) {
      return null;
    }

    // Prioritize exact matches first
    const exactMatch = results.find(result => 
      result.display.toLowerCase() === query.toLowerCase()
    );
    
    if (exactMatch) {
      return exactMatch;
    }

    // Then prioritize regions over addresses for broader searches
    const regionMatch = results.find(result => result.regionType);
    if (regionMatch) {
      return regionMatch;
    }

    // Fall back to first result
    return results[0];
  }

  /**
   * Transform API results to our internal LocationData format
   */
  private transformResults(results: ZillowAutocompleteResult[]): LocationData[] {
    return results.map(result => {
      const locationData: LocationData = {
        display: result.display,
        coordinates: {
          lat: result.metaData.lat,
          lng: result.metaData.lng
        }
      };

      if (result.resultType === 'Region') {
        locationData.regionId = result.metaData.regionId;
        locationData.regionType = result.metaData.regionType;
      } else if (result.resultType === 'Address') {
        locationData.zpid = result.metaData.zpid;
        locationData.addressType = result.metaData.addressType;
        // Preserve address components for clean address formatting
        locationData.streetNumber = result.metaData.streetNumber;
        locationData.streetName = result.metaData.streetName;
        locationData.city = result.metaData.city;
        locationData.state = result.metaData.state;
        locationData.zipCode = result.metaData.zipCode;
      }

      return locationData;
    });
  }

  /**
   * Build a clean street address from location data (without business name)
   * Returns format like: "761 N 1st St, Burbank, CA 91502"
   */
  getCleanAddress(locationData: LocationData): string {
    // If it has address components, build from those (no business name)
    if (locationData.streetNumber && locationData.streetName && locationData.city && locationData.state) {
      const parts = [
        `${locationData.streetNumber} ${locationData.streetName}`,
        locationData.city,
        locationData.state
      ];
      if (locationData.zipCode) {
        parts.push(locationData.zipCode);
      }
      return parts.join(', ');
    }

    // Fall back to display if no components (e.g., for regions)
    return locationData.display;
  }

  /**
   * Check if a query looks like it needs location autocomplete
   */
  shouldUseAutocomplete(query: string): boolean {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Skip if query is too short
    if (normalizedQuery.length < 2) {
      return false;
    }

    // Skip if query looks like it's just numbers (price, bedrooms, etc.)
    // But allow ZIP codes (5 digits)
    if (/^\d+[\d\s\-,]*$/.test(normalizedQuery) && !/^\d{5}$/.test(normalizedQuery)) {
      return false;
    }

    // Use autocomplete if query contains location indicators
    const locationIndicators = [
      'in ', 'near ', 'around ', 'close to ', 'at ',
      ', ca', ', ny', ', tx', ', fl', // state abbreviations
      /\b\d{5}\b/, // ZIP codes
    ];

    for (const indicator of locationIndicators) {
      if (typeof indicator === 'string') {
        if (normalizedQuery.includes(indicator)) {
          return true;
        }
      } else if (indicator instanceof RegExp) {
        if (indicator.test(normalizedQuery)) {
          return true;
        }
      }
    }

    // Use autocomplete for common city names or if query looks like a place
    const commonPlaceWords = [
      'city', 'town', 'county', 'district', 'neighborhood', 'area',
      'street', 'avenue', 'road', 'drive', 'boulevard', 'lane',
      'san', 'los', 'new', 'north', 'south', 'east', 'west'
    ];

    return commonPlaceWords.some(word => normalizedQuery.includes(word));
  }
}

export default AutocompleteService;
