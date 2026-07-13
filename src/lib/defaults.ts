import type { ProjectConfig, BomCategory, ComponentPrice } from './types';

const ALL_CATEGORIES: BomCategory[] = [
  'modules', 'rails', 'railSplice', 'endClamp', 'midClamp', 'lFoot',
  'roofScrew', 'bolt', 'nut', 'washer', 'railEndCap',
  'earthingClip', 'earthingLug', 'groundKit', 'cableTray',
];

const MARGIN_CATEGORIES: BomCategory[] = [
  'railSplice', 'endClamp', 'midClamp', 'lFoot', 'roofScrew',
  'bolt', 'nut', 'washer', 'railEndCap', 'earthingClip', 'earthingLug', 'groundKit', 'cableTray',
];

const DEFAULT_PRICES: Record<BomCategory, ComponentPrice> = {
  modules: { unitPrice: 90, reference: '' },
  rails: { unitPrice: 25, reference: '' },
  railSplice: { unitPrice: 4, reference: '' },
  endClamp: { unitPrice: 3, reference: '' },
  midClamp: { unitPrice: 3, reference: '' },
  lFoot: { unitPrice: 5, reference: '' },
  roofScrew: { unitPrice: 0.5, reference: '' },
  bolt: { unitPrice: 0.4, reference: '' },
  nut: { unitPrice: 0.15, reference: '' },
  washer: { unitPrice: 0.1, reference: '' },
  railEndCap: { unitPrice: 1, reference: '' },
  earthingClip: { unitPrice: 2, reference: '' },
  earthingLug: { unitPrice: 4, reference: '' },
  groundKit: { unitPrice: 35, reference: '' },
  cableTray: { unitPrice: 12, reference: '' },
};

export function defaultConfig(): ProjectConfig {
  return {
    blocks: [
      { id: crypto.randomUUID(), name: 'Bloc 1', columns: 6, rows: 1, orientation: 'portrait' },
    ],
    module: {
      manufacturer: 'JA Solar',
      model: 'JAM72S30 540 LR',
      powerW: 540,
      lengthMm: 2256,
      widthMm: 1133,
      thicknessMm: 35,
      weightKg: 27.5,
    },
    spacing: { horizontalMm: 20, verticalMm: 20 },
    rail: {
      railsPerRow: 2,
      commercialLengthMm: 4200,
      overhangLeftMm: 300,
      overhangRightMm: 300,
    },
    roof: {
      type: 'bac_acier',
      purlinCount: 4,
      purlinSpacingMm: 1200,
      fixingType: 'Crochet bac acier',
    },
    margin: {
      defaultPercent: 15,
      appliesTo: Object.fromEntries(
        ALL_CATEGORIES.map((c) => [c, MARGIN_CATEGORIES.includes(c)]),
      ) as Record<BomCategory, boolean>,
    },
    prices: structuredClone(DEFAULT_PRICES),
  };
}

export const ALL_CATEGORY_LIST = ALL_CATEGORIES;
export const MARGIN_CATEGORY_LIST = MARGIN_CATEGORIES;
