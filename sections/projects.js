import { html, raw, mount, $ } from "../utils/dom.js";
import { projectCard } from "../components/project-card.js";
import { initProjectTilt } from "../utils/interactions.js";
import { fetchGithubProjects } from "../utils/github.js";
import { initReveal } from "../utils/reveal.js";

export async function renderProjects(projects) {
  const featured = projects.featured.map((p) => projectCard(p)).join("");
  const more = projects.more.map((p) => projectCard(p, { compact: true })).join("");

  mount(
    "#projects",
    html`
      <div class="container">
        <div class="reveal">
          <div class="section-eyebrow">Projects</div>
          <h2 class="section-title">Selected work.</h2>
          <p class="section-subtitle">
            Production case studies plus open-source repos pulled live from GitHub.
          </p>
        </div>

        <div class="projects-grid">${raw(featured)}</div>

        ${
          more
            ? raw(`
              <div class="more-projects reveal">
                <h3 class="more-heading">More from the lab</h3>
                <div class="more-list">${more}</div>
              </div>
            `)
            : ""
        }

        <div id="github-section" class="more-projects reveal" data-github-mount></div>
      </div>
    `
  );

  initProjectTilt();

  // Lazy-load GitHub repos (don't block initial paint)
  if (projects.github?.enabled) {
    loadGithubProjects(projects.github);
  }
}

async function loadGithubProjects(cfg) {
  const mount = $("[data-github-mount]");
  if (!mount) return;

  // Skeleton while loading
  mount.innerHTML = `
    <h3 class="more-heading">
      <span class="gh-heading-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.37-3.88-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>
      </span>
      Live from GitHub
      <span class="gh-heading-meta">@${cfg.user}</span>
    </h3>
    <div class="more-list">
      ${Array(Math.min(cfg.allowlist.length, 6)).fill(0).map(() => `
        <div class="project-card project-card-skeleton">
          <div class="sk-line w60"></div>
          <div class="sk-line w90"></div>
          <div class="sk-line w70"></div>
        </div>
      `).join("")}
    </div>
  `;

  const repos = await fetchGithubProjects(cfg);

  if (!repos.length) {
    mount.innerHTML = `
      <h3 class="more-heading">
        <span class="gh-heading-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.37-3.88-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>
        </span>
        Live from GitHub
        <a href="https://github.com/${cfg.user}" target="_blank" rel="noopener" class="gh-heading-meta">@${cfg.user} ↗</a>
      </h3>
      <div class="gh-empty">
        <p><strong>GitHub API is briefly rate-limited</strong> for this network.</p>
        <p style="color: var(--text-muted); font-size: var(--fs-sm);">Repos cache for 1 hour after a successful fetch — usually a single page load fixes it. Or visit <a href="https://github.com/${cfg.user}" target="_blank" rel="noopener">github.com/${cfg.user} →</a> directly.</p>
      </div>
    `;
    return;
  }

  const cards = repos.map((r) => projectCard(r, { compact: true, showGithubMeta: true })).join("");

  mount.innerHTML = `
    <h3 class="more-heading">
      <span class="gh-heading-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.37-3.88-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>
      </span>
      Live from GitHub
      <a href="https://github.com/${cfg.user}" target="_blank" rel="noopener" class="gh-heading-meta">@${cfg.user} ↗</a>
    </h3>
    <div class="more-list">${cards}</div>
  `;

  initProjectTilt();
  initReveal();
}
