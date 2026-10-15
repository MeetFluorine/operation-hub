/*
 * Operations Hub: plain JavaScript, no libraries, no build step.
 * Routing uses the URL hash (#/mrs). That keeps the page address constant, so refreshing a module
 * never produces a 404 on GitHub Pages and the site works under any repository name.
 */
(function () {
  'use strict';

  var MODULES = window.OPS_MODULES || [];
  var SITE_NAME = 'Operations Hub';
  var SLOW_AFTER_MS = 15000;
  var REPO_URL = 'https://github.com/MeetFluorine';
  var LEGAL_UPDATED = 'October 15, 2026';

  /* ---------- helpers ---------- */

  var ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-6h4v6"/>',
    mrs: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
    issuance: '<path d="M12 3 4 7.5v9L12 21l8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5"/><path d="M12 12v9"/>',
    stock: '<path d="M5 20V10M12 20V4M19 20v-7"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
    chevronRight: '<path d="m9 6 6 6-6 6"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.5-4M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.5 4M20 20v-4h-4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    layers: '<path d="M12 3 3 8l9 5 9-5z"/><path d="m3 12.5 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17.5v.01"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'
  };

  function icon(name, size) {
    var s = size || 20;
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" ' +
      'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      (ICONS[name] || '') + '</svg>';
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function getStored(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function setStored(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* preference is just not remembered */ }
  }

  /* ---------- elements ---------- */

  var app = document.getElementById('app');
  var nav = document.getElementById('nav');
  var workspace = document.getElementById('workspace');
  var page = document.getElementById('page');
  var scrim = document.getElementById('scrim');
  var menuBtn = document.getElementById('menu-btn');
  var collapseBtn = document.getElementById('collapse-btn');
  var themeBtn = document.getElementById('theme-btn');

  Array.prototype.forEach.call(document.querySelectorAll('[data-icon]'), function (el) {
    el.innerHTML = icon(el.getAttribute('data-icon'), Number(el.getAttribute('data-size')) || 20);
  });

  /* ---------- theme ---------- */

  function syncThemeButton() {
    var dark = document.documentElement.classList.contains('dark');
    themeBtn.innerHTML = icon(dark ? 'sun' : 'moon');
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  themeBtn.addEventListener('click', function () {
    var dark = document.documentElement.classList.toggle('dark');
    setStored('oh-theme', dark ? 'dark' : 'light');
    syncThemeButton();
  });
  syncThemeButton();

  /* ---------- sidebar: collapse (desktop) and drawer (mobile) ---------- */

  function setCollapsed(collapsed) {
    app.classList.toggle('is-collapsed', collapsed);
    collapseBtn.setAttribute('aria-expanded', String(!collapsed));
    collapseBtn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
  }

  collapseBtn.addEventListener('click', function () {
    var collapsed = !app.classList.contains('is-collapsed');
    setCollapsed(collapsed);
    setStored('oh-sidebar-collapsed', collapsed ? '1' : '0');
  });
  setCollapsed(getStored('oh-sidebar-collapsed') === '1');

  function setDrawer(open) {
    app.classList.toggle('drawer-open', open);
    scrim.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }

  menuBtn.addEventListener('click', function () {
    setDrawer(!app.classList.contains('drawer-open'));
  });
  scrim.addEventListener('click', function () { setDrawer(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setDrawer(false);
  });

  /* ---------- navigation list ---------- */

  var navItems = [{ route: '/', label: 'Dashboard', icon: 'home' }].concat(
    MODULES.map(function (m) { return { route: m.route, label: m.navLabel, icon: m.icon }; })
  );

  nav.innerHTML = navItems.map(function (item) {
    return '<a class="nav-link" href="#' + esc(item.route) + '" data-route="' + esc(item.route) + '" title="' + esc(item.label) + '">' +
      icon(item.icon) + '<span class="nav-label">' + esc(item.label) + '</span></a>';
  }).join('');

  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('.nav-link'));

  /* ---------- module frames ---------- */

  var frames = {}; // module id -> { root }

  /*
   * What "loaded" means: the browser fired the iframe load event, so a document finished loading.
   * The hub cannot read another site's frame, so it cannot tell a working tool from a browser error
   * page (for example a refusal caused by X-Frame-Options). The status text and help panel say so.
   */
  function createFrame(m) {
    var root = document.createElement('section');
    root.className = 'frame';
    root.hidden = true;
    root.setAttribute('aria-label', m.title);
    root.innerHTML =
      '<div class="frame-bar">' +
        '<strong class="frame-title">' + esc(m.title) + '</strong>' +
        '<span class="frame-status" role="status"><i class="dot"></i><span class="status-text"></span></span>' +
        '<div class="frame-actions">' +
          '<button type="button" class="bar-btn" data-act="reload">' + icon('refresh', 16) + '<span>Reload</span></button>' +
          '<button type="button" class="bar-btn" data-act="help" aria-expanded="false">' + icon('alert', 16) + '<span>Trouble loading?</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="frame-stage">' +
        '<div class="overlay" data-el="loading"><div class="spinner" aria-hidden="true"></div><p>Loading ' + esc(m.title) + '</p></div>' +
        '<div class="overlay overlay-scroll" data-el="panel" hidden>' +
          '<div class="panel">' +
            '<div class="panel-head"><span class="panel-icon">' + icon('alert', 24) + '</span><h2 data-el="panel-title"></h2></div>' +
            '<p>The hub can only see that a document finished loading. Browsers do not let one site inspect another site inside a frame, so the hub cannot tell a working app from a browser error page.</p>' +
            '<ul>' +
              '<li>If the frame shows a message such as "refused to connect", the site is sending a header (X-Frame-Options or a Content-Security-Policy frame-ancestors rule) that forbids embedding.</li>' +
              '<li>A blank frame or a long wait usually means a network problem. Reloading often fixes it.</li>' +
              '<li>Pop-up, ad or tracking blockers can interfere with embedded pages.</li>' +
            '</ul>' +
            '<div class="panel-actions">' +
              '<button type="button" class="btn btn-blue" data-act="reload">' + icon('refresh', 16) + 'Reload</button>' +
              '<a class="btn btn-outline" href="' + esc(m.url) + '" target="_blank" rel="noopener noreferrer">' + icon('external', 16) + 'Open in a new tab</a>' +
              '<button type="button" class="btn btn-ghost" data-act="close" data-el="close-label"></button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    workspace.appendChild(root);

    var stage = root.querySelector('.frame-stage');
    var dot = root.querySelector('.dot');
    var statusText = root.querySelector('.status-text');
    var loading = root.querySelector('[data-el="loading"]');
    var panel = root.querySelector('[data-el="panel"]');
    var panelTitle = root.querySelector('[data-el="panel-title"]');
    var closeLabel = root.querySelector('[data-el="close-label"]');
    var helpBtn = root.querySelector('[data-act="help"]');

    var state = { status: 'loading', helpOpen: false, autoOpened: false, timer: null, iframe: null };

    function render() {
      var text = state.status === 'loaded'
        ? 'The page finished loading in this frame'
        : state.status === 'slow' ? 'Still waiting for the page to load' : 'Loading';
      statusText.textContent = text;
      dot.className = 'dot dot-' + state.status;
      panel.hidden = !state.helpOpen;
      loading.hidden = state.status === 'loaded' || state.helpOpen;
      helpBtn.setAttribute('aria-expanded', String(state.helpOpen));
      panelTitle.textContent = state.status === 'slow'
        ? m.title + ' is taking a long time to load'
        : 'If ' + m.title + ' does not appear';
      closeLabel.textContent = state.status === 'slow' ? 'Keep waiting' : 'Close';
    }

    function mount() {
      if (state.iframe) state.iframe.remove();
      window.clearTimeout(state.timer);
      state.status = 'loading';
      state.helpOpen = false;
      state.autoOpened = false;

      var f = document.createElement('iframe');
      f.title = m.title;
      f.setAttribute('allow', 'clipboard-write; fullscreen');
      f.addEventListener('load', function () {
        if (f !== state.iframe) return;
        window.clearTimeout(state.timer);
        state.status = 'loaded';
        if (state.autoOpened) { state.helpOpen = false; state.autoOpened = false; }
        render();
      });
      f.src = m.url;
      stage.insertBefore(f, stage.firstChild);
      state.iframe = f;

      state.timer = window.setTimeout(function () {
        if (state.status !== 'loading') return;
        state.status = 'slow';
        state.helpOpen = true;
        state.autoOpened = true;
        render();
      }, SLOW_AFTER_MS);
      render();
    }

    root.addEventListener('click', function (e) {
      var target = e.target.closest ? e.target.closest('[data-act]') : null;
      if (!target) return;
      var act = target.getAttribute('data-act');
      if (act === 'reload') {
        mount();
      } else if (act === 'help') {
        state.helpOpen = !state.helpOpen;
        state.autoOpened = false;
        render();
      } else if (act === 'close') {
        state.helpOpen = false;
        state.autoOpened = false;
        render();
      }
    });

    mount();
    return { root: root };
  }

  function ensureFrame(m) {
    if (!frames[m.id]) frames[m.id] = createFrame(m);
    return frames[m.id];
  }

  /* ---------- views ---------- */

  function dashboardView() {
    var cards = MODULES.map(function (m) {
      return '<article class="card">' +
        '<div class="card-top"><span class="tile tile-' + m.accent + '">' + icon(m.icon, 26) + '</span>' +
        '<span class="card-arrow arrow-' + m.accent + '">' + icon('arrowUpRight') + '</span></div>' +
        '<h2>' + esc(m.title) + '</h2>' +
        '<p>' + esc(m.description) + '</p>' +
        '<a class="btn btn-' + m.accent + '" href="#' + esc(m.route) + '">Open ' + esc(m.navLabel) + icon('arrowRight', 16) + '</a>' +
        '</article>';
    }).join('');

    var quick = MODULES.map(function (m) {
      return '<a class="quick-item" href="#' + esc(m.route) + '">' +
        '<span class="tile tile-small tile-' + m.accent + '">' + icon(m.icon) + '</span>' +
        '<span class="quick-text"><strong>' + esc(m.navLabel) + '</strong><span>' + esc(m.quickAccessLabel) + '</span></span>' +
        '<span class="quick-chevron">' + icon('chevronRight') + '</span></a>';
    }).join('');

    return '<div class="container">' +
      '<section class="hero">' +
        '<p class="eyebrow">Welcome to</p>' +
        '<h1>Operations Hub</h1>' +
        '<p class="hero-lead">Access all your Excel processing tools from one place.</p>' +
        '<p class="hero-sub">Select a module below or use the sidebar to get started.</p>' +
      '</section>' +
      '<section class="cards" aria-label="Modules">' + cards + '</section>' +
      '<section class="quick" aria-label="Quick access">' +
        '<h2>' + icon('clock') + 'Quick Access</h2>' +
        '<div class="quick-grid">' + quick + '</div>' +
      '</section>' +
    '</div>';
  }

  function legalShell(title, body) {
    return '<article class="container container-narrow"><div class="prose-card">' +
      '<h1>' + esc(title) + '</h1>' +
      '<p class="muted">Last updated ' + LEGAL_UPDATED + '</p>' +
      body + '</div></article>';
  }

  var repoLink = '<a href="' + REPO_URL + '" target="_blank" rel="noopener noreferrer">github.com/MeetFluorine</a>';

  function privacyView() {
    return legalShell('Privacy Policy',
      '<h2>What Operations Hub is</h2>' +
      '<p>Operations Hub is a navigation shell. It shows three separate Excel tools (MRS Pipeline, Issuance / FE Summary and Substore Stock) inside one page. The hub itself has no accounts, no database and no server of its own.</p>' +
      '<h2>Information the hub collects</h2>' +
      '<p>The hub does not collect, upload or store your files or any operational data. It does not use cookies, analytics or advertising trackers.</p>' +
      '<p>It saves two display preferences in your browser\'s local storage: your light or dark theme choice and whether the sidebar is collapsed. These stay on your device and are never sent anywhere. Clearing your browser data removes them.</p>' +
      '<h2>The embedded tools</h2>' +
      '<p>Each tool is a separate website that is hosted and maintained on its own address. The hub only displays them in a frame and cannot read or store what you load into them. The tools describe themselves as processing files inside your browser, and some of them keep settings in your browser\'s local storage. Their behaviour is governed by those sites, not by the hub.</p>' +
      '<h2>Hosting</h2>' +
      '<p>The hub is hosted on GitHub Pages. As with any web host, GitHub may record technical information such as IP addresses and request logs when you load the site. See the <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub Privacy Statement</a> for how GitHub handles that data.</p>' +
      '<h2>Changes and contact</h2>' +
      '<p>If this policy changes, the date above will be updated. Questions can be raised through the project owner on GitHub at ' + repoLink + '.</p>');
  }

  function termsView() {
    return legalShell('Terms and Conditions',
      '<h2>Acceptance</h2>' +
      '<p>By using Operations Hub you agree to these terms. If you do not agree, please do not use the site.</p>' +
      '<h2>What the service is</h2>' +
      '<p>Operations Hub provides a single place to open three existing Excel tools. It does not process, validate or store your data itself.</p>' +
      '<h2>Your responsibilities</h2>' +
      '<ul>' +
        '<li>You are responsible for the files you load into the tools and for checking the results they produce.</li>' +
        '<li>Use the tools only with data you are allowed to handle.</li>' +
        '<li>Do not attempt to disrupt the site or use it to break the law or the rights of others.</li>' +
      '</ul>' +
      '<h2>Third-party tools and services</h2>' +
      '<p>The embedded tools and the hosting platform are separate services. Their availability, accuracy and behaviour are outside the control of the hub, and they may change or become unavailable at any time.</p>' +
      '<h2>No warranty</h2>' +
      '<p>The site is provided "as is" and "as available", without warranties of any kind. To the fullest extent allowed by law, the owner is not liable for losses that result from using the site or from relying on output produced by the embedded tools.</p>' +
      '<h2>Changes and contact</h2>' +
      '<p>These terms may be updated from time to time, and the date above will change when they are. Questions can be raised through the project owner on GitHub at ' + repoLink + '.</p>');
  }

  function notFoundView() {
    return '<div class="container container-narrow"><div class="prose-card center">' +
      '<h1>Page not found</h1>' +
      '<p class="muted">This address does not match any page or module in Operations Hub.</p>' +
      '<p><a class="btn btn-blue" href="#/">Go to Dashboard</a></p>' +
      '</div></div>';
  }

  /* ---------- router ---------- */

  function currentPath() {
    var h = window.location.hash.replace(/^#/, '');
    if (h.charAt(0) !== '/') h = '/' + h;
    h = h.replace(/\/+$/, '');
    return h === '' ? '/' : h;
  }

  function findModule(path) {
    for (var i = 0; i < MODULES.length; i++) {
      if (MODULES[i].route === path) return MODULES[i];
    }
    return null;
  }

  function route() {
    var path = currentPath();
    var mod = findModule(path);
    var title;

    navLinks.forEach(function (a) {
      var on = a.getAttribute('data-route') === path;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });

    if (mod) ensureFrame(mod);
    Object.keys(frames).forEach(function (id) {
      frames[id].root.hidden = !(mod && mod.id === id);
    });

    if (mod) {
      page.hidden = true;
      title = mod.title;
    } else {
      var html;
      if (path === '/') { html = dashboardView(); title = 'Dashboard'; }
      else if (path === '/privacy') { html = privacyView(); title = 'Privacy Policy'; }
      else if (path === '/terms') { html = termsView(); title = 'Terms and Conditions'; }
      else { html = notFoundView(); title = 'Page not found'; }
      page.innerHTML = html;
      page.hidden = false;
      page.scrollTop = 0;
    }

    document.title = title + ' | ' + SITE_NAME;
    setDrawer(false);
  }

  window.addEventListener('hashchange', route);
  route();

  // Animations stay off until the first paint, so a saved collapsed sidebar does not visibly slide on load.
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () { app.classList.remove('no-anim'); });
  });
})();
