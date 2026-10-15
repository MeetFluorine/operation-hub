import { hrefFor } from '../router';
import type { Theme } from '../theme';
import { LayersIcon, MenuIcon, MoonIcon, SunIcon } from './Icons';

interface Props {
  theme: Theme;
  collapsed: boolean;
  drawerOpen: boolean;
  onToggleTheme: () => void;
  onToggleCollapsed: () => void;
  onToggleDrawer: () => void;
  onHome: () => void;
}

const iconButton =
  'h-10 w-10 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white';

export function Header({
  theme,
  collapsed,
  drawerOpen,
  onToggleTheme,
  onToggleCollapsed,
  onToggleDrawer,
  onHome,
}: Props) {
  return (
    <header className="z-20 flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-900 sm:px-4">
      <button
        type="button"
        className={`${iconButton} inline-flex lg:hidden`}
        onClick={onToggleDrawer}
        aria-label={drawerOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={drawerOpen}
        aria-controls="app-sidebar"
      >
        <MenuIcon />
      </button>
      <button
        type="button"
        className={`${iconButton} hidden lg:inline-flex`}
        onClick={onToggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
        aria-controls="app-sidebar"
      >
        <MenuIcon />
      </button>

      <a
        href={hrefFor('/')}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          onHome();
        }}
        className="flex items-center gap-3 rounded-md px-1 py-1"
      >
        <span className="text-blue-600 dark:text-blue-400">
          <LayersIcon width={32} height={32} strokeWidth={1.6} />
        </span>
        <span className="leading-tight">
          <span className="block text-lg font-semibold text-slate-900 dark:text-white">Operations Hub</span>
          <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
            Your Excel Tools in One Place
          </span>
        </span>
      </a>

      <div className="ml-auto flex items-center">
        <button
          type="button"
          className={`${iconButton} inline-flex`}
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}
