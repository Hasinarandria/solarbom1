import { useProject } from '../context/ProjectContext';
import { Card, SectionTitle, Button, Badge } from './ui';
import { exportExcel, exportPdf, exportCsv } from '../lib/exports';
import { optimizeCommercialRailLength } from '../lib/calc';
import { Table, FileSpreadsheet, FileText, FileDown, TrendingDown, Zap, Weight, Ruler } from 'lucide-react';

export function BomTable() {
  const { current, bom } = useProject();
  if (!current || !bom) return null;

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Table className="w-5 h-5" />}
        title="Nomenclature complete (BOM)"
        subtitle="Quantites calculees, marges appliquees et couts"
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="success" onClick={() => exportExcel(current, bom)}>
              <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
            </Button>
            <Button size="sm" variant="danger" onClick={() => exportPdf(current, bom)}>
              <FileText className="w-3.5 h-3.5" /> PDF
            </Button>
            <Button size="sm" variant="secondary" onClick={() => exportCsv(bom)}>
              <FileDown className="w-3.5 h-3.5" /> CSV
            </Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Kpi icon={<Zap className="w-4 h-4" />} label="Puissance" value={`${bom.totalPowerKw.toFixed(2)} kWp`} color="brand" />
        <Kpi icon={<Table className="w-4 h-4" />} label="Modules" value={String(bom.totalModules)} color="accent" />
        <Kpi icon={<Weight className="w-4 h-4" />} label="Poids total" value={`${bom.totalWeightKg.toFixed(0)} kg`} color="slate" />
        <Kpi icon={<Ruler className="w-4 h-4" />} label="Surface" value={`${bom.totalArea.toFixed(1)} m2`} color="green" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              <th className="px-4 py-3">Designation</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3 text-center">Unite</th>
              <th className="px-4 py-3 text-right">Calcule</th>
              <th className="px-4 py-3 text-center">Marge</th>
              <th className="px-4 py-3 text-right">Qte finale</th>
              <th className="px-4 py-3 text-right">P.U. (EUR)</th>
              <th className="px-4 py-3 text-right">Total (EUR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {bom.lines.map((l) => (
              <tr key={l.category} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition">
                <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">{l.designation}</td>
                <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400 font-mono text-xs">{l.reference || '-'}</td>
                <td className="px-4 py-2.5 text-center text-slate-500 dark:text-slate-400">{l.unit}</td>
                <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">{l.calculated}</td>
                <td className="px-4 py-2.5 text-center">
                  {l.marginPercent > 0 ? <Badge color="amber">{l.marginPercent}%</Badge> : <Badge color="slate">0%</Badge>}
                </td>
                <td className="px-4 py-2.5 text-right font-bold text-brand-700 dark:text-brand-300">{l.finalQty}</td>
                <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">{l.unitPrice.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right font-semibold text-slate-700 dark:text-slate-200">{l.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-brand-50 dark:bg-brand-900/20 font-bold text-brand-800 dark:text-brand-200">
              <td colSpan={7} className="px-4 py-3 text-right">Cout total estime</td>
              <td className="px-4 py-3 text-right text-base">{bom.grandTotal.toFixed(2)} EUR</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}

function Kpi({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: 'brand' | 'accent' | 'slate' | 'green' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
    accent: 'bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400',
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    green: 'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400',
  };
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
}

export function OptimizationPanel() {
  const { current, updateConfig } = useProject();
  if (!current) return null;

  const { bestLength, perLengthWaste } = optimizeCommercialRailLength(current.config);

  const applyBest = () => updateConfig({ rail: { ...current.config.rail, commercialLengthMm: bestLength } });

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<TrendingDown className="w-5 h-5" />}
        title="Optimisation des decoupes de rails"
        subtitle="Choix automatique de la meilleure longueur commerciale"
        action={
          <Button size="sm" variant="primary" onClick={applyBest}>
            <TrendingDown className="w-3.5 h-3.5" /> Appliquer {bestLength} mm
          </Button>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {perLengthWaste.map((pw) => {
          const isBest = pw.length === bestLength;
          const pct = pw.wastePct;
          return (
            <div
              key={pw.length}
              className={`rounded-lg border p-3 text-center transition ${isBest ? 'border-success-400 bg-success-50 dark:bg-success-900/20' : 'border-slate-200 dark:border-slate-700'}`}
            >
              <p className={`text-sm font-bold ${isBest ? 'text-success-600 dark:text-success-400' : 'text-slate-700 dark:text-slate-200'}`}>{pw.length} mm</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Chute: {pct.toFixed(1)}%</p>
              {isBest && <Badge color="green">Optimal</Badge>}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
