/**
 * GitHub repo fetcher.
 *
 * Strategy:
 *   - One API call per page load (NOT one per repo) — fetches all the user's
 *     repos in a single request, then filters client-side by allowlist.
 *     This lowers our hit rate from N/page to 1/page.
 *   - localStorage cache (1-hour TTL) so most reloads use ZERO API calls.
 *   - Stale-while-error: if the API is rate-limited (HTTP 403), serve the last
 *     cached payload regardless of age. Empty cache → empty result + UI fallback.
 *   - In-memory dedupe so concurrent calls in the same tab don't double-fetch.
 *
 * Public API (unchanged): fetchGithubProjects(cfg) → Project[]
 */

const API = "https://api.github.com";
const CACHE_KEY = "gh_repos_cache_v2";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let inflight = null;

async function fetchAllRepos(user) {
  // 1) Fresh cache hit
  const cached = readCache(user);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.data;
  }

  // 2) Dedupe concurrent calls
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const res = await fetch(
        `${API}/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`,
        { headers: { Accept: "application/vnd.github+json" } }
      );
      if (!res.ok) {
        // Rate limited or other error — return stale cache if we have any
        if (cached) {
          console.warn(`GitHub API ${res.status} — using stale cache`);
          return cached.data;
        }
        throw new Error(`GitHub API ${res.status}`);
      }
      const data = await res.json();
      writeCache(user, data);
      return data;
    } catch (e) {
      if (cached) {
        console.warn("GitHub fetch failed, using stale cache:", e.message);
        return cached.data;
      }
      console.warn("GitHub fetch failed:", e.message);
      return null;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

function readCache(user) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.user !== user) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(user, data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ user, ts: Date.now(), data })
    );
  } catch {
    /* quota exceeded — silently skip */
  }
}

export async function fetchGithubProjects(cfg) {
  if (!cfg?.enabled || !cfg.user || !Array.isArray(cfg.allowlist) || !cfg.allowlist.length) {
    return [];
  }

  const all = await fetchAllRepos(cfg.user);
  if (!all || !Array.isArray(all)) return [];

  // Case-insensitive lookup, preserve allowlist order
  const lookup = new Map(all.map((r) => [r.name.toLowerCase(), r]));
  return cfg.allowlist
    .map((name) => lookup.get(name.toLowerCase()))
    .filter(Boolean)
    .map(normalizeRepo);
}

function normalizeRepo(r) {
  const topics = Array.isArray(r.topics) ? r.topics : [];
  const tech = [r.language, ...topics.slice(0, 3)].filter(Boolean);
  return {
    title: prettyName(r.name),
    summary: r.description || "Open-source project — see GitHub for details.",
    description: r.description || "",
    tech,
    tags: topics,
    github: r.html_url,
    demo: r.homepage && r.homepage.startsWith("http") ? r.homepage : null,
    year: new Date(r.updated_at || r.pushed_at || r.created_at).getFullYear(),
    stars: r.stargazers_count || 0,
    forks: r.forks_count || 0,
    isGithub: true,
    archived: !!r.archived,
  };
}

function prettyName(name) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
