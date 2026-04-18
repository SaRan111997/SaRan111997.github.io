import { html, raw, mount } from "../utils/dom.js";
import { timelineItem } from "../components/timeline.js";
import { certIcon, eduIcon } from "../utils/tech-icons.js";

export function renderExperience(experience) {
  const items = experience.work.map(timelineItem).join("");

  const edu = experience.education
    .map(
      (e) => `
        <div class="edu-card with-icon">
          <span class="card-icon">${eduIcon({ size: 32 })}</span>
          <div>
            <h4>${e.degree}</h4>
            <p>${e.institution} · ${e.period}${e.score ? ` · ${e.score}` : ""}</p>
          </div>
        </div>
      `
    )
    .join("");

  const certs = experience.certifications
    .map((c) => {
      const Tag = c.url ? "a" : "div";
      const verifyVia = c.verifyVia || "Issuer";
      const attrs = c.url
        ? `href="${c.url}" target="_blank" rel="noopener" aria-label="Verify ${c.name} on ${verifyVia}"`
        : "";
      const dateStr = c.month ? `${c.month} ${c.year}` : `${c.year}`;

      // Use real badge image when present (AWS Credly badges),
      // otherwise fall back to issuer logo via certIcon().
      const iconHtml = c.badgeImage
        ? `<img class="cert-badge-img" src="${c.badgeImage}" alt="${c.name} badge" loading="lazy" decoding="async" />`
        : certIcon(c, { size: 32 });

      const verifyBadge = c.url
        ? `<span class="cert-verify" title="Open verification on ${verifyVia}">
             <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
             <span>Verify</span>
           </span>`
        : "";

      return `
        <${Tag} class="cert-card ${c.url ? "is-link" : ""} ${c.badgeImage ? "has-badge" : ""}" ${attrs}>
          <span class="cert-icon ${c.badgeImage ? "is-badge" : ""}">${iconHtml}</span>
          <div class="cert-body">
            <h4 class="cert-name">${c.name}</h4>
            <div class="cert-meta">
              <span class="cert-issuer">${c.issuer}</span>
              <span class="cert-dot">·</span>
              <span class="cert-date">${dateStr}</span>
              ${c.url ? `<span class="cert-dot">·</span><span class="cert-via">via ${verifyVia}</span>` : ""}
            </div>
          </div>
          ${verifyBadge}
        </${Tag}>
      `;
    })
    .join("");

  mount(
    "#experience",
    html`
      <div class="container">
        <div class="reveal">
          <div class="section-eyebrow">Experience</div>
          <h2 class="section-title">A journey, not a job list.</h2>
          <p class="section-subtitle">From QA scripts to AI-augmented DevSecOps — every role taught me something the next one needed.</p>
        </div>

        <div class="timeline">
          <span class="timeline-strip" aria-hidden="true"></span>
          ${raw(items)}
        </div>

        <div class="reveal" style="margin-top: 4rem;">
          <h3 class="section-title" style="font-size: var(--fs-xl);">Education</h3>
          <div class="edu-grid">${raw(edu)}</div>
        </div>

        <div class="reveal" style="margin-top: 3rem;">
          <h3 class="section-title" style="font-size: var(--fs-xl);">Certifications</h3>
          <div class="cert-grid">${raw(certs)}</div>
        </div>
      </div>
    `
  );
}
