import type { ReactNode } from 'react';

const REPO_URL = 'https://github.com/MeetFluorine/operations-hub';
const UPDATED = 'October 15, 2026';

interface PageProps {
  title: string;
  children: ReactNode;
}

function Page({ title, children }: PageProps) {
  return (
    <article className="mx-auto w-full max-w-3xl p-4 sm:p-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Last updated {UPDATED}</p>
        <div className="mt-6 space-y-6 text-sm leading-6 text-slate-700 dark:text-slate-300">{children}</div>
      </div>
    </article>
  );
}

function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">{heading}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}

const link = 'text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300';

export function PrivacyPage() {
  return (
    <Page title="Privacy Policy">
      <Section heading="What Operations Hub is">
        <p>
          Operations Hub is a navigation shell. It shows three separate Excel tools (MRS Pipeline, Issuance / FE
          Summary and Substore Stock) inside one page. The hub itself has no accounts, no database and no server
          of its own.
        </p>
      </Section>
      <Section heading="Information the hub collects">
        <p>
          The hub does not collect, upload or store your files or any operational data. It does not use cookies,
          analytics or advertising trackers.
        </p>
        <p>
          It saves two display preferences in your browser's local storage: your light or dark theme choice and
          whether the sidebar is collapsed. These stay on your device and are never sent anywhere. Clearing your
          browser data removes them.
        </p>
      </Section>
      <Section heading="The embedded tools">
        <p>
          Each tool is a separate website that is hosted and maintained on its own address. The hub only displays
          them in a frame and cannot read or store what you load into them. The tools describe themselves as
          processing files inside your browser, and some of them keep settings in your browser's local storage.
          Their behaviour is governed by those sites, not by the hub.
        </p>
      </Section>
      <Section heading="Hosting">
        <p>
          The hub is hosted on GitHub Pages. As with any web host, GitHub may record technical information such as
          IP addresses and request logs when you load the site. See the{' '}
          <a
            className={link}
            href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Privacy Statement
          </a>{' '}
          for how GitHub handles that data.
        </p>
      </Section>
      <Section heading="Changes and contact">
        <p>
          If this policy changes, the date above will be updated. Questions can be raised through the project
          repository at{' '}
          <a className={link} href={REPO_URL} target="_blank" rel="noopener noreferrer">
            {REPO_URL.replace('https://', '')}
          </a>
          .
        </p>
      </Section>
    </Page>
  );
}

export function TermsPage() {
  return (
    <Page title="Terms and Conditions">
      <Section heading="Acceptance">
        <p>By using Operations Hub you agree to these terms. If you do not agree, please do not use the site.</p>
      </Section>
      <Section heading="What the service is">
        <p>
          Operations Hub provides a single place to open three existing Excel tools. It does not process, validate
          or store your data itself.
        </p>
      </Section>
      <Section heading="Your responsibilities">
        <ul className="list-disc space-y-1 pl-5">
          <li>You are responsible for the files you load into the tools and for checking the results they produce.</li>
          <li>Use the tools only with data you are allowed to handle.</li>
          <li>Do not attempt to disrupt the site or use it to break the law or the rights of others.</li>
        </ul>
      </Section>
      <Section heading="Third-party tools and services">
        <p>
          The embedded tools and the hosting platform are separate services. Their availability, accuracy and
          behaviour are outside the control of the hub, and they may change or become unavailable at any time.
        </p>
      </Section>
      <Section heading="No warranty">
        <p>
          The site is provided "as is" and "as available", without warranties of any kind. To the fullest extent
          allowed by law, the owner is not liable for losses that result from using the site or from relying on
          output produced by the embedded tools.
        </p>
      </Section>
      <Section heading="Changes and contact">
        <p>
          These terms may be updated from time to time, and the date above will change when they are. Questions can
          be raised through the project repository at{' '}
          <a className={link} href={REPO_URL} target="_blank" rel="noopener noreferrer">
            {REPO_URL.replace('https://', '')}
          </a>
          .
        </p>
      </Section>
    </Page>
  );
}

export function NotFoundPage({ onHome }: { onHome: () => void }) {
  return (
    <div className="mx-auto w-full max-w-xl p-4 sm:p-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          This address does not match any page or module in Operations Hub.
        </p>
        <button
          type="button"
          onClick={onHome}
          className="mt-5 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
