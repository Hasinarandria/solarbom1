import type { PVModule, BomCategory } from './types';

// Integrated PV module library (real-world spec data).
export const MODULE_LIBRARY: PVModule[] = [
  { manufacturer: 'JA Solar', model: 'JAM72S30 540 LR', powerW: 540, lengthMm: 2256, widthMm: 1133, thicknessMm: 35, weightKg: 27.5 },
  { manufacturer: 'JA Solar', model: 'JAM72S30 550 LR', powerW: 550, lengthMm: 2256, widthMm: 1133, thicknessMm: 35, weightKg: 27.8 },
  { manufacturer: 'JA Solar', model: 'JAM60S20 400 MR', powerW: 400, lengthMm: 1997, widthMm: 1010, thicknessMm: 35, weightKg: 22.5 },
  { manufacturer: 'JA Solar', model: 'JAM60S20 420 MR', powerW: 420, lengthMm: 1997, widthMm: 1010, thicknessMm: 35, weightKg: 22.8 },
  { manufacturer: 'Jinko Solar', model: 'Tiger Neo 72HL4 560W', powerW: 560, lengthMm: 2278, widthMm: 1134, thicknessMm: 35, weightKg: 27.2 },
  { manufacturer: 'Jinko Solar', model: 'Tiger Neo 72HL4 580W', powerW: 580, lengthMm: 2278, widthMm: 1134, thicknessMm: 35, weightKg: 27.8 },
  { manufacturer: 'Jinko Solar', model: 'Tiger 60HC 415W', powerW: 415, lengthMm: 2015, widthMm: 1015, thicknessMm: 35, weightKg: 22.5 },
  { manufacturer: 'LONGi', model: 'Hi-MO 6 545W', powerW: 545, lengthMm: 2245, widthMm: 1133, thicknessMm: 30, weightKg: 27.3 },
  { manufacturer: 'LONGi', model: 'Hi-MO 5 540W', powerW: 540, lengthMm: 2256, widthMm: 1133, thicknessMm: 35, weightKg: 27.5 },
  { manufacturer: 'LONGi', model: 'Hi-MO 5 415W', powerW: 415, lengthMm: 1997, widthMm: 1010, thicknessMm: 35, weightKg: 22.6 },
  { manufacturer: 'Trina Solar', model: 'Vertex 560W', powerW: 560, lengthMm: 2256, widthMm: 1133, thicknessMm: 35, weightKg: 27.3 },
  { manufacturer: 'Trina Solar', model: 'Vertex 555W', powerW: 555, lengthMm: 2256, widthMm: 1133, thicknessMm: 35, weightKg: 27.1 },
  { manufacturer: 'Trina Solar', model: 'Vertex 415W', powerW: 415, lengthMm: 1997, widthMm: 1010, thicknessMm: 35, weightKg: 22.5 },
  { manufacturer: 'Canadian Solar', model: 'HiKu7 550W', powerW: 550, lengthMm: 2256, widthMm: 1133, thicknessMm: 35, weightKg: 27.6 },
  { manufacturer: 'Canadian Solar', model: 'HiKu6 410W', powerW: 410, lengthMm: 1997, widthMm: 1010, thicknessMm: 35, weightKg: 22.4 },
  { manufacturer: 'Canadian Solar', model: 'HiKu7 580W', powerW: 580, lengthMm: 2278, widthMm: 1134, thicknessMm: 35, weightKg: 28.1 },
];

export const MANUFACTURERS = [
  'JA Solar',
  'Jinko Solar',
  'LONGi',
  'Trina Solar',
  'Canadian Solar',
  'Autres fabricants',
];

export interface StructureManufacturer {
  name: string;
  components: ComponentSpec[];
}

export interface ComponentSpec {
  category: BomCategory;
  name: string;
  reference: string;
  unit: string;
}

