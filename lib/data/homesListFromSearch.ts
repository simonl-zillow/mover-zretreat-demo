import type { PropertyListing } from '../types/types.ts';

/**
 * DATA FLOW (search results → what you see in the grid)
 *
 * 1. Both mock and live modes eventually give us a JSON object with a `searchResults` array.
 * 2. Each item can be a “property row” (`resultType === 'property'`) with a nested `property` object.
 * 3. This file turns each nested `property` into a flat `PropertyListing` that `PropertyCard` understands
 *    (id, address string, price, photos, lat/long for filtering, etc.).
 *
 * If a home disappears from the list but the network response looks fine, check the final `.filter`:
 * listings with no latitude/longitude are dropped on purpose.
 */
export function mapSearchResultsToListings(data: { searchResults?: unknown[] }): PropertyListing[] {
  const results: any[] = data.searchResults ?? [];

  return results
    .filter((r) => r.resultType === 'property' && r.property)
    .map((r) => {
      const p = r.property;
      const a = p.address;
      const primaryImg =
        p.media?.propertyPhotoLinks?.mediumSizeLink ?? p.media?.propertyPhotoLinks?.defaultLink;

      const photos: string[] = [];
      if (Array.isArray(p.media?.photos)) {
        for (const photo of p.media.photos) {
          const url = photo?.mediumSizeLink ?? photo?.url ?? photo?.defaultLink;
          if (url) photos.push(url);
        }
      }
      if (Array.isArray(p.media?.allPhotos)) {
        for (const photo of p.media.allPhotos) {
          const url = photo?.mediumSizeLink ?? photo?.url ?? photo?.defaultLink;
          if (url && !photos.includes(url)) photos.push(url);
        }
      }
      if (photos.length === 0 && primaryImg) photos.push(primaryImg);

      return {
        id: String(p.zpid),
        address: `${a.streetAddress}, ${a.city}, ${a.state} ${a.zipcode}`,
        price: p.price?.value ?? 0,
        bedrooms: p.bedrooms ?? 0,
        bathrooms: p.bathrooms ?? 0,
        sqft: p.livingArea ?? 0,
        latitude: p.location?.latitude ?? 0,
        longitude: p.location?.longitude ?? 0,
        imageUrl: primaryImg,
        imageUrls: photos.slice(0, 5),
        listingStatus: p.listing?.listingStatus,
        homeType: p.propertyType,
      } satisfies PropertyListing;
    })
    .filter((l) => l.latitude !== 0 && l.longitude !== 0);
}
