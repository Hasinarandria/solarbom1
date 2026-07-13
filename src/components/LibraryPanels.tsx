import { useProject } from '../context/ProjectContext';
import { Card, SectionTitle, Badge } from './ui';
import { STRUCTURE_MANUFACTURERS, DEFAULT_COMPONENT_INFO } from '../lib/library';
import { MARGIN_CATEGORY_LIST } from '../lib/defaults';
import type { BomCategory, ComponentPrice } from '../lib/types';
import {
  PieChart as PieIcon, Library, CheckCircle2, AlertTriangle, Boxes,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const PIE_COLORS = ['#1d5fd8', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b', '#84cc16', '#f97316', '#14b8a6', '#a855f7', '#3b82f6', '#eab308'];

export function CostChart() {
  const { current, bom } = useProject();
  if (!current || !bom) return null;

  const chartData = bom.lines
    .filter((l) => l.totalPrice > 0)
    .map((l) => ({ name: l.designation, value: l.totalPrice }));

  const qtyData = bom.lines
    .filter((l) => l.finalQty > 0)
    .map((l) => ({ name: l.designation, qty: l.finalQty }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card className="p-5">
        <SectionTitle icon={<PieIcon className="w-5 h-5" />} title="Repartition des couts" subtitle="Part de chaque composant dans le total" />
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={45} paddingAngle={2}>
                {chartData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip
                formatter={(v) => `${Number(v).toFixed(2)} EUR`}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle icon={<Boxes className="w-5 h-5" />} title="Quantites par composant" subtitle="Comparatif des quantites finales" />
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={qtyData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={70} interval={0} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="qty" fill="#2576eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export function StructureManufacturerPanel() {
  const { current, updateConfig } = useProject();
  if (!current) return null;

  // Detect which manufacturer is currently applied (by matching references)
  const appliedManu = STRUCTURE_MANUFACTURERS.find((m) =>
    m.components.every((c) => {
      const price = current.config.prices[c.category as BomCategory];
      return price?.reference === c.reference;
    }),
  );

  const applyManufacturer = (manuName: string) => {
    const manu = STRUCTURE_MANUFACTURERS.find((m) => m.name === manuName);
    if (!manu) return;
    const newPrices = { ...current.config.prices };
    for (const comp of manu.components) {
      const cat = comp.category as BomCategory;
      const existing = newPrices[cat] ?? { unitPrice: 0, reference: '' };
      newPrices[cat] = { ...existing, reference: comp.reference } as ComponentPrice;
    }
    updateConfig({ prices: newPrices });
  };

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Library className="w-5 h-5" />}
        title="Fabricant de structure"
        subtitle="Applique automatiquement les references composants"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {STRUCTURE_MANUFACTURERS.map((m) => {
          const active = appliedManu?.name === m.name;
          return (
            <button
              key={m.name}
              onClick={() => applyManufacturer(m.name)}
              className={`rounded-lg border p-3 text-center transition ${active ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/30 ring-2 ring-brand-500/30' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >
              <p className={`text-sm font-semibold ${active ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-200'}`}>{m.name}</p>
              {active && <Badge color="brand">Actif</Badge>}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export function ComponentBrowser() {
  const { current } = useProject();
  if (!current) return null;

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Library className="w-5 h-5" />}
        title="Bibliotheque de composants"
        subtitle="Catalogue par fabricant de structure"
      />
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              <th className="px-4 py-2.5">Fabricant</th>
              <th className="px-4 py-2.5">Composant</th>
              <th className="px-4 py-2.5">Reference</th>
              <th className="px-4 py-2.5">Unite</th>
              <th className="px-4 py-2.5">Marge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {STRUCTURE_MANUFACTURERS.map((manu) =>
              manu.components.map((comp, idx) => (
                <tr key={`${manu.name}-${comp.category}`} className={idx === 0 ? '' : ''}>
                  {idx === 0 ? (
                    <td className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-200 align-top" rowSpan={manu.components.length}>
                      {manu.name}
                    </td>
                  ) : null}
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{DEFAULT_COMPONENT_INFO[comp.category as BomCategory].designation}</td>
                  <td className="px-4 py-2 font-mono text-xs text-slate-500 dark:text-slate-400">{comp.reference}</td>
                  <td className="px-4 py-2 text-center text-slate-500 dark:text-slate-400">{comp.unit}</td>
                  <td className="px-4 py-2 text-center">
                    {MARGIN_CATEGORY_LIST.includes(comp.category as BomCategory) ? (
                      <Badge color="amber">{current.config.margin.defaultPercent}%</Badge>
                    ) : (
                      <Badge color="slate">0%</Badge>
                    )}
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function CompatibilityCheck() {
  const { current, bom } = useProject();
  if (!current || !bom) return null;
  const c = current.config;

  const checks: { ok: boolean; label: string; detail: string }[] = [];

  // Module thickness vs clamp compatibility
  checks.push({
    ok: c.module.thicknessMm <= 40,
    label: 'Epaisseur module',
    detail: c.module.thicknessMm <= 40
      ? `Module ${c.module.thicknessMm}mm - compatible avec clamps standards (<=40mm)`
      : `Module ${c.module.thicknessMm}mm - verifier compatibilite clamps`,
  });

  // Rail length vs row length
  checks.push({
    ok: c.rail.commercialLengthMm >= 2100,
    label: 'Longueur rail commerciale',
    detail: `${c.rail.commercialLengthMm}mm selectionnee`,
  });

  // Purlin spacing
  checks.push({
    ok: c.roof.purlinSpacingMm <= 1500,
    label: 'Entraxe pannes',
    detail: c.roof.purlinSpacingMm <= 1500
      ? `${c.roof.purlinSpacingMm}mm - conforme (<=1500mm)`
      : `${c.roof.purlinSpacingMm}mm - entraxe eleve, verifier portee`,
  });

  // At least one block
  checks.push({
    ok: c.blocks.length > 0,
    label: 'Blocs definis',
    detail: c.blocks.length > 0 ? `${c.blocks.length} bloc(s) configure(s)` : 'Aucun bloc defini',
  });

  // Has references set
  const missingRefs = bom.lines.filter((l) => l.category !== 'modules' && l.category !== 'rails' && !l.reference);
  checks.push({
    ok: missingRefs.length === 0,
    label: 'References composants',
    detail: missingRefs.length === 0
      ? 'Toutes les references sont renseignees'
      : `${missingRefs.length} reference(s) manquante(s) - selectionner un fabricant`,
  });

  const allOk = checks.every((chk) => chk.ok);

  return (
    <Card className="p-5">
      <SectionTitle
        icon={allOk ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        title="Verification de compatibilite"
        subtitle="Controles automatiques des composants"
        action={allOk ? <Badge color="green">Conforme</Badge> : <Badge color="amber">A verifier</Badge>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {checks.map((chk, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-lg border p-3 ${chk.ok ? 'border-success-200 bg-success-50/50 dark:border-success-800 dark:bg-success-900/10' : 'border-warning-200 bg-warning-50/50 dark:border-warning-800 dark:bg-warning-900/10'}`}
          >
            {chk.ok ? (
              <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-warning-500 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{chk.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{chk.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
