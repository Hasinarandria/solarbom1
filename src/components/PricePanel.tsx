import { useProject } from '../context/ProjectContext';
import { Card, SectionTitle, NumberInput, TextInput } from './ui';
import { Euro } from 'lucide-react';
import { ALL_CATEGORY_LIST } from '../lib/defaults';
import { DEFAULT_COMPONENT_INFO } from '../lib/library';
import type { BomCategory, ComponentPrice } from '../lib/types';

export function PricePanel() {
  const { current, updateConfig, bom } = useProject();
  if (!current) return null;
  const prices = current.config.prices;

  const updatePrice = (cat: BomCategory, patch: Partial<ComponentPrice>) =>
    updateConfig({ prices: { ...prices, [cat]: { ...prices[cat], ...patch } } });

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Euro className="w-5 h-5" />}
        title="Analyse des prix"
        subtitle="Prix unitaires et references des composants"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3">
        {ALL_CATEGORY_LIST.map((cat) => {
          const price = prices[cat];
          const lineTotal = bom?.lines.find((l) => l.category === cat)?.totalPrice ?? 0;
          return (
            <div key={cat} className="grid grid-cols-12 gap-2 items-end py-1.5 border-b border-slate-100 dark:border-slate-700/50">
              <div className="col-span-4">
                <span className="text-sm text-slate-700 dark:text-slate-200">{DEFAULT_COMPONENT_INFO[cat].designation}</span>
              </div>
              <div className="col-span-3">
                <TextInput
                  placeholder="Reference"
                  value={price.reference}
                  onChange={(e) => updatePrice(cat, { reference: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="col-span-3">
                <NumberInput
                  placeholder="0.00"
                  step="0.01"
                  value={price.unitPrice}
                  onChange={(e) => updatePrice(cat, { unitPrice: +e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="col-span-2 text-right">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{lineTotal.toFixed(2)}</span>
                <p className="text-[10px] text-slate-400">EUR</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Cout total estime</span>
        <span className="text-xl font-bold text-brand-700 dark:text-brand-300">{(bom?.grandTotal ?? 0).toFixed(2)} EUR</span>
      </div>
    </Card>
  );
}
