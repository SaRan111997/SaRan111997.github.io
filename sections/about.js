import { html, raw, mount } from "../utils/dom.js";

export function renderAbout(site) {
  const stats = [
    { value: "4+", label: "Years in production" },
    { value: "20+", label: "Pipelines shipped" },
    { value: "6", label: "AWS / Security certs" },
    { value: "∞", label: "Things to learn" },
  ];

  mount(
    "#about",
    html`
      <div class="container">
        <div class="reveal">
          <div class="section-eyebrow">About</div>
          <h2 class="section-title">A quick intro.</h2>
          <p class="section-subtitle">
            I'm an engineer who treats security like a product feature — designed in, not bolted on.
          </p>
        </div>

        <div class="about-grid">
          <div class="about-bio reveal reveal-delay-1">
            <p>
              I'm Saravana — most people call me <strong>SaRan</strong>. For the last four-plus years
              I've been building cloud infrastructure and CI/CD pipelines that ship fast
              <em>and</em> safely. My happy place is the intersection of <strong>DevOps</strong>,
              <strong>cloud security</strong>, and <strong>automation</strong>.
            </p>
            <p>
              Right now at <strong>${site.identity.currentCompany}</strong> I'm exploring how
              LLMs can take the toil out of security workflows — automated PR reviews,
              policy explanations, and incident triage that actually feels useful.
            </p>
            <p>
              Outside work I'm usually breaking things on HackTheBox, tinkering with home-lab
              gear, or making short videos about Linux and cybersecurity in Tamil.
            </p>
          </div>

          <div class="about-stats stagger reveal-delay-2">
            ${raw(stats.map((s) => `
              <div class="stat-card">
                <div class="stat-value">${s.value}</div>
                <div class="stat-label">${s.label}</div>
              </div>
            `).join(""))}
          </div>
        </div>
      </div>
    `
  );
}
