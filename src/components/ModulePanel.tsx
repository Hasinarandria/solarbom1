import { useProject } from '../context/ProjectContext';
import { Card, SectionTitle, Field, SelectInput, NumberInput } from './ui';
import { PanelTop, Ruler, AlignHorizontalJustifyCenter } from 'lucide-react';
import { MODULE_LIBRARY, MANUFACTURERS } from '../lib/library';
import type { PVModule } from '../lib/types';

export function ModulePanel() {
  const { current, updateConfig } = useProject();
  if (!current) return null;
  const m = current.config.module;
  const s = current.config.spacing;

  const selectModel = (model: string) => {
    const found = MODULE_LIBRARY.find((mod) => mod.model === model);
    if (found) updateConfig({ module: { ...found } });
  };

  const selectManufacturer = (manu: string) => {
    const first = MODULE_LIBRARY.find((mod) => mod.manufacturer === manu);
    updateConfig({ module: first ? { ...first } : { ...m, manufacturer: manu } });
  };

  const modelsForManu = MODULE_LIBRARY.filter((mod) => mod.manufacturer === m.manufacturer);

  const updateModule = (patch: Partial<PVModule>) => updateConfig({ module: { ...m, ...patch } });
  const updateSpacing = (patch: Partial<typeof s>) => updateConfig({ spacing: { ...s, ...patch } });

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<PanelTop className="w-5 h-5" />}
        title="Caracteristiques des modules PV"
        subtitle="Selection depuis la bibliotheque ou saisie manuelle"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Library selection */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fabricant">
              <SelectInput value={m.manufacturer} onChange={(e) => selectManufacturer(e.target.value)}>
                {MANUFACTURERS.map((manu) => <option key={manu} value={manu}>{manu}</option>)}
              </SelectInput>
            </Field>
            <Field label="Modele">
              <SelectInput value={m.model} onChange={(e) => selectModel(e.target.value)}>
                {modelsForManu.length > 0 ? (
                  modelsForManu.map((mod) => <option key={mod.model} value={mod.model}>{mod.model}</option>)
                ) : (
                  <option value={m.model}>{m.model || 'Saisie manuelle'}</option>
                )}
              </SelectInput>
            </Field>
          </div>

          <div className="rounded-lg bg-brand-50 dark:bg-brand-900/20 p-3 border border-brand-100 dark:border-brand-800">
            <p className="text-xs font-medium text-brand-700 dark:text-brand-300 mb-2">Apercu rapide</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <SpecItem label="Puissance" value={`${m.powerW} W`} />
              <SpecItem label="Poids" value={`${m.weightKg} kg`} />
              <SpecItem label="Surface" value={`${((m.lengthMm * m.widthMm) / 1_000_000).toFixed(2)} m2`} />
              <SpecItem label="Ratio W/m2" value={`${(m.powerW / ((m.lengthMm * m.widthMm) / 1_000_000)).toFixed(0)} W/m2`} />
            </div>
          </div>
        </div>

        {/* Manual specs */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Puissance (W)"><NumberInput value={m.powerW} onChange={(e) => updateModule({ powerW: +e.target.value })} /></Field>
          <Field label="Poids (kg)"><NumberInput step="0.1" value={m.weightKg} onChange={(e) => updateModule({ weightKg: +e.target.value })} /></Field>
          <Field label="Longueur (mm)"><NumberInput value={m.lengthMm} onChange={(e) => updateModule({ lengthMm: +e.target.value })} /></Field>
          <Field label="Largeur (mm)"><NumberInput value={m.widthMm} onChange={(e) => updateModule({ widthMm: +e.target.value })} /></Field>
          <Field label="Epaisseur (mm)"><NumberInput value={m.thicknessMm} onChange={(e) => updateModule({ thicknessMm: +e.target.value })} /></Field>
        </div>
      </div>

      {/* Spacing */}
      <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700">
        <SectionTitle
          icon={<AlignHorizontalJustifyCenter className="w-5 h-5" />}
          title="Espacement des panneaux"
          subtitle="Gaps entre modules (defaut: 20 mm)"
        />
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <Field label="Espacement horizontal (mm)">
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <NumberInput className="pl-9" value={s.horizontalMm} onChange={(e) => updateSpacing({ horizontalMm: +e.target.value })} />
            </div>
          </Field>
          <Field label="Espacement vertical (mm)">
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <NumberInput className="pl-9" value={s.verticalMm} onChange={(e) => updateSpacing({ verticalMm: +e.target.value })} />
            </div>
          </Field>
        </div>
      </div>
    </Card>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-semibold text-slate-700 dark:text-slate-200">{value}</span>
    </div>
  );
}
