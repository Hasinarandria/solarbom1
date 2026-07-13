import type {
  ProjectConfig,
  BlockResult,
  BomResult,
  BomLine,
  BomCategory,
} from './types';
import {
  DEFAULT_COMPONENT_INFO,
  SCREWS_PER_LFOOT,
  RAIL_COMMERCIAL_LENGTHS,
} from './library';

const ceil = (n: number) => Math.ceil(n);

/**
 * Per-block calculation following the specification formulas.
 */
export function calculateBlock(
  config: ProjectConfig,
  block: ProjectConfig['blocks'][number],
): BlockResult {
  const { module, spacing, rail, roof } = config;
  const cols = block.columns;
  const rows = block.rows;

  // --- Modules ---
  const modules = cols * rows;

  // --- Row length ---
  // Portrait: cols * panel width ; Landscape: cols * panel length
  const panelDim = block.orientation === 'portrait' ? module.widthMm : module.lengthMm;
  const rowLengthMm = cols * panelDim + (cols - 1) * spacing.horizontalMm;

  // --- Rail length per rail ---
  const railLengthMm = rowLengthMm + rail.overhangLeftMm + rail.overhangRightMm;

  const railsPerRow = rail.railsPerRow;
  const totalRails = railsPerRow * rows;
  const totalRailLengthMm = railLengthMm * totalRails;

  // --- Rail splice: pieces per rail = ceil(railLength / commercialLength) ---
  const railPiecesPerRail = ceil(railLengthMm / rail.commercialLengthMm);
  const railSplice = (railPiecesPerRail - 1) * totalRails;

  // --- End Clamp: 2 per rail ---
  const endClamp = 2 * totalRails;

  // --- Mid Clamp: (cols - 1) per rail ---
  const midClamp = (cols - 1) * totalRails;

  // --- L-Foot: purlins * rails ---
  const lFoot = roof.purlinCount * totalRails;

  // --- Fixations ---
  const roofScrew = lFoot * SCREWS_PER_LFOOT;
  const bolts = lFoot;
  const nuts = bolts;
  const washers = bolts;

  // --- Rail End Cap ---
  const railEndCap = 2 * totalRails;

  // --- Earthing ---
  const earthingClip = (cols - 1) * totalRails;
  const earthingLug = rows;
  const groundKit = rows;
  const cableTray = rows;

  // --- Waste per rail piece ---
  const wasteMm = railPiecesPerRail * rail.commercialLengthMm - railLengthMm;

  return {
    blockId: block.id,
    blockName: block.name,
    modules,
    rowLengthMm,
    railLengthMm,
    railsPerRow,
    totalRails,
    railPiecesPerRail,
    railSplice,
    endClamp,
    midClamp,
    lFoot,
    roofScrew,
    bolts,
    nuts,
    washers,
    railEndCap,
    earthingClip,
    earthingLug,
    groundKit,
    cableTray,
    totalRailLengthMm,
    wasteMm: Math.max(0, wasteMm),
  };
}

const ceilUp = (qty: number, apply: boolean, marginPct: number) =>
  apply ? ceil(qty * (1 + marginPct / 100)) : ceil(qty);

