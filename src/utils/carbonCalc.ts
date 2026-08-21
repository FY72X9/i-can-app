// ==============================================================================
// I-CAN PLATFORM — SCIENTIFIC CARBON & SDG IMPACT CALCULATOR
// Computes CO2e emission reductions and maps campus actions to UN SDGs
// ==============================================================================

export interface EmissionFactor {
  kgCO2e: number;
  unit: string;
  sdgTargets: string[];
  baseCoins: number;
  satPoints: number;
  comservHours: number;
  source: 'IPCC' | 'GHG_PROTOCOL' | 'BINUS_TFI_CUSTOM';
}

export const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  tree: {
    kgCO2e: 5.0,
    unit: 'per 5 bibit pohon berbatang keras/tahun',
    sdgTargets: ['SDG 15 (Life on Land)', 'SDG 13 (Climate Action)'],
    baseCoins: 25,
    satPoints: 4,
    comservHours: 2.0,
    source: 'IPCC',
  },
  biopori: {
    kgCO2e: 0.5,
    unit: 'per 5 lubang biopori',
    sdgTargets: ['SDG 15 (Life on Land)', 'SDG 6 (Clean Water)'],
    baseCoins: 20,
    satPoints: 4,
    comservHours: 2.0,
    source: 'BINUS_TFI_CUSTOM',
  },
  wastafel: {
    kgCO2e: 0.2,
    unit: 'per 1 instalasi wastafel publik',
    sdgTargets: ['SDG 6 (Clean Water & Sanitation)', 'SDG 3 (Good Health)'],
    baseCoins: 20,
    satPoints: 4,
    comservHours: 2.0,
    source: 'BINUS_TFI_CUSTOM',
  },
  vbl: {
    kgCO2e: 0.1,
    unit: 'per video pembelajaran (5-10 min)',
    sdgTargets: ['SDG 4 (Quality Education)'],
    baseCoins: 25,
    satPoints: 3,
    comservHours: 1.5,
    source: 'BINUS_TFI_CUSTOM',
  },
  tumbler: {
    kgCO2e: 0.05,
    unit: 'per pemakaian botol guna ulang',
    sdgTargets: ['SDG 12 (Responsible Consumption)'],
    baseCoins: 10,
    satPoints: 0,
    comservHours: 0.0,
    source: 'GHG_PROTOCOL',
  },
  bus: {
    kgCO2e: 0.12,
    unit: 'per perjalanan shuttle bus kampus',
    sdgTargets: ['SDG 11 (Sustainable Cities)', 'SDG 13 (Climate Action)'],
    baseCoins: 15,
    satPoints: 1,
    comservHours: 0.5,
    source: 'IPCC',
  },
  trash: {
    kgCO2e: 0.08,
    unit: 'per pemilahan sampah Eco Drop Box',
    sdgTargets: ['SDG 12 (Responsible Consumption)'],
    baseCoins: 10,
    satPoints: 0,
    comservHours: 0.0,
    source: 'GHG_PROTOCOL',
  },
};

/**
 * Calculates estimated carbon savings and reward mappings for an action category
 */
export function calculateActionImpact(categoryId: string, multiplier: number = 1) {
  const factor = EMISSION_FACTORS[categoryId] || {
    kgCO2e: 0.05,
    unit: 'per aksi',
    sdgTargets: ['SDG 12 (Responsible Consumption)'],
    baseCoins: 10,
    satPoints: 0,
    comservHours: 0.0,
    source: 'BINUS_TFI_CUSTOM',
  };

  return {
    totalCarbonKg: Number((factor.kgCO2e * multiplier).toFixed(2)),
    greenCoins: factor.baseCoins * multiplier,
    satPoints: factor.satPoints * multiplier,
    comservHours: Number((factor.comservHours * multiplier).toFixed(1)),
    sdgTargets: factor.sdgTargets,
  };
}
