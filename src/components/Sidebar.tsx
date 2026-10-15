import type { ReactNode } from 'react';
import { MODULES } from '../modules';
import { hrefFor } from '../router';
import { HomeIcon, ModuleIcon } from './Icons';

interface Props {
  path: string;
  collapsed: boolean;
  open: boolean;
  onNavigate: (to: string) => void;
  onClose: () => void;
}

interface NavLinkProps {
  to: string;
  label: string;
  active: boolean;
  collapsed: boolean;
  onNavigate: (to: string) => void;
  children: ReactNode;
}

function NavLink({ to, label, active, collapsed, onNavigate, children }: NavLinkProps) {
  return (
    <a
      href={hrefFor(to)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onNavigate(to);
      }}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
        collapsed ? 'lg:justify-center lg:px-0' : ''
      } ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
    >
      {children}
      <span className={collapsed ? 'lg:hidden' : ''}>{label}</span>
    </a>
  );
}

export function Sidebar({ path, collapsed, open, onNavigate, onClose }: Props) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-x-0 bottom-0 top-16 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        id="app-sidebar"
        aria-label="Primary"
        className={`fixed bottom-0 left-0 top-16 z-40 flex w-64 flex-col bg-[#0f2347] transition-transform duration-150 dark:bg-[#0b1324] lg:static lg:translate-x-0 lg:transition-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-[72px]' : 'lg:w-64'}`}
      >
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Modules">
          <NavLink to="/" label="Dashboard" active={path === '/'} collapsed={collapsed} onNavigate={onNavigate}>
            <HomeIcon className="h-5 w-5 shrink-0" />
          </NavLink>
          {MODULES.map((m) => (
            <NavLink
              key={m.id}
              to={m.route}
              label={m.navLabel}
              active={path === m.route}
              collapsed={collapsed}
              onNavigate={onNavigate}
            >
              <ModuleIcon name={m.icon} className="h-5 w-5 shrink-0" />
            </NavLink>
          ))}
        </nav>

        <div className={`border-t border-white/10 p-3 text-xs text-slate-400 ${collapsed ? 'lg:hidden' : ''}`}>
          <div className="flex gap-4 px-3 py-1">
            <a
              href={hrefFor('/privacy')}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                onNavigate('/privacy');
              }}
              className="hover:text-white"
            >
              Privacy
            </a>
            <a
              href={hrefFor('/terms')}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                onNavigate('/terms');
              }}
              className="hover:text-white"
            >
              Terms
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
