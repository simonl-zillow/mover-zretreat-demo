/**
 * Main screens: search grid + property detail.
 *
 * DATA FLOW: This file does not call `fetch` directly. It asks `propertyDataFlow.ts` for listings
 * and detail objects so mock vs live stays in one place.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { PropertyListing } from '../lib/types/types.ts';
import SearchInput from './components/SearchInput.tsx';
import PropertyList from './components/PropertyList.tsx';
import PropertyDetail from './components/PropertyDetail.tsx';
import MapToggleBar from './components/MapToggleBar.tsx';
import { adapterLookupProperty, adapterSearchProperties, getDataMode } from '../lib/data/propertyDataFlow.ts';
import type { ToggleId } from './lifestyleData';

export default function App() {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Record<string, any> | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const scrollPosRef = useRef(0);

  const [activeToggles, setActiveToggles] = useState<Set<ToggleId>>(new Set());

  const handleToggle = useCallback((id: ToggleId) => {
    setActiveToggles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const dataMode = getDataMode();

  async function handleSearch(query: string) {
    setLoading(true);
    setSearched(true);
    setError(null);
    setSelectedId(null);
    setDetail(null);
    const result = await adapterSearchProperties(query);
    setListings(result.listings);
    if (result.error) setError(result.error);
    setLoading(false);
  }

  async function handleSelect(id: string) {
    scrollPosRef.current = window.scrollY;
    setSelectedId(id);
    setDetailLoading(true);
    setDetail(null);
    window.scrollTo(0, 0);
    const result = await adapterLookupProperty(id);
    setDetail(result.detail);
    if (result.error) setError(result.error);
    setDetailLoading(false);
  }

  function handleBack() {
    setSelectedId(null);
    setDetail(null);
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosRef.current);
    });
  }

  function handleClear() {
    setSelectedId(null);
    setDetail(null);
    handleSearch('homes in Miami');
  }

  useEffect(() => {
    handleSearch('homes in Miami');
  }, []);

  return (
    <div>
      {/* ── Header with warm sunset gradient ── */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid var(--miami-border)',
          position: 'sticky',
          top: 0,
          background: 'linear-gradient(135deg, #FBF8F4 0%, #FFF0EC 50%, #FDF6E8 100%)',
          zIndex: 100,
          backdropFilter: 'blur(8px)',
        }}
      >
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
          aria-label="Menu"
        >
          <span style={{ display: 'block', width: 20, height: 2, background: 'var(--miami-ink)', borderRadius: 1 }} />
          <span style={{ display: 'block', width: 20, height: 2, background: 'var(--miami-ink)', borderRadius: 1 }} />
          <span style={{ display: 'block', width: 20, height: 2, background: 'var(--miami-ink)', borderRadius: 1 }} />
        </button>

        <svg width="100" height="21" viewBox="0 0 100 21" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Zillow">
          <g clipPath="url(#clip0_zillow_header)">
            <path d="M47.965 20.6015V1.80103H51.7541V20.6015H47.965Z" fill="#2C2420"/>
            <path d="M24.4468 20.6003V18.4585L33.2738 6.11271V5.8578H24.5992V2.44022H38.9535V4.58069L30.2789 16.9278V17.1827H39.2085V20.6003H24.4468Z" fill="#2C2420"/>
            <path d="M54.4979 1.80103V20.6015H58.2869V1.80103H54.4979Z" fill="#2C2420"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M59.9855 14.0687C59.9855 9.86717 62.8702 7.14387 67.237 7.14387C71.6037 7.14387 74.4884 9.86717 74.4897 14.0687C74.4897 18.2945 71.5794 20.9948 67.2382 20.9948C62.8971 20.9948 59.9855 18.2715 59.9855 14.07V14.0687ZM70.684 14.0687C70.684 11.9039 69.2532 10.377 67.237 10.377C65.2207 10.377 63.7643 11.9052 63.7643 14.07C63.7643 16.2348 65.1951 17.7873 67.2382 17.7873C69.2813 17.7873 70.6853 16.2335 70.6853 14.07L70.684 14.0687Z" fill="#2C2420"/>
            <path d="M74.4884 7.53584L78.4158 20.6015H83.3603L85.3227 11.9513H85.5776L87.5669 20.6003H92.4883L96.4388 7.53456H92.6907L90.0917 16.9009H89.8368L87.3376 7.53584H83.5639L81.2454 16.9022H80.9905L78.3389 7.53584H74.4884Z" fill="#2C2420"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M98.3026 6.46753H98.3013V6.00767H98.5357L98.9751 6.46881H99.1826L98.7215 5.99998H98.7432C98.9802 5.98845 99.1493 5.84883 99.1493 5.649C99.1493 5.43252 98.9687 5.29162 98.692 5.29162H98.1386V6.46753H98.3013V6.46881L98.3026 6.46753ZM98.3026 5.42612V5.87445H98.692C98.8739 5.87445 98.9853 5.78863 98.9853 5.649C98.9853 5.50938 98.8739 5.42612 98.692 5.42612H98.3026Z" fill="#2C2420"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M98.3192 7.25917C98.4136 7.27575 98.5041 7.28471 98.5959 7.28479C98.9669 7.28446 99.3174 7.14102 99.5861 6.87233C99.9204 6.53928 100.061 6.07685 99.9716 5.60546C99.8653 5.04953 99.4221 4.60632 98.8662 4.5C98.3961 4.41034 97.9336 4.55124 97.5993 4.88557C97.265 5.2199 97.1241 5.68232 97.2138 6.15371C97.3201 6.70965 97.7633 7.15285 98.3192 7.25917ZM97.7402 5.02519C97.9721 4.79462 98.2744 4.67165 98.5933 4.67165L98.5921 4.67037C98.6702 4.67037 98.7522 4.67806 98.8316 4.69343C99.3081 4.78309 99.6886 5.16482 99.7795 5.64133C99.8564 6.04739 99.7347 6.44577 99.4477 6.7327C99.1608 7.01964 98.7637 7.14133 98.3564 7.06447C97.8799 6.9748 97.4994 6.59308 97.4085 6.11656C97.3316 5.7105 97.4533 5.31213 97.7402 5.02519Z" fill="#2C2420"/>
            <path d="M41.2938 3.82109C41.2938 2.68489 42.1405 1.84202 43.3293 1.84202C44.518 1.84202 45.3647 2.68361 45.3647 3.82109C45.3647 4.95858 44.518 5.80016 43.3293 5.80016C42.1405 5.80016 41.2938 4.98035 41.2925 3.82109H41.2938Z" fill="#2C2420"/>
            <path d="M41.4283 7.52174H45.2302V20.6015H41.4283V7.52174Z" fill="#2C2420"/>
            <path d="M13.7139 6.03859C13.5486 5.81314 13.2642 5.7081 12.9914 5.76831C11.4299 6.12057 5.68614 7.67436 0 10.4079V7.82679C0 7.4092 0.190862 7.01467 0.518785 6.75464C2.87061 4.89726 8.7079 0.293521 8.7079 0.293521C9.20619 -0.0984505 9.90559 -0.0984505 10.4039 0.293521L18.4098 6.62014L18.5789 6.75464C18.9056 7.01467 19.0964 7.41305 19.0964 7.82807L19.0939 7.82551V10.9946C16.5524 11.3468 11.2762 12.6009 8.98075 13.4514C8.96025 13.4591 8.93719 13.454 8.96794 13.4194C10.2579 11.9412 12.5008 9.9173 14.5708 8.39554C14.8859 8.16496 14.9538 7.72432 14.722 7.4092C14.5272 7.14399 14.2914 6.82349 14.0758 6.53056C13.9426 6.34952 13.8171 6.17901 13.7139 6.03859Z" fill="#E8725C"/>
            <path d="M4.56915 17.8374C4.7677 18.0731 5.09306 18.1513 5.37743 18.0321V18.0347C9.03583 16.5014 16.3091 14.6991 19.0951 14.3058V19.2349C19.0951 19.9894 18.4816 20.6004 17.7271 20.6004H1.36806C0.611014 20.6004 0 19.9894 0 19.2337V13.1235C2.08026 12.1039 7.50253 10.0941 9.37272 9.58939C9.40987 9.58042 9.41883 9.60219 9.38553 9.62397C7.85991 10.6385 4.54097 14.2303 3.43039 15.5125C3.20878 15.7687 3.2011 16.1466 3.41245 16.4143C3.74294 16.828 4.23482 17.4416 4.56915 17.8374Z" fill="#E8725C"/>
          </g>
          <defs>
            <clipPath id="clip0_zillow_header">
              <rect width="100" height="20.9935" fill="white"/>
            </clipPath>
          </defs>
        </svg>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            title="Set VITE_DATA_MODE in .env — mock = offline fixtures, live = proxy"
            style={{
              fontSize: '0.7rem',
              color: dataMode === 'live' ? 'var(--miami-teal)' : 'var(--miami-ink-secondary)',
              border: '1px solid var(--miami-border)',
              borderRadius: 999,
              padding: '2px 8px',
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            {dataMode}
          </span>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'var(--miami-coral-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--miami-coral)">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </div>
        </div>
      </header>

      {/* ── Art Deco accent line ── */}
      <div style={{
        height: 3,
        background: 'linear-gradient(90deg, var(--miami-coral) 0%, var(--miami-gold) 50%, var(--miami-teal) 100%)',
      }} />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
        {selectedId ? (
          <div>
            <PropertyDetail detail={detail} loading={detailLoading} onBack={handleBack} />
          </div>
        ) : (
          <>
            {/* ── Location-aware hero ── */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--miami-coral)',
                }}>
                  Exploring Miami
                </span>
                <span style={{
                  width: 40,
                  height: 1,
                  background: 'linear-gradient(90deg, var(--miami-coral), transparent)',
                  display: 'inline-block',
                }} />
              </div>
              <h1 style={{
                marginBottom: '0.35rem',
                color: 'var(--miami-ink)',
                fontSize: '2rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
              }}>
                Find Your Place in the Sun
              </h1>
              <p style={{ color: 'var(--miami-ink-secondary)', fontSize: '0.9rem' }}>
                Search by neighborhood, lifestyle, or vibe — try <span style={{ color: 'var(--miami-coral)', fontWeight: 500 }}>3 bed condo in Brickell under $800k</span>
              </p>
            </div>

            <SearchInput onSearch={handleSearch} onClear={handleClear} disabled={loading} />

            {!loading && listings.length > 0 && (
              <MapToggleBar activeToggles={activeToggles} onToggle={handleToggle} />
            )}

            {loading && <p style={{ marginTop: '1rem', color: '#888' }}>Searching...</p>}

            {error && (
              <p style={{ marginTop: '1rem', color: '#f55' }}>Error: {error}</p>
            )}

            {!loading && !error && searched && listings.length === 0 && (
              <p style={{ marginTop: '1rem', color: '#888' }}>No results found. Try a different query.</p>
            )}

            {!loading && listings.length > 0 && (
              <PropertyList listings={listings} onSelect={handleSelect} activeToggles={activeToggles} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
