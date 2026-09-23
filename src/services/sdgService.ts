// ==============================================================================
// I-CAN PLATFORM — SDG METRICS & ANALYTICS SERVICE
// Dynamically calculates UN SDG contributions from student green actions
// ==============================================================================

import { GreenAction } from '@/types';

export interface Sdg13Metrics {
  totalCo2SavedKg: number;
  targetCo2Kg: number;
  progressPercent: number;
  approvedActionsCount: number;
  breakdown: {
    treesKg: number;
    transportKg: number;
    wasteAndOthersKg: number;
  };
  activeStudentsCount: number;
}

export interface Sdg4Metrics {
  totalSubmitted: number;
  verifiedCount: number;
  pendingCount: number;
  targetVblCount: number;
  progressPercent: number;
  totalComservHours: number;
  apaStyleCompliancePercent: number;
  uniqueCreatorsCount: number;
}

export interface Sdg15Metrics {
  totalTreesPlanted: number;
  targetTrees: number;
  progressPercent: number;
}

export interface Sdg6Metrics {
  totalBioporiInstalled: number;
  targetBiopori: number;
  progressPercent: number;
}

export interface AllSdgSummary {
  sdg13: Sdg13Metrics;
  sdg4: Sdg4Metrics;
  sdg15: Sdg15Metrics;
  sdg6: Sdg6Metrics;
}

const TARGET_CO2_KG = 5000;
const TARGET_VBL_COUNT = 500;
const TARGET_TREES_COUNT = 2000;
const TARGET_BIOPORI_COUNT = 1000;

// Baseline numbers for campus historical achievements prior to digital tracking
const BASELINE_TREES = 1420;
const BASELINE_BIOPORI = 890;

/**
 * Calculates real-time SDG 13 (Climate Action) metrics from actions
 */
export function calculateSdg13Metrics(actions: GreenAction[]): Sdg13Metrics {
  const approvedActions = actions.filter((a) => a.status === 'APPROVED');
  
  let treesKg = 0;
  let transportKg = 0;
  let wasteAndOthersKg = 0;

  const studentIds = new Set<string>();

  approvedActions.forEach((a) => {
    const co2 = a.carbonImpactKg || 0;
    if (co2 <= 0) return;

    studentIds.add(a.userId);
    const cat = (a.categoryName || a.categoryId || '').toLowerCase();

    if (cat.includes('pohon') || cat.includes('tree')) {
      treesKg += co2;
    } else if (cat.includes('bus') || cat.includes('shuttle') || cat.includes('transport')) {
      transportKg += co2;
    } else {
      wasteAndOthersKg += co2;
    }
  });

  const totalCo2SavedKg = Number((treesKg + transportKg + wasteAndOthersKg).toFixed(2));
  const progressPercent = Math.min(100, Math.round((totalCo2SavedKg / TARGET_CO2_KG) * 100));

  return {
    totalCo2SavedKg,
    targetCo2Kg: TARGET_CO2_KG,
    progressPercent,
    approvedActionsCount: approvedActions.filter((a) => (a.carbonImpactKg || 0) > 0).length,
    breakdown: {
      treesKg: Number(treesKg.toFixed(2)),
      transportKg: Number(transportKg.toFixed(2)),
      wasteAndOthersKg: Number(wasteAndOthersKg.toFixed(2)),
    },
    activeStudentsCount: studentIds.size,
  };
}

/**
 * Calculates real-time SDG 4 (Quality Education / Video Based Learning) metrics from actions
 */
export function calculateSdg4Metrics(actions: GreenAction[]): Sdg4Metrics {
  const isVblAction = (a: GreenAction) => {
    const subType = a.submissionType;
    const cat = (a.categoryName || a.categoryId || '').toLowerCase();
    const story = (a.story || '').toLowerCase();
    return (
      subType === 'VIDEO_BASED_LEARNING' ||
      cat.includes('video') ||
      cat.includes('vbl') ||
      Boolean(a.videoUrl) ||
      story.includes('video based learning')
    );
  };

  const vblActions = actions.filter(isVblAction);
  const totalSubmitted = vblActions.length;
  const verifiedVbl = vblActions.filter((a) => a.status === 'APPROVED');
  const pendingVbl = vblActions.filter((a) => a.status === 'PENDING');

  const verifiedCount = verifiedVbl.length;
  const pendingCount = pendingVbl.length;

  const totalComservHours = Number(
    verifiedVbl.reduce((sum, a) => sum + (a.comservHoursEarned || 0), 0).toFixed(1)
  );

  const apaCompliantCount = verifiedVbl.filter(
    (a) => (a.aiGuidelineScore || 0) >= 0.8 || a.guidelineComplied === true
  ).length;

  const apaStyleCompliancePercent =
    verifiedCount > 0 ? Math.round((apaCompliantCount / verifiedCount) * 100) : 100;

  const uniqueCreators = new Set(vblActions.map((a) => a.userId));

  const progressPercent = Math.min(100, Math.round((verifiedCount / TARGET_VBL_COUNT) * 100));

  return {
    totalSubmitted,
    verifiedCount,
    pendingCount,
    targetVblCount: TARGET_VBL_COUNT,
    progressPercent,
    totalComservHours,
    apaStyleCompliancePercent,
    uniqueCreatorsCount: uniqueCreators.size,
  };
}

/**
 * Calculates real-time SDG 15 (Life on Land) metrics
 */
export function calculateSdg15Metrics(actions: GreenAction[]): Sdg15Metrics {
  const treeActions = actions.filter(
    (a) =>
      a.status === 'APPROVED' &&
      (a.categoryName?.toLowerCase().includes('pohon') ||
        a.categoryId?.toLowerCase().includes('tree'))
  );

  // Each approved tree action represents at least 5 trees per TFI regulation
  const dynamicTrees = treeActions.length * 5;
  const totalTreesPlanted = BASELINE_TREES + dynamicTrees;
  const progressPercent = Math.min(100, Math.round((totalTreesPlanted / TARGET_TREES_COUNT) * 100));

  return {
    totalTreesPlanted,
    targetTrees: TARGET_TREES_COUNT,
    progressPercent,
  };
}

/**
 * Calculates real-time SDG 6 (Clean Water & Sanitation) metrics
 */
export function calculateSdg6Metrics(actions: GreenAction[]): Sdg6Metrics {
  const bioporiActions = actions.filter(
    (a) =>
      a.status === 'APPROVED' &&
      (a.categoryName?.toLowerCase().includes('biopori') ||
        a.categoryId?.toLowerCase().includes('biopori'))
  );

  // Each approved biopori action represents 5 holes per TFI regulation
  const dynamicBiopori = bioporiActions.length * 5;
  const totalBioporiInstalled = BASELINE_BIOPORI + dynamicBiopori;
  const progressPercent = Math.min(100, Math.round((totalBioporiInstalled / TARGET_BIOPORI_COUNT) * 100));

  return {
    totalBioporiInstalled,
    targetBiopori: TARGET_BIOPORI_COUNT,
    progressPercent,
  };
}

/**
 * Consolidated calculation for all campus priority SDGs
 */
export function calculateAllSdgMetrics(actions: GreenAction[]): AllSdgSummary {
  return {
    sdg13: calculateSdg13Metrics(actions),
    sdg4: calculateSdg4Metrics(actions),
    sdg15: calculateSdg15Metrics(actions),
    sdg6: calculateSdg6Metrics(actions),
  };
}

