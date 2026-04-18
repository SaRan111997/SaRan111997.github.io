/**
 * Tiny DOM helpers — no framework, but ergonomic.
 */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/**
 * Tagged template helper for safe HTML strings.
 * Auto-escapes interpolated values (unless wrapped with `raw()`).
 */
export const html = (strings, ...values) => {
  let out = "";
  strings.forEach((str, i) => {
    out += str;
    if (i < values.length) {
      const v = values[i];
      if (v && typeof v === "object" && v.__raw) out += v.value;
      else if (Array.isArray(v)) out += v.join("");
      else if (v == null) out += "";
      else out += escapeHtml(String(v));
    }
  });
  return out;
};

export const raw = (value) => ({ __raw: true, value });

export const escapeHtml = (str) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const mount = (selector, htmlString) => {
  const el = typeof selector === "string" ? $(selector) : selector;
  if (el) el.innerHTML = htmlString;
  return el;
};

export const on = (target, event, handler, options) => {
  target.addEventListener(event, handler, options);
  return () => target.removeEventListener(event, handler, options);
};
