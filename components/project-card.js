import { html, raw } from "../utils/dom.js";
import { icon } from "../utils/icons.js";
import { techIcon } from "../utils/tech-icons.js";

export function projectCard(p, { compact = false, showGithubMeta = false } = {}) {
  const tech = (p.tech || [])
    .map((t) => `<span>${techIcon(t, { size: 16 })}${t}</span>`)
    .join("");
  const actions = [];
  if (p.github) {
    actions.push(`<a href="${p.github}" target="_blank" rel="noopener">${icon("github")} Code</a>`);
  }
  if (p.demo) {
    actions.push(`<a href="${p.demo}" target="_blank" rel="noopener">${icon("external")} Live</a>`);
  }

  // GitHub-meta badges (stars, forks)
  const ghMeta = (showGithubMeta || p.isGithub) && (p.stars != null || p.forks != null)
    ? `<div class="project-gh-meta">
        ${p.stars != null ? `<span title="Stars">⭐ ${p.stars}</span>` : ""}
        ${p.forks != null ? `<span title="Forks">⑂ ${p.forks}</span>` : ""}
        ${p.archived ? `<span class="archived-badge">Archived</span>` : ""}
      </div>`
    : "";

  return html`
    <article class="project-card reveal ${p.isGithub ? "project-card-gh" : ""}">
      <header class="project-head">
        <h3 class="project-title">${p.title}</h3>
        ${p.year ? raw(`<span class="project-year">${p.year}</span>`) : ""}
      </header>
      <p class="project-summary">${compact ? p.summary : (p.description || p.summary)}</p>
      ${raw(ghMeta)}
      ${raw(tech ? `<div class="project-tech">${tech}</div>` : "")}
      ${raw(actions.length ? `<div class="project-actions">${actions.join("")}</div>` : "")}
    </article>
  `;
}
