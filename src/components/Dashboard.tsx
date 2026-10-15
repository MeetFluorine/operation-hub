import { MODULES, type Accent, type ModuleConfig } from '../modules';
import { ArrowRightIcon, ArrowUpRightIcon, ChevronRightIcon, ClockIcon, ModuleIcon } from './Icons';

interface Props {
  onOpen: (module: ModuleConfig) => void;
}

// Tailwind needs complete class names, so each accent is spelled out.
const ACCENTS: Record<Accent, { tile: string; button: string; arrow: string }> = {
  blue: {
    tile: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    button: 'bg-blue-600 hover:bg-blue-700',
    arrow: 'text-blue-600 dark:text-blue-300',
  },
  green: {
    tile: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    button: 'bg-emerald-700 hover:bg-emerald-800',
    arrow: 'text-emerald-700 dark:text-emerald-300',
  },
  orange: {
    tile: 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
    button: 'bg-orange-700 hover:bg-orange-800',
    arrow: 'text-orange-700 dark:text-orange-300',
  },
};

export function Dashboard({ onOpen }: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Welcome to
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Operations Hub</h1>
        <p className="mt-3 text-base text-slate-800 dark:text-slate-200">
          Access all your Excel processing tools from one place.
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Select a module below or use the sidebar to get started.
        </p>
      </section>

      <section aria-label="Modules" className="grid gap-4 md:grid-cols-3">
        {MODULES.map((m) => {
          const a = ACCENTS[m.accent];
          return (
            <article
              key={m.id}
              className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${a.tile}`}>
                  <ModuleIcon name={m.icon} width={26} height={26} />
                </span>
                <ArrowUpRightIcon className={`h-5 w-5 ${a.arrow}`} />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{m.title}</h2>
              <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-400">{m.description}</p>
              <button
                type="button"
                onClick={() => onOpen(m)}
                className={`mt-5 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-colors ${a.button}`}
              >
                Open {m.navLabel}
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </article>
          );
        })}
      </section>

      <section
        aria-label="Quick access"
        className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <ClockIcon className="h-5 w-5" />
          Quick Access
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {MODULES.map((m) => {
            const a = ACCENTS[m.accent];
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onOpen(m)}
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
              >
                <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${a.tile}`}>
                  <ModuleIcon name={m.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">{m.navLabel}</span>
                  <span className="block truncate text-xs text-slate-600 dark:text-slate-400">
                    {m.quickAccessLabel}
                  </span>
                </span>
                <ChevronRightIcon className="h-5 w-5 shrink-0 text-slate-400" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
