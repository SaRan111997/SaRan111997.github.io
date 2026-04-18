import { html, raw, mount } from "../utils/dom.js";
import { icon } from "../utils/icons.js";
import { techIcon } from "../utils/tech-icons.js";

export function renderSkills(skills) {
  const categories = skills.categories
    .map(
      (cat) => `
        <div class="skill-category reveal">
          <div class="skill-category-header">
            <div class="skill-category-icon">${icon(cat.icon)}</div>
            <div class="skill-category-name">${cat.name}</div>
          </div>
          <div>
            ${cat.skills
              .map(
                (s) => `
                  <div class="skill-row">
                    <div class="skill-row-head">
                      <span class="skill-row-name">
                        <span class="skill-row-icon">${techIcon(s.name, { size: 22 })}</span>
                        ${s.name}
                      </span>
                      <span class="skill-row-pct">${s.level}%</span>
                    </div>
                    <div class="skill-bar">
                      <div class="skill-bar-fill" data-fill="${s.level}"></div>
                    </div>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      `
    )
    .join("");

  const tools = skills.tools
    .map(
      (t) => `<span class="tool-chip">${techIcon(t, { size: 22 })}<span>${t}</span></span>`
    )
    .join("");

  mount(
    "#skills",
    html`
      <div class="container">
        <div class="reveal">
          <div class="section-eyebrow">Skills</div>
          <h2 class="section-title">Tools I reach for.</h2>
          <p class="section-subtitle">
            A mix of cloud, security, and automation — chosen because they let me move fast without breaking trust.
          </p>
        </div>

        <div class="skills-grid">
          ${raw(categories)}
        </div>

        <div class="reveal" style="margin-top: 2rem;">
          <div class="tools-cloud">${raw(tools)}</div>
        </div>
      </div>
    `
  );
}