export const STRUCTURE_MANUFACTURERS: StructureManufacturer[] = [
  {
    name: 'K2 Systems',
    components: [
      { category: 'rails', name: 'Rail K2 CrossRail 40 40mm', reference: 'K2-2000-40', unit: 'pcs' },
      { category: 'railSplice', name: 'Rail Splice K2', reference: 'K2-2041', unit: 'pcs' },
      { category: 'midClamp', name: 'Mid Clamp K2 universel', reference: 'K2-2050', unit: 'pcs' },
      { category: 'endClamp', name: 'End Clamp K2 universel', reference: 'K2-2051', unit: 'pcs' },
      { category: 'lFoot', name: 'L-Foot K2', reference: 'K2-2200', unit: 'pcs' },
      { category: 'roofScrew', name: 'Vis toiture K2', reference: 'K2-9050', unit: 'pcs' },
      { category: 'bolt', name: 'Boulon M8 inox', reference: 'K2-9100', unit: 'pcs' },
      { category: 'nut', name: 'Ecrou M8 inox', reference: 'K2-9110', unit: 'pcs' },
      { category: 'washer', name: 'Rondelle M8 inox', reference: 'K2-9120', unit: 'pcs' },
      { category: 'railEndCap', name: 'Rail End Cap K2', reference: 'K2-2070', unit: 'pcs' },
      { category: 'earthingClip', name: 'Earthing Clip K2', reference: 'K2-9001', unit: 'pcs' },
      { category: 'earthingLug', name: 'Earthing Lug K2', reference: 'K2-9002', unit: 'pcs' },
      { category: 'groundKit', name: 'Ground Kit K2', reference: 'K2-9003', unit: 'pcs' },
      { category: 'cableTray', name: 'Cable Tray K2', reference: 'K2-9010', unit: 'pcs' },
    ],
  },
  {
    name: 'Schletter',
    components: [
      { category: 'rails', name: 'Rail Schletter Alu 40mm', reference: 'SCH-2001', unit: 'pcs' },
      { category: 'railSplice', name: 'Rail Splice Schletter', reference: 'SCH-2041', unit: 'pcs' },
      { category: 'midClamp', name: 'Mid Clamp Schletter', reference: 'SCH-2050', unit: 'pcs' },
      { category: 'endClamp', name: 'End Clamp Schletter', reference: 'SCH-2051', unit: 'pcs' },
      { category: 'lFoot', name: 'L-Foot Schletter', reference: 'SCH-2200', unit: 'pcs' },
      { category: 'roofScrew', name: 'Vis toiture Schletter', reference: 'SCH-9050', unit: 'pcs' },
      { category: 'bolt', name: 'Boulon M8 inox', reference: 'SCH-9100', unit: 'pcs' },
      { category: 'nut', name: 'Ecrou M8 inox', reference: 'SCH-9110', unit: 'pcs' },
      { category: 'washer', name: 'Rondelle M8 inox', reference: 'SCH-9120', unit: 'pcs' },
      { category: 'railEndCap', name: 'Rail End Cap Schletter', reference: 'SCH-2070', unit: 'pcs' },
      { category: 'earthingClip', name: 'Earthing Clip Schletter', reference: 'SCH-9001', unit: 'pcs' },
      { category: 'earthingLug', name: 'Earthing Lug Schletter', reference: 'SCH-9002', unit: 'pcs' },
      { category: 'groundKit', name: 'Ground Kit Schletter', reference: 'SCH-9003', unit: 'pcs' },
      { category: 'cableTray', name: 'Cable Tray Schletter', reference: 'SCH-9010', unit: 'pcs' },
    ],
  },
  {
    name: 'Clenergy',
    components: [
      { category: 'rails', name: 'Rail Clenergy Alu 40mm', reference: 'CLE-2001', unit: 'pcs' },
      { category: 'railSplice', name: 'Rail Splice Clenergy', reference: 'CLE-2041', unit: 'pcs' },
      { category: 'midClamp', name: 'Mid Clamp Clenergy', reference: 'CLE-2050', unit: 'pcs' },
      { category: 'endClamp', name: 'End Clamp Clenergy', reference: 'CLE-2051', unit: 'pcs' },
      { category: 'lFoot', name: 'L-Foot Clenergy', reference: 'CLE-2200', unit: 'pcs' },
      { category: 'roofScrew', name: 'Vis toiture Clenergy', reference: 'CLE-9050', unit: 'pcs' },
      { category: 'bolt', name: 'Boulon M8 inox', reference: 'CLE-9100', unit: 'pcs' },
      { category: 'nut', name: 'Ecrou M8 inox', reference: 'CLE-9110', unit: 'pcs' },
      { category: 'washer', name: 'Rondelle M8 inox', reference: 'CLE-9120', unit: 'pcs' },
      { category: 'railEndCap', name: 'Rail End Cap Clenergy', reference: 'CLE-2070', unit: 'pcs' },
      { category: 'earthingClip', name: 'Earthing Clip Clenergy', reference: 'CLE-9001', unit: 'pcs' },
      { category: 'earthingLug', name: 'Earthing Lug Clenergy', reference: 'CLE-9002', unit: 'pcs' },
      { category: 'groundKit', name: 'Ground Kit Clenergy', reference: 'CLE-9003', unit: 'pcs' },
      { category: 'cableTray', name: 'Cable Tray Clenergy', reference: 'CLE-9010', unit: 'pcs' },
    ],
  },
  {
    name: 'Renusol',
    components: [
      { category: 'rails', name: 'Rail Renusol Alu 40mm', reference: 'REN-2001', unit: 'pcs' },
      { category: 'railSplice', name: 'Rail Splice Renusol', reference: 'REN-2041', unit: 'pcs' },
      { category: 'midClamp', name: 'Mid Clamp Renusol', reference: 'REN-2050', unit: 'pcs' },
      { category: 'endClamp', name: 'End Clamp Renusol', reference: 'REN-2051', unit: 'pcs' },
      { category: 'lFoot', name: 'L-Foot Renusol', reference: 'REN-2200', unit: 'pcs' },
      { category: 'roofScrew', name: 'Vis toiture Renusol', reference: 'REN-9050', unit: 'pcs' },
      { category: 'bolt', name: 'Boulon M8 inox', reference: 'REN-9100', unit: 'pcs' },
      { category: 'nut', name: 'Ecrou M8 inox', reference: 'REN-9110', unit: 'pcs' },
      { category: 'washer', name: 'Rondelle M8 inox', reference: 'REN-9120', unit: 'pcs' },
      { category: 'railEndCap', name: 'Rail End Cap Renusol', reference: 'REN-2070', unit: 'pcs' },
      { category: 'earthingClip', name: 'Earthing Clip Renusol', reference: 'REN-9001', unit: 'pcs' },
      { category: 'earthingLug', name: 'Earthing Lug Renusol', reference: 'REN-9002', unit: 'pcs' },
      { category: 'groundKit', name: 'Ground Kit Renusol', reference: 'REN-9003', unit: 'pcs' },
      { category: 'cableTray', name: 'Cable Tray Renusol', reference: 'REN-9010', unit: 'pcs' },
    ],
  },
  {
    name: 'Esdec',
    components: [
      { category: 'rails', name: 'Rail Esdec Alu 40mm', reference: 'ESD-2001', unit: 'pcs' },
      { category: 'railSplice', name: 'Rail Splice Esdec', reference: 'ESD-2041', unit: 'pcs' },
      { category: 'midClamp', name: 'Mid Clamp Esdec', reference: 'ESD-2050', unit: 'pcs' },
      { category: 'endClamp', name: 'End Clamp Esdec', reference: 'ESD-2051', unit: 'pcs' },
      { category: 'lFoot', name: 'L-Foot Esdec', reference: 'ESD-2200', unit: 'pcs' },
      { category: 'roofScrew', name: 'Vis toiture Esdec', reference: 'ESD-9050', unit: 'pcs' },
      { category: 'bolt', name: 'Boulon M8 inox', reference: 'ESD-9100', unit: 'pcs' },
      { category: 'nut', name: 'Ecrou M8 inox', reference: 'ESD-9110', unit: 'pcs' },
      { category: 'washer', name: 'Rondelle M8 inox', reference: 'ESD-9120', unit: 'pcs' },
      { category: 'railEndCap', name: 'Rail End Cap Esdec', reference: 'ESD-2070', unit: 'pcs' },
      { category: 'earthingClip', name: 'Earthing Clip Esdec', reference: 'ESD-9001', unit: 'pcs' },
      { category: 'earthingLug', name: 'Earthing Lug Esdec', reference: 'ESD-9002', unit: 'pcs' },
      { category: 'groundKit', name: 'Ground Kit Esdec', reference: 'ESD-9003', unit: 'pcs' },
      { category: 'cableTray', name: 'Cable Tray Esdec', reference: 'ESD-9010', unit: 'pcs' },
    ],
  },
  {
    name: 'Unirac',
    components: [
      { category: 'rails', name: 'Rail Unirac Alu 40mm', reference: 'UNI-2001', unit: 'pcs' },
      { category: 'railSplice', name: 'Rail Splice Unirac', reference: 'UNI-2041', unit: 'pcs' },
      { category: 'midClamp', name: 'Mid Clamp Unirac', reference: 'UNI-2050', unit: 'pcs' },
      { category: 'endClamp', name: 'End Clamp Unirac', reference: 'UNI-2051', unit: 'pcs' },
      { category: 'lFoot', name: 'L-Foot Unirac', reference: 'UNI-2200', unit: 'pcs' },
      { category: 'roofScrew', name: 'Vis toiture Unirac', reference: 'UNI-9050', unit: 'pcs' },
      { category: 'bolt', name: 'Boulon M8 inox', reference: 'UNI-9100', unit: 'pcs' },
      { category: 'nut', name: 'Ecrou M8 inox', reference: 'UNI-9110', unit: 'pcs' },
      { category: 'washer', name: 'Rondelle M8 inox', reference: 'UNI-9120', unit: 'pcs' },
      { category: 'railEndCap', name: 'Rail End Cap Unirac', reference: 'UNI-2070', unit: 'pcs' },
      { category: 'earthingClip', name: 'Earthing Clip Unirac', reference: 'UNI-9001', unit: 'pcs' },
      { category: 'earthingLug', name: 'Earthing Lug Unirac', reference: 'UNI-9002', unit: 'pcs' },
      { category: 'groundKit', name: 'Ground Kit Unirac', reference: 'UNI-9003', unit: 'pcs' },
      { category: 'cableTray', name: 'Cable Tray Unirac', reference: 'UNI-9010', unit: 'pcs' },
    ],
  },
];

