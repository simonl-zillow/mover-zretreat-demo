import { TOGGLE_COLORS, ToggleId } from '../lifestyleData';

export interface MapToggleBarProps {
  activeToggles: Set<ToggleId>;
  onToggle: (id: ToggleId) => void;
}

const TOGGLES: { id: ToggleId; emoji: string; label: string }[] = [
  { id: 'flood',       emoji: '\uD83C\uDF0A', label: 'Flood Zones' },
  { id: 'walkability', emoji: '\uD83D\uDEB6', label: 'Walkability' },
  { id: 'transit',     emoji: '\uD83D\uDE86', label: 'Transit Lines' },
  { id: 'dining',      emoji: '\uD83C\uDF7D\uFE0F', label: 'Dining & Nightlife' },
  { id: 'building',    emoji: '\uD83C\uDFD7\uFE0F', label: 'Building Health' },
];

export default function MapToggleBar({ activeToggles, onToggle }: MapToggleBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        padding: '12px 0',
      }}
    >
      {TOGGLES.map((t) => {
        const active = activeToggles.has(t.id);
        const colors = active ? TOGGLE_COLORS.active : TOGGLE_COLORS.default;
        return (
          <button
            key={t.id}
            onClick={() => onToggle(t.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
              padding: '6px 14px',
              borderRadius: 20,
              border: `1px solid ${colors.border}`,
              background: colors.bg,
              color: colors.text,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              transform: active ? 'scale(1.02)' : 'scale(1)',
              fontWeight: active ? 600 : 400,
            }}
          >
            <span>{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
