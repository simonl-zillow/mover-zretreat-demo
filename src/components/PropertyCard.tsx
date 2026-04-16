import { useState, useMemo } from 'react';
import { PropertyListing } from '../../lib/types/types.ts';
import { getLifestyleData, ACCENT_COLORS, type ToggleId } from '../lifestyleData';
import LifestylePills from './LifestylePills';
import NeighborhoodCard from './NeighborhoodCard';
import TrueCostPanel from './TrueCostPanel';

interface PropertyCardProps {
  listing: PropertyListing;
  onSelect?: (id: string) => void;
  activeToggles?: Set<ToggleId>;
  isFirst?: boolean;
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

function estimateMonthly(price: number): string {
  const downPayment = 0.20;
  const loanAmount = price * (1 - downPayment);
  const annualRate = 0.0685;
  const monthlyRate = annualRate / 12;
  const termMonths = 360; // 30 years

  // Principal & interest (standard amortization formula)
  const pi = monthlyRate > 0
    ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
    : loanAmount / termMonths;

  // Property tax (~1.1% of price annually)
  const tax = (price * 0.011) / 12;

  // Homeowners insurance (~0.35% of price annually)
  const insurance = (price * 0.0035) / 12;

  const total = pi + tax + insurance;
  if (total >= 1_000) return `$${(total / 1_000).toFixed(1)}k/mo`;
  return `$${Math.round(total)}/mo`;
}

function formatHomeType(type?: string): string {
  if (!type) return '';
  const map: Record<string, string> = {
    singleFamily: 'House for Sale',
    condo: 'Condo for Sale',
    townhome: 'Townhome for Sale',
    multiFamily: 'Multi-Family for Sale',
    apartment: 'Apartment for Rent',
  };
  return map[type] ?? type;
}

function HeartButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      style={{ display: 'flex', cursor: 'pointer', color: hovered ? 'var(--miami-coral)' : 'var(--miami-ink-secondary)', transition: 'color 0.15s' }}
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill={hovered ? 'var(--miami-coral)' : 'none'} stroke="currentColor" strokeWidth="2" style={{ transition: 'fill 0.15s' }}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </span>
  );
}

function MoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

const arrowStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 32,
  height: 32,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.9)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
  fontSize: 16,
  color: '#333',
  padding: 0,
};

