// Core domain types for the PV Mechanical BOM application.

export type Orientation = 'portrait' | 'landscape';

export interface PVBlock {
  id: string;
  name: string;
  columns: number;
  rows: number;
  orientation: Orientation;
}

export interface PVModule {
  manufacturer: string;
  model: string;
  powerW: number;
  lengthMm: number;
  widthMm: number;
  thicknessMm: number;
  weightKg: number;
}

export interface SpacingConfig {
  horizontalMm: number;
  verticalMm: number;
}

export interface RailConfig {
  railsPerRow: 2 | 3 | 4;
  commercialLengthMm: number;
  overhangLeftMm: number;
  overhangRightMm: number;
}

export type RoofType = 'bac_acier' | 'tole_trapezoidale' | 'tuile' | 'beton' | 'sol';

export interface RoofConfig {
  type: RoofType;
  purlinCount: number;
  purlinSpacingMm: number;
  fixingType: string;
}

export interface MarginConfig {
  defaultPercent: number;
  // categories the margin applies to
  appliesTo: Record<BomCategory, boolean>;
}

export interface ProjectMeta {
  name: string;
  client: string;
  location: string;
  reference: string;
  date: string;
  engineer: string;
  company: string;
}

export interface ComponentPrice {
  unitPrice: number;
  reference: string;
}

export type BomCategory =
  | 'modules'
  | 'rails'
  | 'railSplice'
  | 'endClamp'
  | 'midClamp'
  | 'lFoot'
  | 'roofScrew'
  | 'bolt'
  | 'nut'
  | 'washer'
  | 'railEndCap'
  | 'earthingClip'
  | 'earthingLug'
  | 'groundKit'
  | 'cableTray';

export interface ProjectConfig {
  blocks: PVBlock[];
  module: PVModule;
  spacing: SpacingConfig;
  rail: RailConfig;
  roof: RoofConfig;
  margin: MarginConfig;
  prices: Record<BomCategory, ComponentPrice>;
}

export interface BomLine {
  category: BomCategory;
  designation: string;
  reference: string;
  unit: string;
  calculated: number;
  marginPercent: number;
  finalQty: number;
  unitPrice: number;
  totalPrice: number;
}

export interface BlockResult {
  blockId: string;
  blockName: string;
  modules: number;
  rowLengthMm: number;
  railLengthMm: number;
  railsPerRow: number;
  totalRails: number;
  railPiecesPerRail: number;
  railSplice: number;
  endClamp: number;
  midClamp: number;
  lFoot: number;
  roofScrew: number;
  bolts: number;
  nuts: number;
  washers: number;
  railEndCap: number;
  earthingClip: number;
  earthingLug: number;
  groundKit: number;
  cableTray: number;
  totalRailLengthMm: number;
  wasteMm: number;
}

export interface BomResult {
  lines: BomLine[];
  blocks: BlockResult[];
  totalModules: number;
  totalPowerKw: number;
  totalWeightKg: number;
  totalArea: number;
  grandTotal: number;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  reference: string;
  engineer: string;
  company: string;
  project_date: string;
  config: ProjectConfig;
  bom: BomResult | null;
  created_at: string;
  updated_at: string;
}
