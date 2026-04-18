/**
 * Brand / tech icons via Simple Icons CDN — masked with CSS so they
 * pick up `currentColor` and respect the theme.
 *
 * Usage:
 *   techIcon("AWS")                  → <span class="tech-icon"…
 *   techIcon("Docker", { size: 24 })
 *   certIcon({ issuer: "AWS" })      → resolves issuer to brand
 *   eduIcon()                        → inline graduation cap SVG
 */

const CDN = "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons";

/* Brand colors per slug. Object form { dark, light } means theme-dependent. */
const BRAND_COLORS = {
  // Cloud
  amazonwebservices: "#FF9900",
  microsoftazure: "#0078D4",
  googlecloud: "#4285F4",

  // IaC / DevOps
  terraform: "#844FBA",
  ansible: "#EE0000",
  docker: "#2496ED",
  kubernetes: "#326CE5",
  helm: "#0F1689",
  jenkins: "#D24939",
  githubactions: "#2088FF",
  gitlab: "#FC6D26",
  circleci: { dark: "#FFFFFF", light: "#161616" },
  argo: "#EF7B4D",
  vault: "#FFEC6E",
  consul: "#F24C53",
  prometheus: "#E6522C",
  grafana: "#F46800",
  splunk: { dark: "#FFFFFF", light: "#000000" },
  elastic: "#005571",
  elasticsearch: "#005571",

  // VCS
  git: "#F05032",
  github: { dark: "#FFFFFF", light: "#181717" },
  bitbucket: "#0052CC",

  // Languages
  python: "#3776AB",
  gnubash: "#4EAA25",
  mysql: "#4479A1",
  javascript: "#F7DF1E",
  typescript: "#3178C6",
  go: "#00ADD8",
  openjdk: "#007396",
  html5: "#E34F26",
  css3: "#1572B6",
  php: "#777BB4",

  // Security
  aquasec: "#1904DA",
  burpsuite: "#FF6633",
  metasploit: "#2596CD",
  nmap: "#4682B4",
  kalilinux: "#557C94",
  wireshark: "#1679A7",
  snyk: "#4C4A73",
  zoho: "#C8202F",
  linuxfoundation: { dark: "#FFFFFF", light: "#003366" },

  // OS
  linux: "#FCC624",
  ubuntu: "#E95420",
  windows11: "#0078D6",

  // AI / LLM
  openai: { dark: "#FFFFFF", light: "#412991" },
  langchain: { dark: "#FFFFFF", light: "#1C3C3C" },
  huggingface: "#FFD21E",
  tensorflow: "#FF6F00",
  pytorch: "#EE4C2C",
  claude: "#D97757",
  anthropic: { dark: "#FFFFFF", light: "#181818" },
  ollama: { dark: "#FFFFFF", light: "#000000" },
  googlegemini: "#8E75B2",
  perplexity: "#1FB8CD",
  githubcopilot: { dark: "#FFFFFF", light: "#000000" },

  // QA / misc
  selenium: "#43B02A",
  android: "#3DDC84",
  androidstudio: "#3DDC84",
  adobephotoshop: "#31A8FF",
  adobepremierepro: "#9999FF",
  microsoftoffice: "#D83B01",

  // Cert issuers
  udemy: "#A435F0",
  hackerrank: "#00EA64",
  coursera: "#0056D2",
  linkedin: "#0A66C2",
  google: "#4285F4",
  microsoft: "#5E5E5E",
};

const colorFor = (slug) => {
  const c = BRAND_COLORS[slug];
  if (!c) return null;
  if (typeof c === "string") return c;
  return null; // theme-dependent — handled by CSS via data-brand attr
};

