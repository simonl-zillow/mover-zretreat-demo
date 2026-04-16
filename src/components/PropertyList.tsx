import { PropertyListing } from '../../lib/types/types.ts';
import PropertyCard from './PropertyCard.tsx';
import { ToggleId } from '../lifestyleData';

interface PropertyListProps {
  listings: PropertyListing[];
  onSelect?: (id: string) => void;
  activeToggles?: Set<ToggleId>;
}

export default function PropertyList({ listings, onSelect, activeToggles = new Set() }: PropertyListProps) {
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{ marginBottom: '1rem', color: 'var(--miami-ink-secondary)' }}>
        {listings.length} result{listings.length !== 1 ? 's' : ''}
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
        }}
      >
        {listings.map((listing, i) => (
          <PropertyCard
            key={listing.id}
            listing={listing}
            onSelect={onSelect}
            activeToggles={activeToggles}
            isFirst={i === 0}
          />
        ))}
      </div>
    </div>
  );
}
