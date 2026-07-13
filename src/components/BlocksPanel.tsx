import { useProject } from '../context/ProjectContext';
import { Card, SectionTitle, Field, NumberInput, SelectInput, Button, Badge } from './ui';
import { Grid3x3, Plus, Trash2, Copy, ArrowRight } from 'lucide-react';
import type { PVBlock, Orientation } from '../lib/types';

export function BlocksPanel() {
  const { current, updateConfig, bom } = useProject();
  if (!current) return null;
  const blocks = current.config.blocks;

  const addBlock = () => {
    const newBlock: PVBlock = {
      id: crypto.randomUUID(),
      name: `Bloc ${blocks.length + 1}`,
      columns: 4,
      rows: 2,
      orientation: 'portrait',
    };
    updateConfig({ blocks: [...blocks, newBlock] });
  };

  const updateBlock = (id: string, patch: Partial<PVBlock>) => {
    updateConfig({ blocks: blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)) });
  };

  const removeBlock = (id: string) => {
    updateConfig({ blocks: blocks.filter((b) => b.id !== id) });
  };

  const duplicateBlock = (id: string) => {
    const orig = blocks.find((b) => b.id === id);
    if (!orig) return;
    const copy: PVBlock = { ...orig, id: crypto.randomUUID(), name: `${orig.name} (copie)` };
    const idx = blocks.findIndex((b) => b.id === id);
    const next = [...blocks];
    next.splice(idx + 1, 0, copy);
    updateConfig({ blocks: next });
  };

  const totalModules = blocks.reduce((s, b) => s + b.columns * b.rows, 0);

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Grid3x3 className="w-5 h-5" />}
        title="Blocs photovoltaiques"
        subtitle={`${blocks.length} bloc(s) - ${totalModules} modules au total`}
        action={
          <Button size="sm" onClick={addBlock}><Plus className="w-3.5 h-3.5" /> Ajouter un bloc</Button>
        }
      />

      {blocks.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">Aucun bloc. Cliquez sur "Ajouter un bloc" pour commencer.</p>
      ) : (
        <div className="space-y-3">
          {/* Header row (desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-3 text-xs font-medium text-slate-400">
            <div className="col-span-3">Nom</div>
            <div className="col-span-2">Colonnes</div>
            <div className="col-span-2">Rangees</div>
            <div className="col-span-2">Orientation</div>
            <div className="col-span-2">Modules</div>
            <div className="col-span-1"></div>
          </div>

          {blocks.map((b, i) => {
            const mods = b.columns * b.rows;
            const br = bom?.blocks[i];
            return (
              <div key={b.id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50/50 dark:bg-slate-900/30 animate-slide-in">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-3">
                    <Field label="Nom du bloc">
                      <input
                        value={b.name}
                        onChange={(e) => updateBlock(b.id, { name: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Colonnes">
                      <NumberInput min={1} value={b.columns} onChange={(e) => updateBlock(b.id, { columns: Math.max(1, +e.target.value) })} />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Rangees">
                      <NumberInput min={1} value={b.rows} onChange={(e) => updateBlock(b.id, { rows: Math.max(1, +e.target.value) })} />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Orientation">
                      <SelectInput value={b.orientation} onChange={(e) => updateBlock(b.id, { orientation: e.target.value as Orientation })}>
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Paysage</option>
                      </SelectInput>
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <span className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 md:hidden">Modules</span>
                    <div className="flex items-center gap-2 h-[38px]">
                      <Badge color="brand">{mods} modules</Badge>
                      {br && <Badge color="slate">{br.totalRails} rails</Badge>}
                    </div>
                  </div>
                  <div className="md:col-span-1 flex gap-1 justify-end">
                    <button onClick={() => duplicateBlock(b.id)} className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition" title="Dupliquer">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeBlock(b.id)} className="p-2 rounded-lg text-slate-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/30 transition" title="Supprimer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {br && (
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Longueur rangee: <strong className="text-slate-700 dark:text-slate-200">{Math.round(br.rowLengthMm)} mm</strong></span>
                    <span>Longueur rail: <strong className="text-slate-700 dark:text-slate-200">{Math.round(br.railLengthMm)} mm</strong></span>
                    <span>Splice: <strong className="text-slate-700 dark:text-slate-200">{br.railSplice}</strong></span>
                    <span>L-Foot: <strong className="text-slate-700 dark:text-slate-200">{br.lFoot}</strong></span>
                    <ArrowRight className="w-3 h-3 inline" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