/* --- Slug map: skill/tool name (lowercased) → Simple Icons slug --- */
const SLUGS = {
  // Cloud
  "aws": "amazonwebservices",
  "amazon web services": "amazonwebservices",
  "amazon": "amazonwebservices",
  "azure": "microsoftazure",
  "gcp": "googlecloud",
  "google cloud": "googlecloud",

  // IaC / DevOps
  "terraform": "terraform",
  "ansible": "ansible",
  "docker": "docker",
  "kubernetes": "kubernetes",
  "k8s": "kubernetes",
  "helm": "helm",
  "jenkins": "jenkins",
  "github actions": "githubactions",
  "gitlab": "gitlab",
  "circleci": "circleci",
  "argocd": "argo",
  "vault": "vault",
  "consul": "consul",
  "prometheus": "prometheus",
  "grafana": "grafana",
  "splunk": "splunk",
  "elastic": "elastic",
  "elasticsearch": "elasticsearch",

  // VCS
  "git": "git",
  "github": "github",
  "bitbucket": "bitbucket",

  // Languages
  "python": "python",
  "bash": "gnubash",
  "shell": "gnubash",
  "shell / bash": "gnubash",
  "sql": "mysql",
  "javascript": "javascript",
  "typescript": "typescript",
  "go": "go",
  "java": "openjdk",
  "html5/css3": "html5",
  "html": "html5",
  "css": "css3",

  // Security
  "trivy": "aquasec",
  "burpsuite": "burpsuite",
  "burp suite": "burpsuite",
  "metasploit": "metasploit",
  "nmap": "nmap",
  "kali": "kalilinux",
  "wireshark": "wireshark",
  "snyk": "snyk",
  "cosign": "linuxfoundation",
  "kyverno": "kubernetes",
  "splunk": "splunk",
  "zoho": "zoho",

  // OS
  "linux": "linux",
  "linux admin": "linux",
  "ubuntu": "ubuntu",
  "windows": "windows11",

  // AI / LLM tooling
  "openai": "openai",
  "langchain": "langchain",
  "huggingface": "huggingface",
  "tensorflow": "tensorflow",
  "pytorch": "pytorch",
  "claude": "claude",
  "anthropic": "anthropic",
  "ollama": "ollama",
  "codex": "openai",
  "codex ide": "openai",
  "openai codex": "openai",
  "github copilot": "githubcopilot",
  "copilot": "githubcopilot",
  "antigravity": "google",
  "google antigravity": "google",
  "gemini": "googlegemini",
  "perplexity": "perplexity",

  // QA / Misc
  "selenium": "selenium",
  "android": "android",
  "android studio": "androidstudio",
  "php/mysql": "php",
  "php": "php",
  "mysql": "mysql",
  "photoshop": "adobephotoshop",
  "premier pro": "adobepremierepro",
  "ms office suite": "microsoftoffice",

  // Cert issuers
  "udemy": "udemy",
  "hackerrank": "hackerrank",
  "coursera": "coursera",
  "linkedin": "linkedin",
  "google": "google",
  "microsoft": "microsoft",
};

/* --- Custom branded inline SVGs (when Simple Icons doesn't have it) ---
       Supports two forms:
         { svg: "<svg…>", color: "#hex" }      — inline SVG (currentColor-able)
         { type: "image", src: "https://…" }   — external image URL (renders as <img>)
*/
const CUSTOM_BRANDS = {
  crowdstrike: {
    type: "image",
    src: "assets/icons/crowdstrike.webp",
    rounded: true,
  },
  antigravity: {
    type: "image",
    src: "assets/icons/antigravity.png",
  },
  codex: {
    color: "#000000",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 9l-3 3 3 3"/><path d="M15 9l3 3-3 3"/></svg>`,
  },
  cursor: {
    color: "#000000",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M3 3l7 18 2.5-7.5L20 11z"/></svg>`,
  },
  mistral: {
    color: "#FF7000",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="2" y="3" width="4" height="4"/><rect x="6" y="7" width="4" height="4"/><rect x="10" y="11" width="4" height="4"/><rect x="14" y="7" width="4" height="4"/><rect x="18" y="3" width="4" height="4"/><rect x="2" y="11" width="4" height="4"/><rect x="2" y="15" width="4" height="4"/><rect x="14" y="15" width="4" height="4"/><rect x="18" y="15" width="4" height="4"/></svg>`,
  },
  aiops: {
    color: "#06B6D4",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l4-7 4 4 5-9 5 12"/><circle cx="7" cy="10" r="1.6" fill="currentColor"/><circle cx="11" cy="14" r="1.6" fill="currentColor"/><circle cx="16" cy="5" r="1.6" fill="currentColor"/></svg>`,
  },
  rag: {
    color: "#10B981",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="M9 6h6"/><path d="M7.5 8.5l3 7"/><path d="M16.5 8.5l-3 7"/></svg>`,
  },
  genai: {
    color: "#A855F7",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`,
  },
  siem: {
    color: "#F59E0B",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 12l8-4"/></svg>`,
  },
};

/* --- Concept icons (no brand) → inline SVG --- */
const CONCEPT_ICONS = {
  security: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  cloud: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.78A6 6 0 0 0 4 13a4 4 0 0 0 1 7.87"/></svg>`,
  pipeline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h6a4 4 0 0 1 4 4v6"/></svg>`,
  ai: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h.01"/><path d="M15 9h.01"/><path d="M9 15c1.5 1 4.5 1 6 0"/></svg>`,
  hack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`,
  cap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>`,
  cert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="m9 14-2 8 5-3 5 3-2-8"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  radar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="m12 12 7-3"/></svg>`,
  graph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M8 6h8"/><path d="m7.5 8 4 8"/><path d="m16.5 8-4 8"/></svg>`,
  brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08A3 3 0 0 1 2 14.5a3 3 0 0 1 .55-1.85A2.5 2.5 0 0 1 4 9.5a3 3 0 0 1 3-3 3 3 0 0 1 2.5-4.5z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08A3 3 0 0 0 22 14.5a3 3 0 0 0-.55-1.85A2.5 2.5 0 0 0 20 9.5a3 3 0 0 0-3-3 3 3 0 0 0-2.5-4.5z"/></svg>`,
};

