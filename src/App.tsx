import { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Sidebar, Dashboard } from './components/Sidebar';
import { Workspace } from './components/Workspace';

function AppInner() {
  const { current, selectProject } = useProject();
  const [view, setView] = useState<'dashboard' | 'workspace'>(current ? 'workspace' : 'dashboard');

  // When a project is selected, switch to workspace view
  useEffect(() => {
    if (current) setView('workspace');
    else setView('dashboard');
  }, [current]);

  // Listen for dashboard card clicks
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      selectProject(id);
      setView('workspace');
    };
    window.addEventListener('select-project', handler);
    return () => window.removeEventListener('select-project', handler);
  }, [selectProject]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      <Sidebar onOpenProject={() => setView('workspace')} />
      {view === 'workspace' && current ? (
        <Workspace onBack={() => setView('dashboard')} />
      ) : (
        <Dashboard onOpenProject={() => setView('workspace')} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <AppInner />
      </ProjectProvider>
    </ThemeProvider>
  );
}
