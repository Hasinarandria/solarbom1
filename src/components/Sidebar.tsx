import { useProject } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';
import { Button, EmptyState, Badge } from './ui';
import {
  Sun, FilePlus2, Copy, Trash2, SunMedium, Moon, LayoutDashboard,
  ChevronRight, Search,
} from 'lucide-react';
import { useState } from 'react';

export function Sidebar({ onOpenProject }: { onOpenProject: () => void }) {
  const { projects, current, selectProject, newProject, duplicateProject, deleteProject, loading } = useProject();
  const { theme, toggle } = useTheme();
  const [search, setSearch] = useState('');

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <aside className="w-72 shrink-0 h-screen flex flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-md">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 dark:text-white leading-tight">BOM by Hasina</h1>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Calcul BOM Mecanique PV</p>
          </div>
        </div>
      </div>

      {/* New project */}
      <div className="px-4 pt-4">
        <Button onClick={newProject} className="w-full" size="md">
          <FilePlus2 className="w-4 h-4" /> Nouveau projet
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 pt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
        </div>
      </div>

      {/* Project list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 mt-1">
        {loading ? (
          <div className="space-y-2 px-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<LayoutDashboard className="w-7 h-7" />}
            title="Aucun projet"
            subtitle="Creez votre premier projet PV"
          />
        ) : (
          <ul className="space-y-1">
            {filtered.map((p) => {
              const active = current?.id === p.id;
              return (
                <li key={p.id}>
                  <div
                    onClick={() => { selectProject(p.id); onOpenProject(); }}
                    className={`group cursor-pointer rounded-lg p-3 transition-all ${active ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${active ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-200'}`}>{p.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{p.client || 'Sans client'}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Badge color="slate">{p.config.blocks.length} bloc(s)</Badge>
                          <span className="text-[10px] text-slate-400">{new Date(p.updated_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); duplicateProject(p.id); }}
                          className="p-1 rounded text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30"
                          title="Dupliquer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); if (confirm(`Supprimer "${p.name}" ?`)) deleteProject(p.id); }}
                          className="p-1 rounded text-slate-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/30"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer: theme toggle */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <span className="text-xs text-slate-400">Theme</span>
        <button
          onClick={toggle}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {theme === 'light' ? <><SunMedium className="w-4 h-4" /> Clair</> : <><Moon className="w-4 h-4" /> Sombre</>}
        </button>
      </div>
    </aside>
  );
}

export function Dashboard({ onOpenProject }: { onOpenProject: () => void }) {
  const { projects, newProject, loading } = useProject();
  const recent = projects.slice(0, 6);

  const totalKw = projects.reduce((s, p) => {
    const mod = p.config.module;
    const totalMods = p.config.blocks.reduce((a, b) => a + b.columns * b.rows, 0);
    return s + (totalMods * mod.powerW) / 1000;
  }, 0);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 px-8 py-12 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-5xl">
          <h2 className="text-3xl font-bold mb-2">Tableau de bord</h2>
          <p className="text-brand-100 text-base max-w-2xl">
            Calculez automatiquement la nomenclature mecanique complete de vos installations photovoltaiques.
            Dimensionnement, optimisation et export professionnel en un clic.
          </p>
          <div className="flex gap-3 mt-6">
            <Button onClick={newProject} variant="secondary" size="lg" className="!bg-white !text-brand-700 hover:!bg-brand-50">
              <FilePlus2 className="w-5 h-5" /> Creer un projet
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="Projets enregistres" value={String(projects.length)} icon={<LayoutDashboard className="w-5 h-5" />} />
          <StatCard label="Puissance cumulee" value={`${totalKw.toFixed(1)} kWp`} icon={<Sun className="w-5 h-5" />} />
          <StatCard label="Derniere maj" value={projects[0] ? new Date(projects[0].updated_at).toLocaleDateString('fr-FR') : '-'} icon={<SunMedium className="w-5 h-5" />} />
        </div>

        {/* Recent projects */}
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Projets recents</h3>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-xl bg-white dark:bg-slate-800 animate-pulse" />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 py-12 text-center">
            <p className="text-slate-500 dark:text-slate-400">Aucun projet pour le moment.</p>
            <Button onClick={newProject} className="mt-4"><FilePlus2 className="w-4 h-4" /> Creer un projet</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((p) => {
              const mods = p.config.blocks.reduce((a, b) => a + b.columns * b.rows, 0);
              const kw = (mods * p.config.module.powerW) / 1000;
              return (
                <div
                  key={p.id}
                  onClick={() => { onOpenProject(); setTimeout(() => { const ev = new CustomEvent('select-project', { detail: p.id }); window.dispatchEvent(ev); }, 10); }}
                  className="group cursor-pointer rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-card hover:shadow-card-hover hover:border-brand-300 dark:hover:border-brand-700 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
                      <Sun className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{p.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{p.client || 'Sans client'}</p>
                  <div className="flex gap-2 mt-3">
                    <Badge color="brand">{kw.toFixed(1)} kWp</Badge>
                    <Badge color="slate">{mods} modules</Badge>
                    <Badge color="green">{p.config.blocks.length} bloc(s)</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">{icon}</div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
      </div>
    </div>
  );
}
