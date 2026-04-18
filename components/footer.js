import { html, raw, mount } from "../utils/dom.js";
import { icon } from "../utils/icons.js";

export function renderFooter(site) {
  const socials = site.social
    .map(
      (s) => `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}">${icon(s.icon)}</a>`
    )
    .join("");

  const copy = site.footer.copyright.replace("{year}", new Date().getFullYear());

  mount(
    "#footer",
    html`
      <div class="footer-inner">
        <div>
          <strong>${site.identity.name}</strong>
          <div style="color: var(--text-soft); font-size: var(--fs-xs); margin-top: 4px;">${site.footer.tagline}</div>
        </div>
        <div class="footer-socials">${raw(socials)}</div>
        <div style="font-size: var(--fs-xs); color: var(--text-soft);">${copy}</div>
      </div>
    `
  );
}