export function calculateBom(config: ProjectConfig): BomResult {
  const blockResults = config.blocks.map((b) => calculateBlock(config, b));

  const totals = blockResults.reduce(
    (acc, b) => ({
      modules: acc.modules + b.modules,
      railSplice: acc.railSplice + b.railSplice,
      endClamp: acc.endClamp + b.endClamp,
      midClamp: acc.midClamp + b.midClamp,
      lFoot: acc.lFoot + b.lFoot,
      roofScrew: acc.roofScrew + b.roofScrew,
      bolts: acc.bolts + b.bolts,
      nuts: acc.nuts + b.nuts,
      washers: acc.washers + b.washers,
      railEndCap: acc.railEndCap + b.railEndCap,
      earthingClip: acc.earthingClip + b.earthingClip,
      earthingLug: acc.earthingLug + b.earthingLug,
      groundKit: acc.groundKit + b.groundKit,
      cableTray: acc.cableTray + b.cableTray,
      totalRails: acc.totalRails + b.totalRails,
      totalRailLengthMm: acc.totalRailLengthMm + b.totalRailLengthMm,
    }),
    {
      modules: 0, railSplice: 0, endClamp: 0, midClamp: 0, lFoot: 0,
      roofScrew: 0, bolts: 0, nuts: 0, washers: 0, railEndCap: 0,
      earthingClip: 0, earthingLug: 0, groundKit: 0, cableTray: 0,
      totalRails: 0, totalRailLengthMm: 0,
    },
  );

  const m = config.margin;
  const applies = (cat: BomCategory) => m.appliesTo[cat] ?? false;

  const buildLine = (
    category: BomCategory,
    calculated: number,
  ): BomLine => {
    const info = DEFAULT_COMPONENT_INFO[category];
    const price = config.prices[category];
    const apply = applies(category);
    const finalQty = ceilUp(calculated, apply, m.defaultPercent);
    const unitPrice = price?.unitPrice ?? 0;
    return {
      category,
      designation: info.designation,
      reference: price?.reference ?? '',
      unit: info.unit,
      calculated,
      marginPercent: apply ? m.defaultPercent : 0,
      finalQty,
      unitPrice,
      totalPrice: finalQty * unitPrice,
    };
  };

  const lines: BomLine[] = [
    buildLine('modules', totals.modules),
    buildLine('rails', totals.totalRails),
    buildLine('railSplice', totals.railSplice),
    buildLine('endClamp', totals.endClamp),
    buildLine('midClamp', totals.midClamp),
    buildLine('lFoot', totals.lFoot),
    buildLine('roofScrew', totals.roofScrew),
    buildLine('bolt', totals.bolts),
    buildLine('nut', totals.nuts),
    buildLine('washer', totals.washers),
    buildLine('railEndCap', totals.railEndCap),
    buildLine('earthingClip', totals.earthingClip),
    buildLine('earthingLug', totals.earthingLug),
    buildLine('groundKit', totals.groundKit),
    buildLine('cableTray', totals.cableTray),
  ];

  const totalPowerKw = (totals.modules * config.module.powerW) / 1000;
  const totalWeightKg = totals.modules * config.module.weightKg;
  const moduleArea =
    (config.module.lengthMm * config.module.widthMm) / 1_000_000;
  const totalArea = totals.modules * moduleArea;
  const grandTotal = lines.reduce((s, l) => s + l.totalPrice, 0);

  return {
    lines,
    blocks: blockResults,
    totalModules: totals.modules,
    totalPowerKw,
    totalWeightKg,
    totalArea,
    grandTotal,
  };
}

/**
 * Optimisation: choose the best commercial rail length to minimise waste.
 */
export function optimizeCommercialRailLength(config: ProjectConfig): {
  bestLength: number;
  perLengthWaste: { length: number; wastePct: number }[];
} {
  const results = RAIL_COMMERCIAL_LENGTHS.map((length) => {
    let totalUsed = 0;
    let totalRaw = 0;
    for (const block of config.blocks) {
      const { module, spacing, rail } = config;
      const panelDim =
        block.orientation === 'portrait' ? module.widthMm : module.lengthMm;
      const rowLength = block.columns * panelDim + (block.columns - 1) * spacing.horizontalMm;
      const railLen = rowLength + rail.overhangLeftMm + rail.overhangRightMm;
      const pieces = ceil(railLen / length);
      const used = pieces * length;
      totalUsed += used * rail.railsPerRow * block.rows;
      totalRaw += railLen * rail.railsPerRow * block.rows;
    }
    const wastePct = totalUsed > 0 ? ((totalUsed - totalRaw) / totalUsed) * 100 : 0;
    return { length, wastePct };
  });

  const best = results.reduce((min, r) => (r.wastePct < min.wastePct ? r : min), results[0]);
  return { bestLength: best.length, perLengthWaste: results };
}
