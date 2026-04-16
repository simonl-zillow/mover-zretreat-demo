/**
 * Teaching copy: how each detail label maps to fields on the mobile-search property object.
 * Matches PropertyDetail.tsx fallbacks where multiple paths are tried.
 */
export const DETAIL_PAGE_FIELD_MAP: Array<{
  uiLabel: string;
  jsonPaths: string;
  notes?: string;
}> = [
  {
    uiLabel: 'Hero image',
    jsonPaths:
      'media.propertyPhotoLinks.highResLink → highResolutionLink → mediumSizeLink → defaultLink; fallback imgSrc / imageUrl',
  },
  { uiLabel: 'Price (large)', jsonPaths: 'price.value, or price when it is a number' },
  { uiLabel: 'Address line', jsonPaths: 'address.streetAddress, city, state, zipcode (or address string)' },
  { uiLabel: 'Beds / baths / sqft', jsonPaths: 'bedrooms, bathrooms, livingArea' },
  { uiLabel: 'Zestimate', jsonPaths: 'estimates.zestimate, or zestimate' },
  { uiLabel: 'Home type', jsonPaths: 'propertyType' },
  { uiLabel: 'Year built', jsonPaths: 'yearBuilt' },
  { uiLabel: 'Days on Zillow', jsonPaths: 'daysOnZillow' },
  { uiLabel: 'Lot size', jsonPaths: 'lotSizeWithUnit.lotSize, or lotSize' },
  { uiLabel: 'Status', jsonPaths: 'listing.listingStatus' },
  { uiLabel: 'Description', jsonPaths: 'description' },
  { uiLabel: 'Zillow link', jsonPaths: 'zpid or id → homedetails URL' },
];

/** How list cards are built from each search result row (see lib/data/homesListFromSearch.ts). */
export const LIST_CARD_FIELD_MAP: Array<{ uiLabel: string; jsonPaths: string }> = [
  { uiLabel: 'Card id', jsonPaths: 'property.zpid → string id' },
  { uiLabel: 'Address', jsonPaths: 'property.address → single line' },
  { uiLabel: 'Price', jsonPaths: 'property.price.value' },
  { uiLabel: 'Beds / baths / sqft', jsonPaths: 'property.bedrooms, bathrooms, livingArea' },
  { uiLabel: 'Map position', jsonPaths: 'property.location.latitude / longitude' },
  { uiLabel: 'Photos', jsonPaths: 'property.media.photos / allPhotos / propertyPhotoLinks' },
  { uiLabel: 'Home type chip', jsonPaths: 'property.propertyType' },
  { uiLabel: 'Listing status', jsonPaths: 'property.listing.listingStatus' },
];

/** Workshop Stage 2 & 6: the main fields the UI expects on each home (detail + list use the same JSON names). */
export const WORKSHOP_CORE_FIELDS: Array<{ uiLabel: string; jsonPath: string }> = [
  {
    uiLabel: 'Image',
    jsonPath:
      'media.propertyPhotoLinks (highResLink → highResolutionLink → mediumSizeLink → defaultLink)',
  },
  { uiLabel: 'Address', jsonPath: 'address.streetAddress, city, state, zipcode' },
  { uiLabel: 'Price', jsonPath: 'price.value (or price when it is a plain number)' },
  { uiLabel: 'Beds', jsonPath: 'bedrooms' },
  { uiLabel: 'Baths', jsonPath: 'bathrooms' },
  { uiLabel: 'Description', jsonPath: 'description' },
];
