import { LocationData } from '../types/types';

/**
 * Parsed search query structure
 */
export interface ParsedSearchQuery {
  location?: string;
  coordinates?: { lat: number; lng: number };
  bounds?: {
    northLatitude: number;
    eastLongitude: number;
    southLatitude: number;
    westLongitude: number;
  };
  homeStatuses?: string[];
  homeTypes?: string[];
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
  keywords?: string[];
  investmentCriteria?: {
    isInvestmentSearch: boolean;
  };
}

/**
 * Simple query parser that extracts search criteria from natural language queries
 */
export class PropertyQueryParser {
  /**
   * Parse a natural language query into structured search parameters
   */
  async parseQuery(query: string, location?: string): Promise<ParsedSearchQuery> {
    const queryLower = query.toLowerCase();
    const parsed: ParsedSearchQuery = {
      location
    };

    // Detect home statuses from query
    if (queryLower.includes('rent') || queryLower.includes('rental')) {
      parsed.homeStatuses = ['forRent'];
    } else if (queryLower.includes('foreclos') || queryLower.includes('distressed')) {
      parsed.homeStatuses = ['foreclosed', 'foreclosure', 'preforeclosure'];
    } else if (queryLower.includes('new construct')) {
      parsed.homeStatuses = ['newConstruction'];
    } else if (queryLower.includes('coming soon')) {
      parsed.homeStatuses = ['comingSoon'];
    } else if (queryLower.includes('sale') || queryLower.includes('buy')) {
      parsed.homeStatuses = ['fsbo', 'fsba', 'comingSoon', 'newConstruction'];
    }

    // Detect investment search
    if (queryLower.includes('investment') || queryLower.includes('invest')) {
      parsed.investmentCriteria = { isInvestmentSearch: true };
    }

    // Extract price range
    const priceMatch = queryLower.match(/\$?([\d,]+)\s*k?(?:\s*-\s*\$?([\d,]+)\s*k?)?/);
    if (priceMatch) {
      const val1 = parseInt(priceMatch[1].replace(/,/g, ''));
      const val2 = priceMatch[2] ? parseInt(priceMatch[2].replace(/,/g, '')) : undefined;

      if (!isNaN(val1)) {
        const mult1 = queryLower.includes(`${val1}k`) ? 1000 : 1;
        const mult2 = val2 && queryLower.includes(`${val2}k`) ? 1000 : 1;
        const amount1 = val1 * mult1;
        const amount2 = val2 && !isNaN(val2) ? val2 * mult2 : undefined;

        const isMaxQuery = /(?:under|below|less than|up to|max|at most|no more than)\s/.test(queryLower);

        if (amount2 !== undefined) {
          parsed.priceRange = { min: amount1, max: amount2 };
        } else if (isMaxQuery) {
          parsed.priceRange = { max: amount1 };
        } else {
          parsed.priceRange = { min: amount1 };
        }
      }
    }

    // Extract bedroom range
    const bedroomMatch = queryLower.match(/(\d+)\+?\s*(?:bed|br|bedroom)/);
    if (bedroomMatch) {
      parsed.bedroomsRange = {
        min: parseInt(bedroomMatch[1])
      };
    }

    // Extract bathroom range
    const bathroomMatch = queryLower.match(/(\d+(?:\.\d+)?)\+?\s*(?:bath|ba|bathroom)/);
    if (bathroomMatch) {
      parsed.bathroomsRange = {
        min: parseFloat(bathroomMatch[1])
      };
    }

    // Extract home types
    const homeTypes: string[] = [];
    if (queryLower.includes('condo')) homeTypes.push('condo');
    if (queryLower.includes('townhome') || queryLower.includes('townhouse')) homeTypes.push('townhome');
    if (queryLower.includes('single family') || queryLower.includes('house')) homeTypes.push('singleFamily');
    if (queryLower.includes('multi family') || queryLower.includes('multifamily')) homeTypes.push('multiFamily');
    if (queryLower.includes('apartment')) homeTypes.push('apartment');

    if (homeTypes.length > 0) {
      parsed.homeTypes = homeTypes;
    }

    // Extract keywords (simple approach - words that might be features or neighborhoods)
    const keywordPatterns = [
      'pool', 'garage', 'yard', 'view', 'waterfront', 'updated', 'remodeled',
      'fireplace', 'hardwood', 'granite', 'stainless', 'balcony', 'patio'
    ];

    const foundKeywords = keywordPatterns.filter(keyword => queryLower.includes(keyword));
    if (foundKeywords.length > 0) {
      parsed.keywords = foundKeywords;
    }

    return parsed;
  }
}