/* --- Concept matchers (when no direct brand fits) --- */
const CONCEPT_MATCHERS = [
  { test: (n) => /^crowd?strike/i.test(n), key: "radar" },
  { test: (n) => /^siem$|security info/i.test(n), key: "radar" },
  { test: (n) => /^aiops|ai ops/i.test(n), key: "graph" },
  { test: (n) => /^rag$|retrieval.aug/i.test(n), key: "graph" },
  { test: (n) => /^genai|generative ai/i.test(n), key: "brain" },
  { test: (n) => /llm orchestrat|llm integration|^llm$|^llms$/i.test(n), key: "brain" },
  { test: (n) => /ccsk|cloud security/i.test(n), key: "shield" },
  { test: (n) => /devsecops|sast|dast|pipeline/i.test(n), key: "pipeline" },
  { test: (n) => /ethical hacking|pentest|hack the box|htb/i.test(n), key: "hack" },
  { test: (n) => /antigravity/i.test(n), key: "ai" },
  { test: (n) => /cursor|copilot ide/i.test(n), key: "ai" },
  { test: (n) => /mistral/i.test(n), key: "ai" },
  { test: (n) => /security/i.test(n), key: "security" },
  { test: (n) => /networking|system/i.test(n), key: "cloud" },
];

const slugFor = (name) => {
  const k = name.trim().toLowerCase();
  if (SLUGS[k]) return SLUGS[k];
  // try to derive a slug from the name (collapse spaces & punctuation)
  const derived = k.replace(/[^a-z0-9]+/g, "");
  return derived || null;
};

/* --- Public API --- */

export function techIcon(name, { size = 18, className = "" } = {}) {
  if (!name) return "";
  const lc = name.trim().toLowerCase();

  // 1. Custom branded inline SVG (highest priority — colored)
  const customKey = lc.replace(/[^a-z0-9]+/g, "");
  const custom = CUSTOM_BRANDS[customKey] ||
                 (lc.includes("crowd") && CUSTOM_BRANDS.crowdstrike) ||
                 (lc.includes("antigravity") && CUSTOM_BRANDS.antigravity) ||
                 (lc.includes("codex") && CUSTOM_BRANDS.codex) ||
                 (lc.includes("cursor") && CUSTOM_BRANDS.cursor) ||
                 (lc.includes("mistral") && CUSTOM_BRANDS.mistral) ||
                 (lc === "aiops" || lc === "ai ops" ? CUSTOM_BRANDS.aiops : null) ||
                 (lc === "rag" ? CUSTOM_BRANDS.rag : null) ||
                 (lc === "genai" || lc === "generative ai" ? CUSTOM_BRANDS.genai : null) ||
                 (lc === "siem" ? CUSTOM_BRANDS.siem : null);
  if (custom) {
    if (custom.type === "image") {
      const cls = `tech-icon tech-icon-img ${custom.rounded ? "is-rounded" : ""} ${className}`.trim();
      return `<img class="${cls}" data-brand="${customKey}" src="${custom.src}" style="--ts: ${size}px" alt="" aria-hidden="true" loading="lazy" decoding="async" />`;
    }
    return `<span class="tech-icon tech-icon-svg branded-custom ${className}" data-brand="${customKey}" style="--ts: ${size}px; color: ${custom.color || "currentColor"}" aria-hidden="true">${custom.svg}</span>`;
  }

  // 2. Concept fallback (uses theme accent)
  for (const m of CONCEPT_MATCHERS) {
    if (m.test(name)) {
      return `<span class="tech-icon tech-icon-svg ${className}" style="--ts: ${size}px" aria-hidden="true">${CONCEPT_ICONS[m.key]}</span>`;
    }
  }

  // 3. Simple Icons CDN (mask + brand color)
  const slug = slugFor(name);
  if (!slug) {
    return `<span class="tech-icon tech-icon-svg ${className}" style="--ts: ${size}px" aria-hidden="true">${CONCEPT_ICONS.code}</span>`;
  }
  const url = `${CDN}/${slug}.svg`;
  const color = colorFor(slug);
  const colorVar = color ? `; --icon-color: ${color}` : "";
  return `<span class="tech-icon brand ${className}" data-brand="${slug}" style="--ts: ${size}px; --icon: url('${url}')${colorVar}" aria-hidden="true"></span>`;
}

/** For a certification — pick the issuer brand if recognised, else cert ribbon. */
export function certIcon(cert, opts = {}) {
  const issuer = (cert?.issuer || "").toLowerCase();
  if (issuer.includes("aws") || issuer.includes("amazon")) return techIcon("AWS", opts);
  if (issuer.includes("udemy")) return techIcon("Udemy", opts);
  if (issuer.includes("hackerrank")) return techIcon("HackerRank", opts);
  if (issuer.includes("coursera")) return techIcon("Coursera", opts);
  if (issuer.includes("google")) return techIcon("Google", opts);
  if (issuer.includes("microsoft")) return techIcon("Microsoft", opts);
  if (issuer.includes("linkedin")) return techIcon("LinkedIn", opts);
  return `<span class="tech-icon tech-icon-svg" style="--ts: ${opts.size || 22}px" aria-hidden="true">${CONCEPT_ICONS.cert}</span>`;
}

export function eduIcon({ size = 22 } = {}) {
  return `<span class="tech-icon tech-icon-svg" style="--ts: ${size}px" aria-hidden="true">${CONCEPT_ICONS.cap}</span>`;
}
