/**
 * Loads all JSON config files in parallel.
 * Returns a single object with all content, ready for sections.
 */

const CONFIG_FILES = {
  site: "config/site.json",
  features: "config/features.json",
  skills: "config/skills.json",
  experience: "config/experience.json",
  projects: "config/projects.json",
};

export async function loadConfig() {
  const entries = await Promise.all(
    Object.entries(CONFIG_FILES).map(async ([key, path]) => {
      const res = await fetch(`${path}?v=${Date.now()}`, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
      return [key, await res.json()];
    })
  );
  return Object.fromEntries(entries);
}
