import { html, raw } from "../utils/dom.js";
import { techIcon } from "../utils/tech-icons.js";

export function timelineItem(item) {
  const tech = (item.tech || [])
    .map((t) => `<span>${techIcon(t, { size: 16 })}${t}</span>`)
    .join("");
  const highlights = (item.highlights || []).map((h) => `<li>${h}</li>`).join("");

  return html`
    <div class="timeline-item reveal">
      <div class="timeline-meta">${item.period}${item.location ? ` · ${item.location}` : ""}</div>
      <h3 class="timeline-title">${item.role}</h3>
      <div class="timeline-company">${item.company}</div>
      <p class="timeline-desc">${item.description}</p>
      ${raw(highlights ? `<ul class="timeline-highlights">${highlights}</ul>` : "")}
      ${raw(tech ? `<div class="timeline-tech">${tech}</div>` : "")}
    </div>
  `;
}
