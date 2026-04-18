import { html, raw, mount, $ } from "../utils/dom.js";
import { icon } from "../utils/icons.js";
import { initTyping } from "../utils/interactions.js";
import { mountTerminal } from "../components/terminal.js";

export function renderHero(site, features) {
  const { identity } = site;

  mount(
    "#hero",
    html`
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="hero-status reveal">
            <span class="dot"></span>
            ${identity.availability}
          </div>

          <h1 class="hero-title reveal reveal-delay-1">
            Hi, I'm <span class="gradient-text">${identity.shortName}</span>.<br />
            I build secure cloud platforms.
          </h1>

          <p class="hero-tagline reveal reveal-delay-2">${identity.intro}</p>

          <div class="hero-meta reveal reveal-delay-3">
            <span class="hero-meta-item">${raw(icon("location"))} ${identity.location}</span>
            <span class="hero-meta-item">${raw(icon("briefcase"))} ${identity.yearsOfExperience} yrs · ${identity.currentCompany}</span>
          </div>

          <div class="hero-cta reveal reveal-delay-4">
            <a href="#contact" class="btn btn-primary">
              ${raw(icon("mail"))} Get in touch
            </a>
            <a href="${identity.resumeUrl}" class="btn btn-ghost" download>
              ${raw(icon("download"))} Resume
            </a>
            <a href="https://github.com/SaRan111997" target="_blank" rel="noopener" class="btn btn-ghost">
              ${raw(icon("github"))} GitHub
            </a>
          </div>

          ${features.animations.heroTyping ? raw(`<div class="hero-typing reveal reveal-delay-4" id="hero-typing"></div>`) : ""}
        </div>

        <div class="hero-visual reveal" id="hero-terminal-mount"></div>
      </div>
    `
  );

  if (features.animations.heroTyping) {
    initTyping($("#hero-typing"), [
      "$ terraform apply --auto-approve",
      "$ kubectl rollout status",
      "$ trivy scan --severity HIGH,CRITICAL",
      "$ python ai-reviewer.py --pr 42",
    ]);
  }

  // Mount the interactive terminal
  mountTerminal($("#hero-terminal-mount"));
}
