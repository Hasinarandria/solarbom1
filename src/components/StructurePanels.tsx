import { useProject } from '../context/ProjectContext';
import { Card, SectionTitle, Field, SelectInput, NumberInput } from './ui';
import { MoveHorizontal, Home, Wrench } from 'lucide-react';
import { RAIL_COMMERCIAL_LENGTHS, ROOF_TYPES, ROOF_FIXINGS } from '../lib/library';
import type { RailConfig, RoofType } from '../lib/types';

export function RailsPanel() {
  const { current, updateConfig } = useProject();
  if (!current) return null;
  const r = current.config.rail;

  const update = (patch: Partial<RailConfig>) => updateConfig({ rail: { ...r, ...patch } });

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<MoveHorizontal className="w-5 h-5" />}
        title="Configuration des rails"
        subtitle="Nombre de rails et longueurs commerciales"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field label="Rails par rangee">
          <SelectInput value={r.railsPerRow} onChange={(e) => update({ railsPerRow: +e.target.value as 2 | 3 | 4 })}>
            <option value={2}>2 rails</option>
            <option value={3}>3 rails</option>
            <option value={4}>4 rails</option>
          </SelectInput>
        </Field>
        <Field label="Longueur commerciale (mm)">
          <SelectInput value={r.commercialLengthMm} onChange={(e) => update({ commercialLengthMm: +e.target.value })}>
            {RAIL_COMMERCIAL_LENGTHS.map((l) => <option key={l} value={l}>{l} mm</option>)}
          </SelectInput>
        </Field>
        <Field label="Depassement gauche (mm)">
          <NumberInput value={r.overhangLeftMm} onChange={(e) => update({ overhangLeftMm: +e.target.value })} />
        </Field>
        <Field label="Depassement droit (mm)">
          <NumberInput value={r.overhangRightMm} onChange={(e) => update({ overhangRightMm: +e.target.value })} />
        </Field>
      </div>
    </Card>
  );
}

export function RoofPanel() {
  const { current, updateConfig } = useProject();
  if (!current) return null;
  const roof = current.config.roof;

  const fixings = ROOF_FIXINGS[roof.type] ?? [];

  const update = (patch: Partial<typeof roof>) => updateConfig({ roof: { ...roof, ...patch } });

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Home className="w-5 h-5" />}
        title="Configuration toiture"
        subtitle="Type de support et parametres de fixation"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field label="Type de toiture">
          <SelectInput value={roof.type} onChange={(e) => {
            const newType = e.target.value as RoofType;
            const newFixings = ROOF_FIXINGS[newType] ?? [];
            update({ type: newType, fixingType: newFixings[0] ?? '' });
          }}>
            {ROOF_TYPES.map((rt) => <option key={rt.value} value={rt.value}>{rt.label}</option>)}
          </SelectInput>
        </Field>
        <Field label="Nombre de pannes traversees">
          <NumberInput min={1} value={roof.purlinCount} onChange={(e) => update({ purlinCount: Math.max(1, +e.target.value) })} />
        </Field>
        <Field label="Entraxe des pannes (mm)">
          <NumberInput value={roof.purlinSpacingMm} onChange={(e) => update({ purlinSpacingMm: +e.target.value })} />
        </Field>
        <Field label="Type de fixation">
          <div className="relative">
            <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <SelectInput className="pl-9" value={roof.fixingType} onChange={(e) => update({ fixingType: e.target.value })}>
              {fixings.map((f) => <option key={f} value={f}>{f}</option>)}
            </SelectInput>
          </div>
        </Field>
      </div>
    </Card>
  );
}
