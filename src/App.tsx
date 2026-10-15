import { useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { NotFoundPage, PrivacyPage, TermsPage } from './components/LegalPage';
import { ModuleFrame } from './components/ModuleFrame';
import { Sidebar } from './components/Sidebar';
import { MODULES, findModuleByRoute, type ModuleId } from './modules';
import { usePath } from './router';
import { readStored, writeStored } from './storage';
import { useTheme } from './theme';

const SITE_NAME = 'Operations Hub';

function pageTitle(path: string, moduleTitle: string | undefined): string {
  if (path === '/') return 'Dashboard';
  if (moduleTitle) return moduleTitle;
  if (path === '/privacy') return 'Privacy Policy';
  if (path === '/terms') return 'Terms and Conditions';
  return 'Page not found';
}

export default function App() {
  const { path, navigate } = usePath();
  const { theme, toggle: toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState<boolean>(() => readStored('oh-sidebar-collapsed') === '1');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visited, setVisited] = useState<ModuleId[]>([]);

  const activeModule = findModuleByRoute(path);

  // Remember which modules have been opened so their frames stay mounted. Switching away and back
  // then keeps whatever the user loaded in that tool, until the hub page itself is refreshed.
  useEffect(() => {
    if (activeModule) {
      setVisited((v) => (v.includes(activeModule.id) ? v : [...v, activeModule.id]));
    }
  }, [activeModule]);

  useEffect(() => {
    document.title = `${pageTitle(path, activeModule?.title)} | ${SITE_NAME}`;
    setDrawerOpen(false);
  }, [path, activeModule]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      writeStored('oh-sidebar-collapsed', c ? '0' : '1');
      return !c;
    });
  };

  const mountedModules = MODULES.filter((m) => visited.includes(m.id) || m.id === activeModule?.id);

  let page: React.ReactNode = null;
  if (!activeModule) {
    if (path === '/') {
      page = <Dashboard onOpen={(m) => navigate(m.route)} />;
    } else if (path === '/privacy') {
      page = <PrivacyPage />;
    } else if (path === '/terms') {
      page = <TermsPage />;
    } else {
      page = <NotFoundPage onHome={() => navigate('/')} />;
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header
        theme={theme}
        collapsed={collapsed}
        drawerOpen={drawerOpen}
        onToggleTheme={toggleTheme}
        onToggleCollapsed={toggleCollapsed}
        onToggleDrawer={() => setDrawerOpen((o) => !o)}
        onHome={() => navigate('/')}
      />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          path={path}
          collapsed={collapsed}
          open={drawerOpen}
          onNavigate={navigate}
          onClose={() => setDrawerOpen(false)}
        />
        <main className="relative min-w-0 flex-1 overflow-hidden">
          {mountedModules.map((m) => (
            <ModuleFrame key={m.id} module={m} visible={m.id === activeModule?.id} />
          ))}
          {page && <div className="h-full overflow-y-auto">{page}</div>}
        </main>
      </div>
    </div>
  );
}
