/**
 * Theme management — persists to localStorage, respects system preference.
 */

const KEY = "theme";

export function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "dark";
}

export function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem(KEY, theme); } catch (_) {}
  document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

export function initTheme(features) {
  if (!features?.theme?.respectSystemPreference) return;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", (e) => {
    // Only auto-switch if user hasn't explicitly chosen
    try {
      if (!localStorage.getItem(KEY)) {
        setTheme(e.matches ? "dark" : "light");
      }
    } catch (_) {}
  });
}
