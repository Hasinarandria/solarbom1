import { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { ProjectForm } from './ProjectForm';
import { BlocksPanel } from './BlocksPanel';
import { ModulePanel } from './ModulePanel';
import { RailsPanel, RoofPanel } from './StructurePanels';
import { MarginPanel } from './MarginPanel';
import { BomTable, OptimizationPanel } from './BomTable';
import { PricePanel } from './PricePanel';
import { View2D } from './View2D';
import { View3D } from './View3D';
import { CostChart, StructureManufacturerPanel, ComponentBrowser, CompatibilityCheck } from './LibraryPanels';
import {
  LayoutGrid,
  Table, Eye, ArrowLeft, Library,
} from 'lucide-react';

type Tab = 'config' | 'bom' | 'viz' | 'library';

export function Workspace({ onBack }: { onBack: () => void }) {
  const { current } = useProject();
  const [tab, setTab] = useState<Tab>('config');

  if (!current) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'config', label: 'Configuration', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'bom', label: 'BOM & Prix', icon: <Table className="w-4 h-4" /> },
    { id: 'viz', label: 'Visualisation', icon: <Eye className="w-4 h-4" /> },
    { id: 'library', label: 'Bibliotheque', icon: <Library className="w-4 h-4" /> },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-700 px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onBack} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 leading-tight truncate">{current.name}</h2>
              <p className="text-xs text-slate-400 truncate">{current.client || 'Sans client'} - {current.reference || 'Sans reference'}</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 shrink-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition ${tab === t.id ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                {t.icon} <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="p-4 sm:p-6 space-y-5 animate-fade-in">
        {tab === 'config' && (
          <>
            <ProjectForm />
            <BlocksPanel />
            <ModulePanel />
            <RailsPanel />
            <RoofPanel />
            <MarginPanel />
          </>
        )}
        {tab === 'bom' && (
          <>
            <OptimizationPanel />
            <BomTable />
            <CostChart />
            <PricePanel />
          </>
        )}
        {tab === 'viz' && (
          <>
            <View3D />
            <View2D />
          </>
        )}
        {tab === 'library' && (
          <>
            <StructureManufacturerPanel />
            <ComponentBrowser />
            <CompatibilityCheck />
          </>
        )}
      </div>
    </div>
  );
}
