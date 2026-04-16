import { useState } from 'react';
import { TrueCostBreakdown } from '../lifestyleData';

interface TrueCostPanelProps {
  cost: TrueCostBreakdown;
}

function fmtDollar(n: number): string {
  return `$${n.toLocaleString()}`;
}

interface LineItemData {
  label: string;
  amount: number;
  highlight?: 'amber' | 'red';
  icon?: string;
}

export default function TrueCostPanel({ cost }: TrueCostPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const lineItems: LineItemData[] = [
    { label: 'Mortgage P&I', amount: cost.mortgagePI },
    { label: 'Property tax', amount: cost.propertyTax },
    { label: "Homeowner's insurance", amount: cost.homeInsurance },
  ];

  if (cost.floodInsurance > 0) {
    lineItems.push({
      label: 'Flood insurance',
      amount: cost.floodInsurance,
      highlight: cost.floodInsurance > 300 ? 'red' : 'amber',
    });
  }
  if (cost.hoaDues > 0) {
    lineItems.push({ label: 'HOA dues', amount: cost.hoaDues });
  }
  if (cost.specialAssessment > 0) {
    lineItems.push({
      label: 'Special assessment',
      amount: cost.specialAssessment,
      highlight: 'red',
      icon: '\u26A0',
    });
  }

  const barMax = cost.trueMonthly;

  return (
    <div style={{ marginTop: 4 }}>
      <button
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'var(--miami-teal)',
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        {expanded ? 'Hide breakdown \u2191' : 'See true monthly cost \u2193'}
      </button>

      <div
        style={{
          overflow: 'hidden',
          maxHeight: expanded ? 400 : 0,
          transition: 'max-height 0.2s ease',
        }}
      >
        <div style={{ paddingTop: 8 }}>
          {/* Stacked bar */}
          <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
            {lineItems.map((item, i) => (
              <div
                key={i}
                style={{
                  flex: item.amount / barMax,
                  background: barColors[i % barColors.length],
                  minWidth: item.amount > 0 ? 2 : 0,
                }}
              />
            ))}
          </div>

          {/* Line items */}
          {lineItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                padding: '3px 0',
                color: item.highlight === 'red' ? '#C62828' : item.highlight === 'amber' ? '#F57F17' : '#444',
              }}
            >
              <span>{item.icon ? `${item.icon} ` : ''}{item.label}</span>
              <span style={{ fontFamily: 'ui-monospace, monospace' }}>{fmtDollar(item.amount)}</span>
            </div>
          ))}

          {/* Divider */}
          <div style={{ borderTop: '1px solid #e0e0e0', margin: '6px 0' }} />

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600, color: 'var(--miami-ink)' }}>
            <span>True monthly total</span>
            <span>{fmtDollar(cost.trueMonthly)}</span>
          </div>

          {/* Delta */}
          {cost.delta > 0 && (
            <div style={{ fontSize: 12, color: '#E65100', marginTop: 4, textAlign: 'right' }}>
              {fmtDollar(cost.delta)} more than advertised
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const barColors = ['#2A9D8F', '#52B7A8', '#A8DCD1', '#E8725C', '#D4A853', '#E53935'];
