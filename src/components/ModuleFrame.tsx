import { useEffect, useState } from 'react';
import type { ModuleConfig } from '../modules';
import { AlertIcon, ExternalIcon, RefreshIcon } from './Icons';

type Status = 'loading' | 'loaded' | 'slow';

const SLOW_AFTER_MS = 15000;

interface Props {
  module: ModuleConfig;
  visible: boolean;
}

/**
 * Hosts one existing application in an iframe.
 *
 * What "loaded" means here: the browser fired the iframe load event, so a document finished loading.
 * The portal cannot read a cross-origin frame, so it cannot tell a working app from a browser error
 * page (for example a refusal caused by X-Frame-Options or a CSP frame-ancestors rule). The status
 * text says exactly that and the help panel explains how to recognise and handle a blocked frame.
 */
export function ModuleFrame({ module, visible }: Props) {
  const [status, setStatus] = useState<Status>('loading');
  const [attempt, setAttempt] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStatus((s) => (s === 'loading' ? 'slow' : s));
    }, SLOW_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [attempt]);

  const reload = () => {
    setStatus('loading');
    setHelpOpen(false);
    setAttempt((n) => n + 1);
  };

  const showPanel = helpOpen || status === 'slow';
  const showSpinner = status === 'loading' || status === 'slow';

  const statusText =
    status === 'loaded'
      ? 'The page finished loading in this frame'
      : status === 'slow'
        ? 'Still waiting for the page to load'
        : 'Loading';

  const dot =
    status === 'loaded' ? 'bg-emerald-500' : status === 'slow' ? 'bg-amber-500' : 'bg-blue-500';

  return (
    <div className={visible ? 'absolute inset-0 flex flex-col' : 'hidden'}>
      <div className="flex h-10 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-3 text-xs dark:border-slate-800 dark:bg-slate-900 sm:px-4">
        <span className="truncate font-semibold text-slate-900 dark:text-white">{module.title}</span>
        <span className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-400" role="status">
          <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
          <span className="truncate">{statusText}</span>
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={reload}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Reload</span>
          </button>
          <button
            type="button"
            onClick={() => setHelpOpen((v) => !v)}
            aria-expanded={showPanel}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <AlertIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Trouble loading?</span>
          </button>
        </div>
      </div>

      <div className="relative flex-1 bg-white dark:bg-slate-950">
        <iframe
          key={attempt}
          src={module.url}
          title={module.title}
          onLoad={() => setStatus('loaded')}
          allow="clipboard-write; fullscreen"
          className="absolute inset-0 h-full w-full border-0"
        />

        {showSpinner && !showPanel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-950">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400"
              aria-hidden="true"
            />
            <p className="text-sm text-slate-600 dark:text-slate-400">Loading {module.title}</p>
          </div>
        )}

        {showPanel && (
          <div className="absolute inset-0 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950 sm:p-8">
            <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <span className="text-amber-600 dark:text-amber-400">
                  <AlertIcon className="h-6 w-6" />
                </span>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {status === 'slow' ? `${module.title} is taking a long time to load` : `If ${module.title} does not appear`}
                </h2>
              </div>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                The hub can only see that a document finished loading. Browsers do not let one site inspect
                another site inside a frame, so the hub cannot tell a working app from a browser error page.
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
                <li>
                  If the frame shows a message such as "refused to connect", the site is sending a header
                  (X-Frame-Options or a Content-Security-Policy frame-ancestors rule) that forbids embedding.
                </li>
                <li>A blank frame or a long wait usually means a network problem. Reloading often fixes it.</li>
                <li>Pop-up, ad or tracking blockers can interfere with embedded pages.</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={reload}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <RefreshIcon className="h-4 w-4" />
                  Reload
                </button>
                <a
                  href={module.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ExternalIcon className="h-4 w-4" />
                  Open in a new tab
                </a>
                <button
                  type="button"
                  onClick={() => setHelpOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {status === 'slow' ? 'Keep waiting' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
