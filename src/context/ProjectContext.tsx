import {
  createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import { defaultConfig } from '../lib/defaults';
import { calculateBom } from '../lib/calc';
import type { Project, ProjectConfig, ProjectMeta, BomResult } from '../lib/types';

interface ProjectRow {
  id: string;
  name: string;
  client: string | null;
  location: string | null;
  reference: string | null;
  engineer: string | null;
  company: string | null;
  project_date: string | null;
  config: ProjectConfig;
  bom: BomResult | null;
  created_at: string;
  updated_at: string;
}

interface ProjectCtx {
  projects: Project[];
  current: Project | null;
  loading: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  bom: BomResult | null;
  selectProject: (id: string) => void;
  newProject: () => Promise<void>;
  duplicateProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateMeta: (meta: Partial<ProjectMeta>) => void;
  updateConfig: (patch: Partial<ProjectConfig>) => void;
  forceSave: () => Promise<void>;
  closeProject: () => void;
}

const Ctx = createContext<ProjectCtx | null>(null);

function rowToProject(r: ProjectRow): Project {
  return {
    id: r.id,
    name: r.name,
    client: r.client ?? '',
    location: r.location ?? '',
    reference: r.reference ?? '',
    engineer: r.engineer ?? '',
    company: r.company ?? '',
    project_date: r.project_date ?? new Date().toISOString().slice(0, 10),
    config: r.config,
    bom: r.bom,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [current, setCurrent] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bom = current ? calculateBom(current.config) : null;

  const loadProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) {
      console.error('loadProjects error', error);
    } else if (data) {
      setProjects(data.map(rowToProject));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Autosave: debounced write whenever current changes
  useEffect(() => {
    if (!current) return;
    setSaveStatus('saving');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const { id, name, client, location, reference, engineer, company, project_date, config } = current;
      const computedBom = calculateBom(config);
      const { error } = await supabase
        .from('projects')
        .update({
          name, client, location, reference, engineer, company, project_date,
          config, bom: computedBom,
        })
        .eq('id', id);
      if (error) {
        setSaveStatus('error');
      } else {
        setSaveStatus('saved');
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...current, bom: computedBom } : p)),
        );
      }
    }, 900);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [current]);

  const selectProject = useCallback((id: string) => {
    const p = projects.find((p) => p.id === id);
    if (p) setCurrent(p);
  }, [projects]);

  const newProject = useCallback(async () => {
    const config = defaultConfig();
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: 'Nouveau projet',
        client: '', location: '', reference: '', engineer: '', company: '',
        project_date: today, config, bom: null,
      })
      .select('*')
      .single();
    if (error) {
      console.error('newProject error', error);
      return;
    }
    const proj = rowToProject(data as ProjectRow);
    setProjects((prev) => [proj, ...prev]);
    setCurrent(proj);
  }, []);

  const duplicateProject = useCallback(async (id: string) => {
    const orig = projects.find((p) => p.id === id);
    if (!orig) return;
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: `${orig.name} (copie)`,
        client: orig.client, location: orig.location, reference: orig.reference,
        engineer: orig.engineer, company: orig.company, project_date: orig.project_date,
        config: orig.config, bom: orig.bom,
      })
      .select('*')
      .single();
    if (error) { console.error('duplicateProject error', error); return; }
    const proj = rowToProject(data as ProjectRow);
    setProjects((prev) => [proj, ...prev]);
    setCurrent(proj);
  }, [projects]);

  const deleteProject = useCallback(async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) { console.error('deleteProject error', error); return; }
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setCurrent((c) => (c?.id === id ? null : c));
  }, []);

  const updateMeta = useCallback((meta: Partial<ProjectMeta>) => {
    setCurrent((c) => (c ? { ...c, ...meta } : c));
  }, []);

  const updateConfig = useCallback((patch: Partial<ProjectConfig>) => {
    setCurrent((c) => (c ? { ...c, config: { ...c.config, ...patch } } : c));
  }, []);

  const forceSave = useCallback(async () => {
    if (!current) return;
    setSaveStatus('saving');
    const { id, name, client, location, reference, engineer, company, project_date, config } = current;
    const computedBom = calculateBom(config);
    const { error } = await supabase
      .from('projects')
      .update({ name, client, location, reference, engineer, company, project_date, config, bom: computedBom })
      .eq('id', id);
    if (error) setSaveStatus('error');
    else setSaveStatus('saved');
  }, [current]);

  const closeProject = useCallback(() => setCurrent(null), []);

  return (
    <Ctx.Provider value={{
      projects, current, loading, saveStatus, bom,
      selectProject, newProject, duplicateProject, deleteProject,
      updateMeta, updateConfig, forceSave, closeProject,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useProject() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
