import { LifestylePill, PILL_COLORS } from '../lifestyleData';

interface LifestylePillsProps {
  pills: LifestylePill[];
  animationDelay?: number;
}

export default function LifestylePills({ pills, animationDelay = 0 }: LifestylePillsProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
      {pills.map((pill, i) => {
        const colors = PILL_COLORS[pill.level];
        return (
          <span
            key={i}
            title={pill.label}
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: '3px 8px',
              borderRadius: 12,
              background: colors.bg,
              color: colors.text,
              whiteSpace: 'nowrap',
              animation: `fadeInPill 0.3s ease both`,
              animationDelay: `${animationDelay + i * 50}ms`,
            }}
          >
            {pill.label}
          </span>
        );
      })}
    </div>
  );
}
