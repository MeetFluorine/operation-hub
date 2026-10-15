# Operations Hub

A small web portal that puts three existing, independently deployed Excel tools behind one sidebar and header.

| Module | Route | Embedded site |
| --- | --- | --- |
| MRS Pipeline | `/mrs` | https://meetfluorine.github.io/mrs_pipeline/ |
| Issuance / FE Summary | `/issuance` | https://meetfluorine.github.io/fe-summary/ |
| Substore Stock | `/substore-stock` | https://meetfluorine.github.io/stock-aging/ |

The hub is a shell only. It does not contain, copy or modify any of the three tools, and it has no backend, database, login or file storage. Each tool keeps its own repository and its own deployment.

Stack: React, Vite, TypeScript, Tailwind CSS. No router or UI library is used.

## Run locally

```bash
npm install
npm run dev
```

Open the address Vite prints. Because the production base path is `/operations-hub/`, the local address is `http://localhost:5173/operations-hub/`.

To test the production build:

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Create an empty repository named `operations-hub` on GitHub, under the same account that owns the other three (`MeetFluorine`).
2. Push this project to its `main` branch.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/MeetFluorine/operations-hub.git
   git push -u origin main
   ```
3. In the repository, open **Settings > Pages** and set **Source** to **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` runs on every push to `main` (and can be started by hand from the Actions tab). When it finishes, the site is live at:

   `https://meetfluorine.github.io/operations-hub/`

Nothing needs to change in the three existing repositories or their workflows.

### If the repository has a different name

The base path must match the repository name. Either edit the default in `vite.config.ts` (`'/operations-hub/'`) or build with `VITE_BASE=/your-repo-name/`.

### Custom domain

1. Add a file `public/CNAME` containing only the domain, for example `hub.example.com`.
2. Set `VITE_BASE=/` for the build (in `deploy.yml`, add `env: { VITE_BASE: / }` to the build step).
3. Create the DNS record your registrar requires and enter the domain under **Settings > Pages > Custom domain**. Enable **Enforce HTTPS** once the certificate is issued.

## Adding another application

Open `src/modules.ts` and add one entry to the `MODULES` array:

```ts
{
  id: 'payroll',                 // also add 'payroll' to the ModuleId type
  route: '/payroll',
  navLabel: 'Payroll',
  title: 'Payroll Checker',
  description: 'One or two sentences for the dashboard card.',
  quickAccessLabel: 'Open Payroll Checker',
  url: 'https://example.github.io/payroll/',
  accent: 'blue',                // 'blue' | 'green' | 'orange'
  icon: 'stock',                 // 'mrs' | 'issuance' | 'stock'
}
```

The sidebar item, dashboard card, Quick Access row, route and page title are all generated from that list. To use a new accent colour or icon, add it to `ACCENTS` in `src/components/Dashboard.tsx` and to `src/components/Icons.tsx`.

## How it works

- **Routing.** The hub reads and writes the browser path with the History API (`/`, `/mrs`, `/issuance`, `/substore-stock`, plus `/privacy` and `/terms`). Back and forward buttons work.
- **Refreshing a route on GitHub Pages.** Pages only serves files that exist. After the build, `scripts/postbuild.mjs` copies `index.html` to `404.html`, so a refresh of `/operations-hub/mrs` loads the app and the route is resolved in the browser. Side effect: Pages answers those refreshes with an HTTP 404 status even though the page renders correctly. Browsers do not care, but search engines and link checkers would.
- **Switching modules.** Each module is an `<iframe>` created the first time it is opened. Switching to another module hides the frame instead of destroying it, so whatever you loaded in a tool is still there when you come back. This lasts until the hub page is refreshed or the tab is closed; a refresh reloads every tool from scratch. Use the **Reload** button in the module toolbar to reload only the current tool.
- **Theme and sidebar.** The theme and the collapsed state of the sidebar are saved in `localStorage` under the keys `oh-theme` and `oh-sidebar-collapsed`.

## Compatibility and limitations

Read this before relying on the embedding.

1. **Embedding was not verified in a real browser.** While the project was prepared, the response headers of the three live sites could not be fetched, and no browser was available to load them in a frame. The three pages are static single-file sites on GitHub Pages. GitHub Pages does not normally send `X-Frame-Options` or a `frame-ancestors` rule, so embedding is expected to work, but the first load of each module after deployment is the real test. Do that before announcing the hub.
2. **If a site refuses embedding,** the browser shows its own "refused to connect" message inside the frame. The cause is a response header on that site (`X-Frame-Options` or `Content-Security-Policy: frame-ancestors`). The hub does not and must not work around it. Practical options: serve the tool from a host where you control the headers, merge the tool into the hub as a route (this means copying its code), or open it in a separate tab.
3. **The hub cannot detect errors inside a frame.** The "finished loading" status means the browser fired the iframe `load` event. Browsers block one site from inspecting another site's frame content, so the hub cannot distinguish a working tool from an error page or from a script error inside the tool. After 15 seconds without a load event, the hub shows a help panel. That panel includes an explicit, optional **Open in a new tab** button; the hub never switches to a new tab by itself.
4. **All four apps share one browser origin.** The hub and the three tools are all served from `meetfluorine.github.io`, so they share the same `localStorage`. The hub only uses keys starting with `oh-`. If a tool stores data under a very generic key, another tool on the same origin could in principle read or overwrite it. This is already true today when the tools are opened directly. The hub does not read from or write into the frames.
5. **Files are not handled by the hub.** Uploads and downloads happen inside each tool exactly as before. The frame has no `sandbox` attribute so that file pickers and downloads behave normally, which is acceptable because the frames only load the three fixed addresses in `modules.ts`.
6. **Mobile.** The three tools were designed as standalone pages. The hub gives them the full workspace, but how well each one fits a phone screen depends on the tool.

## Before announcing the site

- [ ] Open each module once on the deployed site and confirm it renders inside the frame.
- [ ] Connect a custom domain (see above) if you want one.
- [ ] Have someone read the Privacy Policy and Terms pages (`src/components/LegalPage.tsx`). They are plain-language texts written for this setup, not legal advice, and they point to the GitHub repository as the contact.