export const ROOF_TYPES = [
  { value: 'bac_acier', label: 'Bac acier' },
  { value: 'tole_trapezoidale', label: 'Tole trapezoidale' },
  { value: 'tuile', label: 'Tuile' },
  { value: 'beton', label: 'Terrasse beton' },
  { value: 'sol', label: 'Installation au sol' },
] as const;

export const ROOF_FIXINGS: Record<string, string[]> = {
  bac_acier: ['Vis auto-percantes', 'Crochet bac acier', 'Selle de fixation'],
  tole_trapezoidale: ['Vis auto-percantes', 'Crochet trapézoïdal'],
  tuile: ['Crochet tuile', 'Remplacement tuile'],
  beton: ['Cheville chimique', 'Cheville mécanique', 'Rail support béton'],
  sol: ['Bloc béton', 'Pieux vissés', 'Tarière'],
};

export const RAIL_COMMERCIAL_LENGTHS = [2100, 3870, 4200, 5400, 6000];

// Default component references/designations by category (fallback)
export const DEFAULT_COMPONENT_INFO: Record<BomCategory, { designation: string; unit: string }> = {
  modules: { designation: 'Modules PV', unit: 'pcs' },
  rails: { designation: 'Rails', unit: 'pcs' },
  railSplice: { designation: 'Rail Splice', unit: 'pcs' },
  endClamp: { designation: 'End Clamp', unit: 'pcs' },
  midClamp: { designation: 'Mid Clamp', unit: 'pcs' },
  lFoot: { designation: 'L-Foot', unit: 'pcs' },
  roofScrew: { designation: 'Vis toiture', unit: 'pcs' },
  bolt: { designation: 'Boulons', unit: 'pcs' },
  nut: { designation: 'Ecrous', unit: 'pcs' },
  washer: { designation: 'Rondelles', unit: 'pcs' },
  railEndCap: { designation: 'Rail End Cap', unit: 'pcs' },
  earthingClip: { designation: 'Earthing Clip', unit: 'pcs' },
  earthingLug: { designation: 'Earthing Lug', unit: 'pcs' },
  groundKit: { designation: 'Ground Kit', unit: 'pcs' },
  cableTray: { designation: 'Cable Tray', unit: 'pcs' },
};

// Vis par L-Foot selon le type de fixation
export const SCREWS_PER_LFOOT = 2;