function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const count = images.length;

  function prev(e: React.MouseEvent) {
    e.stopPropagation();
    setIndex((i) => (i - 1 + count) % count);
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation();
    setIndex((i) => (i + 1) % count);
  }

  return (
    <div
      style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={images[index]}
        alt={alt}
        style={{
          width: '100%',
          aspectRatio: '4 / 3',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Left arrow */}
      {hovered && count > 1 && index > 0 && (
        <button onClick={prev} style={{ ...arrowStyle, left: 8 }} aria-label="Previous photo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Right arrow */}
      {hovered && count > 1 && index < count - 1 && (
        <button onClick={next} style={{ ...arrowStyle, right: 8 }} aria-label="Next photo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Dots */}
      {count > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 5,
          }}
        >
          {images.map((_, i) => (
            <div
              key={i}
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: i === index ? '#fff' : 'rgba(255,255,255,0.45)',
                transition: 'background 0.15s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function parseAddressParts(address: string) {
  const parts = address.split(',').map(s => s.trim());
  if (parts.length >= 3) {
    const street = parts[0];
    const city = parts[1];
    const rest = parts.slice(2).join(', ');
    return { street, city, rest };
  }
  return { street: address, city: '', rest: '' };
}

function getToggleHighlight(listing: PropertyListing, lifestyle: ReturnType<typeof getLifestyleData>, activeToggles: Set<ToggleId>): string | null {
  if (activeToggles.size === 0) return null;

  const floodPill = lifestyle.pills.find(p => p.label.startsWith('Zone'));
  if (activeToggles.has('flood') && floodPill && floodPill.level !== 'green') {
    return ACCENT_COLORS[floodPill.level];
  }
  if (activeToggles.has('walkability')) {
    const walkPill = lifestyle.pills.find(p => p.label.startsWith('Walk:'));
    if (walkPill && walkPill.level === 'green') return ACCENT_COLORS.green;
  }
  if (activeToggles.has('building')) {
    const inspPill = lifestyle.pills.find(p => p.label.startsWith('Inspection:'));
    if (inspPill && inspPill.level !== 'green') return ACCENT_COLORS[inspPill.level];
  }
  return null;
}

export default function PropertyCard({ listing, onSelect, activeToggles = new Set(), isFirst = false }: PropertyCardProps) {
  const images = listing.imageUrls?.length ? listing.imageUrls : listing.imageUrl ? [listing.imageUrl] : [];
  const lifestyle = useMemo(() => getLifestyleData(listing.id, listing.price), [listing.id, listing.price]);
  const addrParts = useMemo(() => parseAddressParts(listing.address), [listing.address]);

  const accentColor = ACCENT_COLORS[lifestyle.confidenceLevel];
  const toggleHighlight = getToggleHighlight(listing, lifestyle, activeToggles);

  const statsSegments = [
    listing.bedrooms ? `${listing.bedrooms} bd` : null,
    listing.bathrooms ? `${listing.bathrooms} ba` : null,
    listing.sqft ? `${listing.sqft.toLocaleString()} sqft` : null,
    formatHomeType(listing.homeType) || null,
  ].filter(Boolean);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(listing.id)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(listing.id)}
      style={{
        cursor: 'pointer',
        position: 'relative',
        background: '#fff',
        borderRadius: 14,
        padding: 10,
        boxShadow: '0 1px 8px var(--miami-shadow-warm)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px var(--miami-shadow-warm-lg)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 8px var(--miami-shadow-warm)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {images.length > 0 ? (
        <ImageCarousel images={images} alt={listing.address} />
      ) : (
        <div
          style={{
            width: '100%',
            aspectRatio: '4 / 3',
            background: '#e0e0e0',
            borderRadius: 12,
          }}
        />
      )}

      <div style={{ padding: '10px 2px 0' }}>
        {/* Price row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ color: 'var(--miami-ink)', fontSize: '1.2rem', fontWeight: 400, fontFamily: 'var(--font-display)' }}>
              {formatPrice(listing.price)}
            </span>
            <span style={{ color: 'var(--miami-ink-secondary)', fontSize: '0.8rem' }}>
              {estimateMonthly(listing.price)}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, color: 'var(--miami-ink-secondary)' }}>
            <span style={{ display: 'flex', cursor: 'pointer' }} onClick={(e) => e.stopPropagation()}>
              <MoreIcon />
            </span>
            <HeartButton />
          </div>
        </div>

        {/* True cost panel */}
        <TrueCostPanel cost={lifestyle.trueCost} />

        {/* Stats row */}
        {statsSegments.length > 0 && (
          <div style={{ color: 'var(--miami-ink)', fontSize: '0.9rem', marginBottom: 4 }}>
            {statsSegments.join(' | ')}
          </div>
        )}

        {/* Lifestyle pills */}
        <LifestylePills pills={lifestyle.pills} />

        {/* Legend on first card */}
        {isFirst && (
          <div style={{ fontSize: 11, color: '#888', marginTop: 6, fontStyle: 'italic' }}>
            New: lifestyle &amp; risk data at a glance. Hover any pill for details.
          </div>
        )}

        {/* Address with hoverable neighborhood */}
        <div style={{ color: 'var(--miami-ink-secondary)', fontSize: '0.85rem', marginTop: 6 }}>
          {addrParts.street}
          {addrParts.city && (
            <>
              ,{' '}
              <NeighborhoodCard
                neighborhoodName={addrParts.city}
                narrative={lifestyle.neighborhood}
              >
                {addrParts.city}
              </NeighborhoodCard>
            </>
          )}
          {addrParts.rest && `, ${addrParts.rest}`}
        </div>
      </div>
    </div>
  );
}
