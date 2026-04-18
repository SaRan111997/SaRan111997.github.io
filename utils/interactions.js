/**
 * UX interactions: cursor glow, navbar scroll state, scroll spy, project tilt.
 */

import { $, $$ } from "./dom.js";

export function initCursorGlow(enabled = true) {
  if (!enabled) return;
  const glow = $(".cursor-glow");
  if (!glow) return;
  if (window.matchMedia("(hover: none)").matches) return;

  document.addEventListener("mousemove", (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
    glow.classList.add("active");
  });
  document.addEventListener("mouseleave", () => glow.classList.remove("active"));
}

export function initNavScroll() {
  const nav = $("#navbar");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

export function initScrollSpy() {
  const links = $$(".nav-links a");
  if (!links.length) return;
  const sections = links
    .map((l) => $(l.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = "#" + entry.target.id;
          links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === id));
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => observer.observe(s));
}

export function initProjectTilt() {
  $$(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });
  });
}

export function initSmoothScroll() {
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length <= 1) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: "smooth" });
      // Close mobile nav if open
      $(".nav-mobile")?.classList.remove("open");
    });
  });
}

export function initTyping(el, words, opts = {}) {
  if (!el || !words?.length) return;
  const { typeDelay = 70, eraseDelay = 35, pause = 1400 } = opts;
  let wIdx = 0;
  let cIdx = 0;
  let typing = true;

  const tick = () => {
    const word = words[wIdx];
    if (typing) {
      cIdx++;
      el.textContent = word.slice(0, cIdx);
      if (cIdx === word.length) {
        typing = false;
        return setTimeout(tick, pause);
      }
      setTimeout(tick, typeDelay);
    } else {
      cIdx--;
      el.textContent = word.slice(0, cIdx);
      if (cIdx === 0) {
        typing = true;
        wIdx = (wIdx + 1) % words.length;
      }
      setTimeout(tick, eraseDelay);
    }
  };
  tick();
}
