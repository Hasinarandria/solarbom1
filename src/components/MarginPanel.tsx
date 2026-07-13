import { useProject } from '../context/ProjectContext';
import { Card, SectionTitle, Field, NumberInput } from './ui';
import { Percent, ShieldCheck } from 'lucide-react';
import { ALL_CATEGORY_LIST, MARGIN_CATEGORY_LIST } from '../lib/defaults';
import { DEFAULT_COMPONENT_INFO } from '../lib/library';
import type { BomCategory } from '../lib/types';

export function MarginPanel() {
  const { current, updateConfig } = useProject();
  if (!current) return null;
  const margin = current.config.margin;

  const setPercent = (pct: number) => updateConfig({ margin: { ...margin, defaultPercent: pct } });
  const toggleCat = (cat: BomCategory, on: boolean) =>
    updateConfig({ margin: { ...margin, appliesTo: { ...margin.appliesTo, [cat]: on } } });

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Percent className="w-5 h-5" />}
        title="Gestion de la marge"
        subtitle="Marge de securite sur les composants de fixation"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <Field label="Marge par defaut (%)" hint="Valeur recommandee: 15%">
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <NumberInput className="pl-9" value={margin.defaultPercent} onChange={(e) => setPercent(+e.target.value)} />
            </div>
          </Field>
          <div className="mt-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 p-3 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-success-600 dark:text-success-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> La marge ne s'applique pas aux:
            </div>
            <p>Modules PV et Rails (0%)</p>
            <div className="pt-1 border-t border-slate-200 dark:border-slate-700">
              <p>Formule: <code className="text-brand-600 dark:text-brand-400">Qte finale = ARRONDI.SUP(Qte calculee x (1 + marge))</code></p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Categories soumises a la marge</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALL_CATEGORY_LIST.map((cat) => {
              const isMarginCat = MARGIN_CATEGORY_LIST.includes(cat);
              const checked = margin.appliesTo[cat] ?? false;
              return (
                <label
                  key={cat}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 cursor-pointer transition ${checked ? 'border-brand-300 bg-brand-50/50 dark:bg-brand-900/20 dark:border-brand-700' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  <span className="text-sm text-slate-700 dark:text-slate-200">{DEFAULT_COMPONENT_INFO[cat].designation}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!isMarginCat && cat !== 'modules' && cat !== 'rails'}
                    onChange={(e) => toggleCat(cat, e.target.checked)}
                    className="w-4 h-4 rounded accent-brand-600"
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
