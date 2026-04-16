// Lifestyle mock data generator + color constants for all lifestyle intelligence features.

// ── Color palette ──────────────────────────────────────────────────────────────

export const PILL_COLORS = {
  green:  { bg: '#E8F5E9', text: '#2E7D32' },
  amber:  { bg: '#FFF8E1', text: '#F57F17' },
  red:    { bg: '#FFEBEE', text: '#C62828' },
} as const;

export type ToggleId = 'flood' | 'walkability' | 'transit' | 'dining' | 'building';

export const TOGGLE_COLORS = {
  default:  { bg: '#fff', border: '#E8DFD6', text: '#6B5E54' },
  active:   { bg: '#E6F5F2', border: '#2A9D8F', text: '#1A6B5F' },
} as const;

export const ACCENT_COLORS = {
  green: '#4CAF50',
  amber: '#FF9800',
  red:   '#E53935',
} as const;

// ── Types ──────────────────────────────────────────────────────────────────────

export type RiskLevel = 'green' | 'amber' | 'red';

export interface LifestylePill {
  label: string;
  level: RiskLevel;
}

export interface TrueCostBreakdown {
  mortgagePI: number;
  propertyTax: number;
  homeInsurance: number;
  floodInsurance: number;
  hoaDues: number;
  specialAssessment: number;
  trueMonthly: number;
  advertisedMonthly: number;
  delta: number;
}

export interface NeighborhoodNarrative {
  name: string;
  description: string;
  medianPrice: string;
  walkScore: number;
  medianCommute: string;
  diningDensity: string;
}

