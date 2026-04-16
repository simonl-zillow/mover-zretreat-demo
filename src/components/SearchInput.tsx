import { useState, useRef } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  defaultQuery?: string;
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function SearchInput({ onSearch, onClear, disabled, defaultQuery }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      setCommittedQuery(trimmed);
      setQuery('');
      onSearch(trimmed);
    }
  }

  const hasText = query.trim().length > 0;

  function handleClear() {
    setCommittedQuery('');
    setQuery('');
    onClear?.();
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid var(--miami-border)',
        borderRadius: 24,
        padding: '6px 6px 6px 16px',
        background: '#fff',
        gap: 8,
        minHeight: 48,
        boxShadow: '0 2px 12px var(--miami-shadow-warm)',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      {committedQuery ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--miami-coral-soft)',
            borderRadius: 16,
            padding: '5px 8px 5px 12px',
            fontSize: '0.9rem',
            color: 'var(--miami-ink)',
            whiteSpace: 'nowrap',
          }}
        >
          <span>{committedQuery}</span>
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: 'none',
              background: 'var(--miami-coral)',
              cursor: 'pointer',
              padding: 0,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Brickell condos, Coral Way walkable, waterfront under $900k..."
            disabled={disabled}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.95rem',
              background: 'transparent',
              color: 'var(--miami-ink)',
              minWidth: 0,
            }}
          />
          <button
            type="submit"
            disabled={disabled || !query.trim()}
            aria-label="Search"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              height: 36,
              width: hasText ? 'auto' : 36,
              paddingLeft: hasText ? 14 : 0,
              paddingRight: hasText ? 14 : 0,
              borderRadius: 18,
              border: 'none',
              background: 'var(--miami-coral)',
              color: '#fff',
              cursor: disabled || !query.trim() ? 'default' : 'pointer',
              opacity: disabled || !query.trim() ? 0.4 : 1,
              flexShrink: 0,
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'width 0.2s ease, padding 0.2s ease, border-radius 0.2s ease',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {hasText ? 'Search' : <SearchIcon />}
          </button>
        </>
      )}
    </form>
  );
}
