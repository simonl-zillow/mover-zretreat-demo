/**
 * POI (Point of Interest) Discovery Service
 *
 * Discovers POIs matching user preferences (coffee shops, parks, gyms, etc.)
 * Uses GPT to identify top locations in a given area
 */

import { POI, POISearchRequest, POISearchResult } from '../types/softPreferences';
import { conversation } from '../ai';

/**
 * Discover POIs matching a category in a location
 * Uses GPT to identify real, popular locations with lat/lng
 */
export async function discoverPOIs(request: POISearchRequest): Promise<POISearchResult> {
  try {
    console.log('🗺️ Discovering POIs:', request);

    const { category, location, latitude, longitude, radius = 5000, limit = 5 } = request;

    const prompt = `You are a local POI (Point of Interest) discovery service. Find the top ${limit} ${category} locations in ${location} that are GEOGRAPHICALLY DISTRIBUTED across the area.

Search Parameters:
- Category: ${category}
- Location: ${location}
${latitude && longitude ? `- Center: ${latitude}, ${longitude}` : ''}
- Search Radius: ${radius} meters (${(radius / 1609.34).toFixed(1)} miles)
- Limit: ${limit} results

Your task:
1. Identify the top ${limit} most popular/relevant ${category} locations in ${location}
2. **CRITICAL**: Choose locations that are SPREAD OUT geographically across ${location}, NOT clustered in one area
3. Ensure coordinates are ACCURATE and DIVERSE - locations should be at least 0.5 miles (0.008 degrees) apart
4. Provide accurate names, addresses, and real coordinates for actual businesses
5. Focus on well-known, highly-rated establishments in different neighborhoods

Return format (ONLY valid JSON, no markdown):
{
  "pois": [
    {
      "name": "Blue Bottle Coffee",
      "category": "${category}",
      "latitude": 34.1808,
      "longitude": -118.3090,
      "address": "123 Main St, Burbank, CA 91502"
    },
    {
      "name": "Starbucks Reserve",
      "category": "${category}",
      "latitude": 34.1950,
      "longitude": -118.3200,
      "address": "456 Oak Ave, Burbank, CA 91505"
    }
  ],
  "category": "${category}",
  "searchLocation": "${location}",
  "totalFound": 5
}

CRITICAL REQUIREMENTS:
- Return REAL businesses with ACCURATE coordinates (use your knowledge of actual locations)
- Coordinates MUST be geographically diverse - if all POIs have similar lat/lng (within 0.003 degrees), you've failed
- Include POIs from DIFFERENT neighborhoods/areas of ${location}
- Example: For Burbank, include locations in Downtown Burbank, Magnolia Park, Toluca Lake area, etc.
- Each POI should be at least 0.5 miles apart from others
- Include full street addresses for verification

Category mapping examples:
- "coffee" → coffee shops, cafes (Starbucks, Blue Bottle, local cafes)
- "parks" → public parks, green spaces
- "gym" → gyms, fitness centers
- "restaurants" → restaurants, dining
- "schools" → schools, educational institutions
- "groceries" → grocery stores, supermarkets

Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text.`;

    const conversationResponse = await conversation([
      {
        role: 'system',
        content: 'You are a POI discovery API with knowledge of real businesses and locations. Return ONLY valid JSON with no markdown formatting or additional text. Use your knowledge of actual businesses and their locations.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], {
      model: 'gpt-4o-mini',
      temperature: 0.3, // Slightly higher for variety in results
      response_format: { type: 'json_object' }
    });

    console.log('🤖 POI discovery response:', conversationResponse);

    // Extract content from response
    const responseData = conversationResponse.data;
    let responseContent: string;

    if (typeof responseData === 'string') {
      responseContent = responseData;
    } else if (responseData.content) {
      responseContent = responseData.content;
    } else if (responseData.choices && responseData.choices[0]?.message?.content) {
      responseContent = responseData.choices[0].message.content;
    } else {
      console.log('❌ Unable to extract content from response:', responseData);
      throw new Error('Failed to extract content from POI discovery response');
    }

    // Parse the response
    let result: POISearchResult;
    try {
      // Clean the response
      let cleanedResponse = responseContent.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Try to extract JSON from the response
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = JSON.parse(cleanedResponse);
      }
    } catch (parseError) {
      console.log('❌ Failed to parse POI discovery response:', parseError);
      console.log('Raw response content:', responseContent);
      throw new Error('Failed to parse POI discovery JSON response');
    }

    // Validate the result
    if (!result.pois || !Array.isArray(result.pois)) {
      console.log('❌ Invalid POI result format:', result);
      throw new Error('Invalid POI discovery result format');
    }

    // Validate each POI
    result.pois = result.pois.filter(poi => {
      const isValid = poi.name &&
                     typeof poi.latitude === 'number' &&
                     typeof poi.longitude === 'number';
      if (!isValid) {
        console.log('⚠️ Skipping invalid POI:', poi);
      }
      return isValid;
    });

    // Check if POIs are too clustered (warning only)
    if (result.pois.length > 1) {
      let maxDistance = 0;
      for (let i = 0; i < result.pois.length; i++) {
        for (let j = i + 1; j < result.pois.length; j++) {
          const distance = calculateDistance(
            result.pois[i].latitude,
            result.pois[i].longitude,
            result.pois[j].latitude,
            result.pois[j].longitude
          );
          maxDistance = Math.max(maxDistance, distance);
        }
      }

      const maxDistanceMiles = metersToMiles(maxDistance);
      if (maxDistanceMiles < 0.3) {
        console.log('⚠️ WARNING: POIs are too clustered! Max distance between POIs:', maxDistanceMiles.toFixed(2), 'miles');
        console.log('   This suggests the AI may have returned inaccurate coordinates.');
      } else {
        console.log('✓ POIs are well distributed. Max distance:', maxDistanceMiles.toFixed(2), 'miles');
      }
    }

    console.log('✅ POI discovery successful:', {
      category: result.category,
      location: result.searchLocation,
      count: result.pois.length,
      pois: result.pois.map(p => ({ name: p.name, lat: p.latitude, lng: p.longitude }))
    });

    return result;
  } catch (error) {
    console.log('❌ POI discovery error:', error);

    // Return empty result
    return {
      pois: [],
      category: request.category,
      searchLocation: request.location,
      totalFound: 0
    };
  }
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Convert meters to miles
 */
export function metersToMiles(meters: number): number {
  return meters / 1609.34;
}

/**
 * Find the nearest POI to a given point
 */
export function findNearestPOI(
  latitude: number,
  longitude: number,
  pois: POI[]
): { poi: POI; distance: number } | null {
  if (pois.length === 0) {
    return null;
  }

  let nearestPOI = pois[0];
  let minDistance = calculateDistance(latitude, longitude, pois[0].latitude, pois[0].longitude);

  for (let i = 1; i < pois.length; i++) {
    const distance = calculateDistance(latitude, longitude, pois[i].latitude, pois[i].longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearestPOI = pois[i];
    }
  }

  return {
    poi: nearestPOI,
    distance: minDistance
  };
}

/**
 * Calculate average distance from a point to all POIs
 */
export function calculateAverageDistance(
  latitude: number,
  longitude: number,
  pois: POI[]
): number {
  if (pois.length === 0) {
    return Infinity;
  }

  const totalDistance = pois.reduce((sum, poi) => {
    return sum + calculateDistance(latitude, longitude, poi.latitude, poi.longitude);
  }, 0);

  return totalDistance / pois.length;
}

/**
 * Score a location's proximity to POIs (0-1, higher is better)
 * Based on distance to nearest POI
 */
export function calculateProximityScore(distanceMeters: number): number {
  // Score decreases with distance
  // 0m = 1.0, 500m = 0.5, 1000m+ = 0
  const maxDistance = 1000; // meters
  if (distanceMeters >= maxDistance) {
    return 0;
  }
  return 1 - (distanceMeters / maxDistance);
}