export interface LifestyleDataEntry {
  pills: LifestylePill[];
  trueCost: TrueCostBreakdown;
  neighborhood: NeighborhoodNarrative;
  confidenceLevel: RiskLevel;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function walkScoreLevel(score: number): RiskLevel {
  if (score >= 70) return 'green';
  if (score >= 40) return 'amber';
  return 'red';
}

function transitLevel(minutes: number): RiskLevel {
  if (minutes <= 15) return 'green';
  if (minutes <= 30) return 'amber';
  return 'red';
}

function floodZoneLevel(zone: string): RiskLevel {
  if (zone === 'Zone X') return 'green';
  if (zone === 'Zone AH') return 'amber';
  return 'red';
}

function floodInsLevel(amount: number): RiskLevel {
  if (amount < 100) return 'green';
  if (amount <= 300) return 'amber';
  return 'red';
}

function hoaLevel(amount: number): RiskLevel {
  if (amount <= 500) return 'green';
  if (amount <= 1000) return 'amber';
  return 'red';
}

function inspectionLevel(status: string): RiskLevel {
  if (status === 'Passed') return 'green';
  if (status === 'Pending') return 'amber';
  return 'red';
}

function computeMortgagePI(price: number): number {
  const loanAmount = price * 0.80;
  const r = 0.0685 / 12;
  const n = 360;
  return r > 0
    ? loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    : loanAmount / n;
}

function computeAdvertised(price: number): number {
  const pi = computeMortgagePI(price);
  const tax = (price * 0.011) / 12;
  const ins = (price * 0.0035) / 12;
  return Math.round(pi + tax + ins);
}

// ── Per-listing lifestyle fixtures ─────────────────────────────────────────────
// Each zpid maps to a unique lifestyle profile telling a different story.

interface RawEntry {
  walkScore: number;
  transitMin: number;
  restaurants: number;
  floodZone: string;
  floodIns: number;
  hoa: number;
  inspection: string | null;
  specialAssessment: number;
  neighborhood: NeighborhoodNarrative;
  isCondo: boolean;
}

const RAW: Record<string, RawEntry> = {
  // Brickell — high-rise condo, great transit, high flood risk
  '92000001': {
    walkScore: 88, transitMin: 6, restaurants: 62, floodZone: 'Zone AE', floodIns: 380, hoa: 850,
    inspection: 'Pending', specialAssessment: 275, isCondo: true,
    neighborhood: {
      name: 'Brickell',
      description: "Miami's Manhattan — glass towers, rooftop pools, and suits-to-swimsuits in 10 minutes. The Metromover is free and gets you everywhere in the financial district. Flood insurance will cost you, and special assessments are a condo-living reality here.",
      medianPrice: '$645K', walkScore: 88, medianCommute: '8 min', diningDensity: '62 restaurants within 0.5 mi',
    },
  },
  // Coral Way — family-friendly townhome, moderate flood
  '92000002': {
    walkScore: 61, transitMin: 22, restaurants: 28, floodZone: 'Zone AH', floodIns: 180, hoa: 350,
    inspection: null, specialAssessment: 0, isCondo: false,
    neighborhood: {
      name: 'Coral Way',
      description: "A tree-lined corridor with bilingual everything — Cuban bakeries next to yoga studios. Families settle here for the good schools and the old-Florida feel that Brickell lost. Not as flashy, but more livable day-to-day.",
      medianPrice: '$899K', walkScore: 61, medianCommute: '22 min', diningDensity: '28 restaurants within 0.5 mi',
    },
  },
  // South Beach — oceanfront luxury, high flood, walkable
  '92000003': {
    walkScore: 91, transitMin: 25, restaurants: 74, floodZone: 'Zone AE', floodIns: 420, hoa: 1200,
    inspection: 'Passed', specialAssessment: 0, isCondo: true,
    neighborhood: {
      name: 'South Beach',
      description: "The beach, the scene, the architecture — SoBe is where Art Deco meets all-night energy. Lincoln Road is your living room, the ocean is your backyard. Everything floods eventually, and your HOA pays for it. Not for the budget-conscious.",
      medianPrice: '$1.1M', walkScore: 91, medianCommute: '25 min', diningDensity: '74 restaurants within 0.5 mi',
    },
  },
  // Shenandoah — affordable bungalow, low flood, car-dependent
  '92000004': {
    walkScore: 48, transitMin: 30, restaurants: 11, floodZone: 'Zone X', floodIns: 0, hoa: 0,
    inspection: null, specialAssessment: 0, isCondo: false,
    neighborhood: {
      name: 'Shenandoah',
      description: "Old Miami at its most honest — terrazzo floors, fruit trees in every yard, and abuelas on porches. It's quiet, it's affordable (by Miami standards), and it's gentrifying fast. Buy now or watch someone else flip it. No flood zone — rare here.",
      medianPrice: '$515K', walkScore: 48, medianCommute: '30 min', diningDensity: '11 restaurants within 0.5 mi',
    },
  },
  // South Miami — starter condo near UM, good transit
  '92000005': {
    walkScore: 65, transitMin: 18, restaurants: 22, floodZone: 'Zone X', floodIns: 0, hoa: 480,
    inspection: 'Passed', specialAssessment: 0, isCondo: true,
    neighborhood: {
      name: 'South Miami',
      description: "College-town energy meets suburban calm — UM students fill the coffee shops, but the tree-canopy streets stay residential and quiet. Metrorail runs right through, which is rare in Miami. Good schools, reasonable HOAs, and Sunset Drive has everything you need.",
      medianPrice: '$425K', walkScore: 65, medianCommute: '18 min', diningDensity: '22 restaurants within 0.5 mi',
    },
  },
  // The Roads — luxury condo, bay views, moderate flood
  '92000006': {
    walkScore: 78, transitMin: 10, restaurants: 45, floodZone: 'Zone AH', floodIns: 220, hoa: 950,
    inspection: 'Pending', specialAssessment: 150, isCondo: true,
    neighborhood: {
      name: 'The Roads',
      description: "Brickell's quieter, more refined sibling — winding streets named after rivers, mature banyans, and bay breezes. The buildings are newer and more boutique here. You're five minutes from downtown but it feels like a different city. Marina access is the real flex.",
      medianPrice: '$985K', walkScore: 78, medianCommute: '10 min', diningDensity: '45 restaurants within 0.5 mi',
    },
  },
  // Wynwood — artsy loft, walkable, moderate risk
  '92000007': {
    walkScore: 82, transitMin: 15, restaurants: 55, floodZone: 'Zone AH', floodIns: 140, hoa: 620,
    inspection: null, specialAssessment: 0, isCondo: true,
    neighborhood: {
      name: 'Wynwood',
      description: "Miami's creative engine — murals on every wall, galleries that double as bars, and a weekend farmers market that's actually good. It went from warehouses to luxury lofts in a decade. The art is free, the rent is not. Flooding is moderate but real.",
      medianPrice: '$725K', walkScore: 82, medianCommute: '15 min', diningDensity: '55 restaurants within 0.5 mi',
    },
  },
  // Key Biscayne — island luxury, high flood, exclusive
  '92000008': {
    walkScore: 42, transitMin: 35, restaurants: 8, floodZone: 'Zone AE', floodIns: 480, hoa: 1450,
    inspection: 'Overdue', specialAssessment: 320, isCondo: true,
    neighborhood: {
      name: 'Key Biscayne',
      description: "Island living for those who can afford the causeway toll — both literal and financial. Pristine beaches, top-rated parks, and a village feel. Flood insurance is brutal, building assessments are constant, and you'll need a car for everything. But the sunsets are unreal.",
      medianPrice: '$1.85M', walkScore: 42, medianCommute: '35 min', diningDensity: '8 restaurants within 0.5 mi',
    },
  },
};

// ── Public API ─────────────────────────────────────────────────────────────────

export function getLifestyleData(zpid: string, price: number): LifestyleDataEntry {
  const raw = RAW[zpid];
  if (!raw) return getDefaultLifestyleData(price);

  const pills: LifestylePill[] = [
    { label: `Walk: ${raw.walkScore}`, level: walkScoreLevel(raw.walkScore) },
    { label: `${raw.transitMin} min to Downtown`, level: transitLevel(raw.transitMin) },
    { label: `${raw.restaurants} restaurants nearby`, level: 'green' },
    { label: `${raw.floodZone}`, level: floodZoneLevel(raw.floodZone) },
  ];

  if (raw.floodIns > 0) {
    pills.push({ label: `Flood ins: $${raw.floodIns}/mo`, level: floodInsLevel(raw.floodIns) });
  }
  if (raw.hoa > 0) {
    pills.push({ label: `HOA: $${raw.hoa}/mo`, level: hoaLevel(raw.hoa) });
  }
  if (raw.inspection) {
    const icon = raw.inspection === 'Passed' ? ' \u2713' : '';
    pills.push({ label: `Inspection: ${raw.inspection}${icon}`, level: inspectionLevel(raw.inspection) });
  }

  const mortgagePI = Math.round(computeMortgagePI(price));
  const propertyTax = Math.round((price * 0.011) / 12);
  const homeInsurance = Math.round((price * 0.0035) / 12);
  const floodInsurance = raw.floodIns;
  const hoaDues = raw.hoa;
  const specialAssessment = raw.specialAssessment;
  const trueMonthly = mortgagePI + propertyTax + homeInsurance + floodInsurance + hoaDues + specialAssessment;
  const advertisedMonthly = computeAdvertised(price);

  const greenCount = pills.filter(p => p.level === 'green').length;
  const redCount = pills.filter(p => p.level === 'red').length;
  let confidenceLevel: RiskLevel = 'amber';
  if (redCount >= 2) confidenceLevel = 'red';
  else if (greenCount >= pills.length * 0.7) confidenceLevel = 'green';

  return {
    pills,
    trueCost: {
      mortgagePI,
      propertyTax,
      homeInsurance,
      floodInsurance,
      hoaDues,
      specialAssessment,
      trueMonthly,
      advertisedMonthly,
      delta: trueMonthly - advertisedMonthly,
    },
    neighborhood: raw.neighborhood,
    confidenceLevel,
  };
}

function getDefaultLifestyleData(price: number): LifestyleDataEntry {
  const mortgagePI = Math.round(computeMortgagePI(price));
  const propertyTax = Math.round((price * 0.011) / 12);
  const homeInsurance = Math.round((price * 0.0035) / 12);
  const trueMonthly = mortgagePI + propertyTax + homeInsurance;
  const advertisedMonthly = computeAdvertised(price);
  return {
    pills: [
      { label: 'Walk: 65', level: 'amber' },
      { label: '20 min to Downtown', level: 'amber' },
      { label: 'Zone X', level: 'green' },
    ],
    trueCost: {
      mortgagePI, propertyTax, homeInsurance,
      floodInsurance: 0, hoaDues: 0, specialAssessment: 0,
      trueMonthly, advertisedMonthly,
      delta: trueMonthly - advertisedMonthly,
    },
    neighborhood: {
      name: 'Unknown', description: 'No neighborhood data available.',
      medianPrice: '—', walkScore: 65, medianCommute: '20 min', diningDensity: '—',
    },
    confidenceLevel: 'amber',
  };
}
