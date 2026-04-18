import { html, raw, mount, $, on } from "../utils/dom.js";
import { icon } from "../utils/icons.js";
import { toggleTheme } from "../utils/theme.js";

export function renderNavbar(site) {
  const links = site.navigation
    .map((n) => `<li><a href="${n.href}">${n.label}</a></li>`)
    .join("");

  // Drawer items — number prefix + label, larger tap targets
  const drawerLinks = site.navigation
    .map(
      (n, i) => `
        <a href="${n.href}" class="drawer-link">
          <span class="drawer-link-num">0${i + 1}</span>
          <span class="drawer-link-label">${n.label}</span>
          <span class="drawer-link-arrow">${icon("arrow")}</span>
        </a>
      `
    )
    .join("");

  const socials = site.social
    .filter((s) => ["github", "linkedin", "mail"].includes(s.icon))
    .map(
      (s) => `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}">${icon(s.icon)}</a>`
    )
    .join("");

  // ---- Navbar bar ----
  mount(
    "#navbar",
    html`
      <div class="nav-inner">
        <a href="#hero" class="nav-brand" aria-label="${site.identity.name}">
          <span class="nav-brand-mark">${raw(site.identity.initials)}</span>
          <span class="nav-brand-text"><strong>${site.identity.shortName}</strong></span>
        </a>

        <nav aria-label="Primary">
          <ul class="nav-links">${raw(links)}</ul>
        </nav>

        <div class="nav-actions">
          <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
            ${raw(icon("sun"))}${raw(icon("moon"))}
          </button>
          <a href="#contact" class="btn btn-primary btn-sm hide-sm">Let's talk ${raw(icon("arrow"))}</a>
          <button class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false">
            <span class="nav-toggle-bars" aria-hidden="true">
              <span></span><span></span><span></span>
            </span>
          </button>
        </div>
      </div>
    `
  );

  // ---- Drawer (mounted OUTSIDE navbar so its position:fixed isn't trapped
  //      by the navbar's transform: translateX(-50%) containing block) ----
  mount(
    "#nav-drawer-root",
    html`
      <aside class="nav-mobile" id="nav-mobile" role="dialog" aria-modal="true" aria-label="Navigation menu" aria-hidden="true">
        <div class="drawer-head">
          <span class="drawer-title">Menu</span>
          <button class="drawer-close" id="nav-close" aria-label="Close menu">${raw(icon("close"))}</button>
        </div>

        <nav class="drawer-nav" aria-label="Mobile primary">
          ${raw(drawerLinks)}
        </nav>

        <a href="#contact" class="btn btn-primary drawer-cta">Let's talk ${raw(icon("arrow"))}</a>

        <div class="drawer-foot">
          <div class="drawer-socials">${raw(socials)}</div>
          <p class="drawer-tag">${site.identity.title}</p>
        </div>
      </aside>
    `
  );

  on($("#theme-toggle"), "click", toggleTheme);

  const drawer = $("#nav-mobile");
  const backdrop = $("#nav-backdrop");
  const toggleBtn = $("#nav-toggle");

  const setOpen = (open) => {
    drawer.classList.toggle("open", open);
    backdrop.classList.toggle("open", open);
    toggleBtn.classList.toggle("is-open", open);
    toggleBtn.setAttribute("aria-expanded", String(open));
    drawer.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  on(toggleBtn, "click", () => setOpen(!drawer.classList.contains("open")));
  on($("#nav-close"), "click", () => setOpen(false));
  on(backdrop, "click", () => setOpen(false));

  // Close on link tap
  drawer.querySelectorAll("a").forEach((a) => on(a, "click", () => setOpen(false)));

  // Close on escape
  on(document, "keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) setOpen(false);
  });
}
