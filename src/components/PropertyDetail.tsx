/**
 * One home, full width. Zillow link + API/provenance teaching UI only appear in **live** mode;
 * mock mode stays a simple consumer-style detail view.
 */
import { getAdapterEndpointDocs, getDataMode } from '../../lib/data/propertyDataFlow.ts';
import {
  DETAIL_PAGE_FIELD_MAP,
  LIST_CARD_FIELD_MAP,
  WORKSHOP_CORE_FIELDS,
} from '../../lib/data/uiFieldMapping.ts';

interface PropertyDetailProps {
  detail: Record<string, unknown> | null;
  loading?: boolean;
  onBack: () => void;
}

function fmt(n: number | undefined): string {
  if (n == null) return '—';
  return n.toLocaleString();
}

function fmtPrice(n: number | undefined): string {
  if (n == null) return '—';
  return `$${n.toLocaleString()}`;
}

export default function PropertyDetail({ detail, loading, onBack }: PropertyDetailProps) {
  const dataMode = getDataMode();
  const endpointDocs = getAdapterEndpointDocs();

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: '#888', textAlign: 'center' }}>
        Loading details…
      </div>
    );
  }

  if (!detail) return null;

  const p = detail as Record<string, any>;

  const addr = p.address;
  const address = addr
    ? (typeof addr === 'string' ? addr : `${addr.streetAddress}, ${addr.city}, ${addr.state} ${addr.zipcode}`)
    : 'Unknown address';

  const heroImg =
    p.media?.propertyPhotoLinks?.highResLink ??
    p.media?.propertyPhotoLinks?.highResolutionLink ??
    p.media?.propertyPhotoLinks?.mediumSizeLink ??
    p.media?.propertyPhotoLinks?.defaultLink ??
    p.imgSrc ??
    p.imageUrl;

  const price = p.price?.value ?? (typeof p.price === 'number' ? p.price : undefined);
  const zestimate = p.estimates?.zestimate ?? p.zestimate;
  const lotSize = p.lotSizeWithUnit?.lotSize ?? p.lotSize;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--miami-teal)',
          fontSize: '1rem',
          cursor: 'pointer',
          padding: '0.5rem 0',
          marginBottom: '0.5rem',
        }}
      >
        ← Back to results
      </button>

      {heroImg && (
        <img
          src={heroImg}
          alt={address}
          style={{
            width: '100%',
            borderRadius: 12,
            aspectRatio: '16 / 9',
            objectFit: 'cover',
            display: 'block',
            marginBottom: '1rem',
          }}
        />
      )}

      <h2 style={{ color: '#222', fontSize: '1.6rem', marginBottom: '0.25rem' }}>
        {fmtPrice(price)}
      </h2>

      <p style={{ color: '#666', marginBottom: '1rem' }}>{address}</p>

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          marginBottom: '1.5rem',
          color: '#444',
          fontSize: '1rem',
        }}
      >
        <span><strong>{p.bedrooms ?? '—'}</strong> beds</span>
        <span><strong>{p.bathrooms ?? '—'}</strong> baths</span>
        <span><strong>{fmt(p.livingArea)}</strong> sqft</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem 2rem',
          color: '#555',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <span style={{ color: '#999' }}>Zestimate</span>
          <div>{fmtPrice(zestimate)}</div>
        </div>
        <div>
          <span style={{ color: '#999' }}>Home type</span>
          <div>{p.propertyType ?? '—'}</div>
        </div>
        <div>
          <span style={{ color: '#999' }}>Year built</span>
          <div>{p.yearBuilt ?? '—'}</div>
        </div>
        <div>
          <span style={{ color: '#999' }}>Days on Zillow</span>
          <div>{p.daysOnZillow ?? '—'}</div>
        </div>
        <div>
          <span style={{ color: '#999' }}>Lot size</span>
          <div>{lotSize ? `${fmt(lotSize)} sqft` : '—'}</div>
        </div>
        <div>
          <span style={{ color: '#999' }}>Status</span>
          <div>{p.listing?.listingStatus ?? '—'}</div>
        </div>
      </div>

      {p.description && (
        <div style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {p.description}
        </div>
      )}

      {dataMode === 'live' && (
        <>
          <section
            aria-label="Where each main field comes from"
            style={{
              border: '1px solid #dbe7f7',
              borderRadius: 10,
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              background: '#f4f8fd',
            }}
          >
            <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.35rem', color: '#1a3a5c' }}>
              Where each main field comes from
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#4a6785', margin: '0 0 0.65rem', lineHeight: 1.45 }}>
              <strong>Source:</strong> live lookup — browser POSTs to{' '}
              <code style={{ fontSize: '0.75rem' }}>{endpointDocs.searchUrl}</code> with{' '}
              <code style={{ fontSize: '0.75rem' }}>action: …/homes/lookup</code>. See the panel below for
              the full map.
            </p>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.78rem',
              }}
            >
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #c5d9ef' }}>
                  <th style={{ padding: '5px 6px', color: '#1a3a5c' }}>On screen</th>
                  <th style={{ padding: '5px 6px', color: '#1a3a5c' }}>In the data (JSON)</th>
                </tr>
              </thead>
              <tbody>
                {WORKSHOP_CORE_FIELDS.map((row) => (
                  <tr key={row.uiLabel} style={{ borderBottom: '1px solid #e8eef5' }}>
                    <td style={{ padding: '6px', fontWeight: 600, color: '#333', whiteSpace: 'nowrap' }}>
                      {row.uiLabel}
                    </td>
                    <td style={{ padding: '6px', color: '#444', fontFamily: 'ui-monospace, monospace' }}>
                      {row.jsonPath}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {(p.zpid || p.id) && (
            <a
              href={`https://www.zillow.com/homedetails/${p.zpid ?? p.id}_zpid/`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '1rem',
                marginBottom: '1.5rem',
                color: '#006AFF',
                fontSize: '0.95rem',
              }}
            >
              View on Zillow.com →
            </a>
          )}

          <details
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: 10,
              padding: '0.75rem 1rem',
              marginTop: '1.5rem',
              background: '#fafafa',
            }}
          >
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#333' }}>
              Data source / API details
            </summary>
            <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#444', lineHeight: 1.5 }}>
              <p style={{ margin: '0 0 0.75rem' }}>
                <strong>Mode:</strong>{' '}
                <span style={{ fontFamily: 'ui-monospace, monospace' }}>live</span>
                {' '}
                — the browser POSTs to the same-origin path below; Vite forwards it to your proxy (see
                vite.config and .env).
              </p>

              <p style={{ margin: '0 0 0.5rem' }}>
                <strong>List view mapping:</strong> each card is built in{' '}
                <code style={{ fontSize: '0.8rem' }}>lib/data/homesListFromSearch.ts</code> from{' '}
                <code style={{ fontSize: '0.8rem' }}>searchResults[].property</code>.
              </p>

              <p style={{ margin: '0 0 0.75rem' }}>
                <strong>HTTP (live):</strong>{' '}
                <code style={{ fontSize: '0.8rem' }}>POST {endpointDocs.searchUrl}</code>
                <br />
                Search uses JSON field <code>action</code>:{' '}
                <code style={{ fontSize: '0.78rem' }}>{endpointDocs.searchAction}</code>
                <br />
                Detail uses <code>action</code>:{' '}
                <code style={{ fontSize: '0.78rem' }}>{endpointDocs.lookupAction}</code>
                <br />
                The detail screen reads <code>lookupResults[0]</code> when present (same object shape as
                search).
              </p>

          <p style={{ margin: '0 0 0.35rem' }}>
            <strong>This page — UI label → JSON paths</strong>
          </p>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.78rem',
              marginBottom: '0.75rem',
            }}
          >
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '4px 6px' }}>UI</th>
                <th style={{ padding: '4px 6px' }}>Typical fields</th>
              </tr>
            </thead>
            <tbody>
              {DETAIL_PAGE_FIELD_MAP.map((row) => (
                <tr key={row.uiLabel} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '6px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{row.uiLabel}</td>
                  <td style={{ padding: '6px', color: '#555', fontFamily: 'ui-monospace, monospace' }}>
                    {row.jsonPaths}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ margin: '0 0 0.35rem' }}>
            <strong>Result cards (search list)</strong>
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '4px 6px' }}>UI</th>
                <th style={{ padding: '4px 6px' }}>Typical fields</th>
              </tr>
            </thead>
            <tbody>
              {LIST_CARD_FIELD_MAP.map((row) => (
                <tr key={row.uiLabel} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '6px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{row.uiLabel}</td>
                  <td style={{ padding: '6px', color: '#555', fontFamily: 'ui-monospace, monospace' }}>
                    {row.jsonPaths}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

              <details style={{ marginTop: '0.75rem' }}>
                <summary style={{ cursor: 'pointer', color: '#666' }}>Raw object (debug)</summary>
                <pre
                  style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem', fontSize: '0.72rem', color: '#333' }}
                >
                  {JSON.stringify(detail, null, 2)}
                </pre>
              </details>
            </div>
          </details>
        </>
      )}
    </div>
  );
}
