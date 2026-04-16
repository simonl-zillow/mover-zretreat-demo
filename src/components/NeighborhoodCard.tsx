import { useState, useRef, useCallback } from 'react';
import { NeighborhoodNarrative, PILL_COLORS } from '../lifestyleData';

interface NeighborhoodCardProps {
  neighborhoodName: string;
  narrative: NeighborhoodNarrative;
  children: React.ReactNode;
}

function walkLevel(score: number) {
  if (score >= 70) return 'green' as const;
  if (score >= 40) return 'amber' as const;
  return 'red' as const;
}

export default function NeighborhoodCard({ neighborhoodName, narrative, children }: NeighborhoodCardProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    timeoutRef.current = setTimeout(() => setVisible(false), 200);
  }, []);

  const summaryPills: { label: string; level: 'green' | 'amber' | 'red' }[] = [
    { label: narrative.medianPrice, level: 'green' },
    { label: `Walk: ${narrative.walkScore}`, level: walkLevel(narrative.walkScore) },
    { label: narrative.medianCommute, level: 'amber' },
    { label: narrative.diningDensity, level: 'green' },
  ];

  return (
    <span
      style={{ position: 'relative', display: 'inline' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onTouchStart={show}
    >
      <span
        style={{
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          textUnderlineOffset: 2,
          cursor: 'pointer',
          color: 'inherit',
        }}
      >
        {children}
      </span>

      {visible && (
        <div
          onMouseEnter={show}
          onMouseLeave={hide}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 50,
            width: 320,
            padding: 16,
            background: '#fff',
            border: '1px solid var(--miami-border)',
            borderRadius: 12,
            boxShadow: '0 4px 20px var(--miami-shadow-warm-lg)',
            animation: 'fadeInHoverCard 0.15s ease both',
            marginTop: 4,
          }}
        >
          <div style={{ fontWeight: 400, fontSize: 17, marginBottom: 8, color: 'var(--miami-ink)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            {narrative.name}
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--miami-ink-secondary)', margin: '0 0 12px' }}>
            {narrative.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {summaryPills.map((pill, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '3px 8px',
                  borderRadius: 12,
                  background: PILL_COLORS[pill.level].bg,
                  color: PILL_COLORS[pill.level].text,
                  whiteSpace: 'nowrap',
                }}
              >
                {pill.label}
              </span>
            ))}
          </div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ fontSize: 12, color: 'var(--miami-teal)', textDecoration: 'none', fontWeight: 500 }}
          >
            View neighborhood &rarr;
          </a>
        </div>
      )}
    </span>
  );
}
