/**
 * SaRan Portfolio — entry point.
 *
 * Architecture:
 *   - JSON-driven content (config/*.json)
 *   - Feature flags toggle entire sections
 *   - Plug-in style sections (each is a render function)
 *   - Zero build step → deploys to GitHub Pages as-is
 */

import { loadConfig } from "./utils/config.js";
import { initTheme } from "./utils/theme.js";
import { initReveal } from "./utils/reveal.js";
import {
  initCursorGlow,
  initNavScroll,
  initScrollSpy,
  initSmoothScroll,
} from "./utils/interactions.js";

import { renderNavbar } from "./components/navbar.js";
import { renderFooter } from "./components/footer.js";

import { renderHero } from "./sections/hero.js";
import { renderAbout } from "./sections/about.js";
import { renderSkills } from "./sections/skills.js";
import { renderExperience } from "./sections/experience.js";
import { renderProjects } from "./sections/projects.js";
import { renderContact } from "./sections/contact.js";

const SECTIONS = {
  hero: (c) => renderHero(c.site, c.features),
  about: (c) => renderAbout(c.site),
  skills: (c) => renderSkills(c.skills),
  experience: (c) => renderExperience(c.experience),
  projects: (c) => renderProjects(c.projects),
  contact: (c) => renderContact(c.site, c.features),
};

async function bootstrap() {
  let config;
  try {
    config = await loadConfig();
  } catch (err) {
    console.error("Failed to load config", err);
    document.getElementById("main").innerHTML = `
      <div style="padding: 4rem 1rem; text-align: center;">
        <h1>Couldn't load portfolio data.</h1>
        <p style="color: var(--text-muted);">Try refreshing — or check the browser console.</p>
      </div>`;
    return;
  }

  // Document title from config
  document.title = `${config.site.identity.name} — ${config.site.identity.title}`;

  // Theme + navbar + footer
  initTheme(config.features);
  renderNavbar(config.site);
  renderFooter(config.site);

  // Render enabled sections (feature-flagged)
  const order = config.site.navigation.map((n) => n.href.replace("#", ""));
  const allSections = ["hero", ...order];

  for (const id of allSections) {
    const enabled = config.features.sections?.[id];
    const section = document.getElementById(id);
    if (!enabled) {
      section?.remove();
      continue;
    }
    SECTIONS[id]?.(config);
  }

  // UX layer (after DOM is in place)
  initSmoothScroll();
  initNavScroll();
  initScrollSpy();
  initCursorGlow(config.features.animations.cursorGlow);
  initReveal();
}

bootstrap();
