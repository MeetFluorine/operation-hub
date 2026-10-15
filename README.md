# Operations Hub

One page that puts three existing Excel tools behind a single sidebar and header.

| Module | Address in the hub | Embedded site |
| --- | --- | --- |
| MRS Pipeline | `#/mrs` | https://meetfluorine.github.io/mrs_pipeline/ |
| Issuance / FE Summary | `#/issuance` | https://meetfluorine.github.io/fe-summary/ |
| Substore Stock | `#/substore-stock` | https://meetfluorine.github.io/stock-aging/ |

This is plain HTML, CSS and JavaScript. There is nothing to install, no build step and no dependencies. The files in this repository are exactly what GitHub Pages serves.

```
index.html          the page
css/styles.css      all styling, light and dark themes
js/modules.js       the list of tools (edit this to add or change one)
js/app.js           navigation, frames, themes, dashboard, Privacy and Terms pages
favicon.svg
```

## Deploy on GitHub Pages

1. Put these files at the top level of the repository (so `index.html` is in the root, not inside a folder).
2. Open **Settings > Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose branch `main` and folder `/ (root)`, then save.
3. Wait a minute. The site is live at `https://meetfluorine.github.io/<repository-name>/`.

If the repository earlier used the React version, delete its old files first: `src/`, `public/`, `scripts/`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json` and the folder `.github/workflows/`. Leaving the old workflow in place makes GitHub try to build a project that no longer exists, and it will fail.

To try it on your own computer, double-click `index.html`. No server is needed.

## Adding or changing an application

Open `js/modules.js`, copy one block in the list, and change its values. The sidebar item, dashboard card, Quick Access row, address and page title are all generated from that list. The comment at the top of the file explains each field.

## How it behaves

- **Addresses.** The hub uses the part of the address after `#` (for example `.../#/mrs`). That means refreshing a module, bookmarking it or sharing the link always works, and no GitHub Pages 404 setup or base path is involved. It also works under any repository name or custom domain.
- **Switching modules.** Each tool is loaded in an iframe the first time you open it and then kept in the page, only hidden, when you switch away. Whatever you loaded in a tool is still there when you return, until you refresh the hub. Refreshing reloads every tool from scratch.
- **Theme and sidebar.** The theme and the collapsed state of the sidebar are saved in the browser's local storage under the keys `oh-theme` and `oh-sidebar-collapsed`.

## Limitations

1. **Embedding must be checked on the live site.** The three tools are static pages on GitHub Pages, which does not normally block embedding, but this has not been confirmed in a browser. Open each module once after deploying.
2. **If a site refuses to be embedded,** the browser shows its own "refused to connect" message inside the frame. The cause is a response header on that site (`X-Frame-Options` or `Content-Security-Policy: frame-ancestors`). The hub does not work around it. Practical options: host the tool where you control the headers, or merge the tool into the hub as its own page.
3. **The hub cannot see errors inside a frame.** "Finished loading" means the browser fired the iframe load event. Browsers stop one site from inspecting another site's frame, so the hub cannot tell a working tool from an error page. After 15 seconds without a load event, a help panel appears. It includes an optional **Open in a new tab** button; the hub never opens a new tab on its own.
4. **All four apps share one browser origin.** The hub and the three tools are all served from `meetfluorine.github.io`, so they share local storage. The hub only uses keys that start with `oh-`. This is already true today when the tools are opened directly.
5. **Mobile.** The tools were designed as standalone pages. The hub gives them the whole workspace, but how well each one fits a phone screen depends on the tool.

## Before announcing the site

- Open each module once on the live site and confirm it appears in the frame.
- Connect a custom domain if you want one: add a file named `CNAME` containing only the domain name to the repository root, create the DNS record your registrar asks for, enter the domain in **Settings > Pages**, and turn on **Enforce HTTPS** once it is available.
- Have someone read the Privacy Policy and Terms pages (in `js/app.js`). They are plain-language texts written for this setup, not legal advice.
