# SaRan Portfolio

Modern, JSON-driven, modular portfolio for **Saravana Kumar B** — DevSecOps Engineer.
Zero build step. Deploys to GitHub Pages as-is. Designed for extension.

---

## ✨ Highlights

- **Static + ES modules** — no bundler, no `npm install`. Works on GitHub Pages out of the box.
- **JSON-driven content** — every section reads from `/config/*.json`. Update content without touching code.
- **Feature flags** — toggle entire sections (`blog`, `chatbot`, etc.) via `config/features.json`.
- **Pluggable email** — Formspree by default; swap providers in one line.
- **Themed** — dark/light mode with system-preference respect and persistence.
- **Animated** — scroll reveal, cursor glow, typing effect, gradient orbs. All respect `prefers-reduced-motion`.
- **Accessible** — semantic HTML, skip-link, ARIA labels, keyboard navigable, focus rings.
- **Responsive** — mobile-first, tested down to 360px.

---

## 📁 Structure

```
.
├── index.html              # Single entry, semantic shell
├── main.js                 # Bootstrap + section orchestration
├── /config                 # JSON content (the source of truth)
│   ├── site.json
│   ├── features.json       # Feature flags + email provider
│   ├── skills.json
│   ├── experience.json
│   └── projects.json
├── /sections               # One module per page section
│   ├── hero.js
│   ├── about.js
│   ├── skills.js
│   ├── experience.js
│   ├── projects.js
│   └── contact.js
├── /components             # Reusable UI atoms
│   ├── navbar.js
│   ├── footer.js
│   ├── project-card.js
│   └── timeline.js
├── /utils                  # Tiny helpers (no framework)
│   ├── dom.js              # html`` template, escape, mount
│   ├── config.js           # JSON loader
│   ├── theme.js            # Dark/light + persistence
│   ├── reveal.js           # IntersectionObserver scroll reveal
│   ├── interactions.js     # Cursor glow, scrollspy, tilt, typing
│   ├── email.js            # Pluggable email + validation
│   ├── icons.js            # Inline SVG icon set
│   └── toast.js            # Lightweight notifications
├── /styles                 # Modular CSS (tokens-first)
│   ├── main.css            # Imports + reset
│   ├── tokens.css          # Design tokens + themes
│   ├── layout.css
│   ├── components.css
│   ├── animations.css
│   └── responsive.css
├── /assets                 # SVG favicon, OG image, project art
└── /.github/workflows
    └── deploy.yml          # GitHub Pages deploy
```

---

## 🚀 Run locally

ES modules need to be served (not opened from `file://`). Pick any one:

```bash
# Python (built-in)
python -m http.server 8080

# Node
npx serve .

# VS Code: install "Live Server" extension and click "Go Live"
```

Then open <http://localhost:8080>.

---

## 🌐 Deploy to GitHub Pages

1. Create a repo named `Portfolio` (or anything).
2. Push the contents of this folder to `main`.
3. In **Settings → Pages**, set **Source = GitHub Actions**.
4. The included workflow (`.github/workflows/deploy.yml`) handles the rest on every push.

> A `.nojekyll` file is included so the `_` prefixed files (if any) and the `node_modules`-style folders aren't ignored by Jekyll.

For a custom domain, drop a `CNAME` file at the root.

---

## 📝 Editing content

All content lives in `config/*.json`. The site reloads cleanly on save.

| File              | What lives here                                   |
| ----------------- | ------------------------------------------------- |
| `site.json`       | Identity, navigation, social links, footer        |
| `features.json`   | Feature flags, email provider, animations toggle  |
| `skills.json`     | Skill categories + tools cloud                    |
| `experience.json` | Work history, education, certifications           |
| `projects.json`   | Featured + secondary projects                     |

### Add a new project

Append to `config/projects.json`:

```json
{
  "title": "Your project",
  "summary": "One-line elevator pitch",
  "description": "Slightly longer story",
  "tech": ["AWS", "Python"],
  "tags": ["DevOps"],
  "github": "https://github.com/...",
  "demo": null,
  "year": 2025
}
```

That's it. No code change.

### Add a new section

1. Create `sections/your-section.js` exporting a `renderYourSection(config)`.
2. Add `<section id="your-section">` to `index.html`.
3. Register it in `main.js`'s `SECTIONS` map and add a `your-section: true` flag in `features.json`.

The renderer is plug-in style — sections come and go without breaking layout.

---

## ✉️ Email setup (Contact form)

Default provider: **Formspree** (free, no backend).

1. Create a form at <https://formspree.io>.
2. Copy the endpoint URL (e.g. `https://formspree.io/f/abc123`).
3. Replace `REPLACE_WITH_YOUR_ID` in `config/features.json`:

```json
"email": {
  "provider": "formspree",
  "endpoint": "https://formspree.io/f/abc123",
  ...
}
```

### Other providers

`utils/email.js` ships with three strategies. Swap `provider` to:

- `"formspree"` — Formspree-style POST + JSON response
- `"custom"`   — Your own serverless endpoint (Netlify / Vercel / Cloudflare Functions)
- `"mailto"`   — No backend; opens user's mail client

Adding a new one is ~10 lines — register it in the `providers` map.

The form includes:
- Client-side validation (name / email / message)
- Honeypot anti-spam field
- Loading state, success/error toast
- Graceful failure (keeps user input on error)

---

## 🎨 Theming

Edit tokens in `styles/tokens.css`. All colors, spacing, type sizes, motion timings,
and gradients are CSS custom properties. Both `[data-theme="dark"]` and
`[data-theme="light"]` are first-class — change either independently.

---

## 🔮 Future-ready hooks

Already wired (just toggle the flag in `features.json`):

| Flag                    | What it enables                                      |
| ----------------------- | ---------------------------------------------------- |
| `sections.blog`         | Spot for a blog list section (add `sections/blog.js`) |
| `sections.chatbot`      | Spot for an AI chatbot widget                        |
| `i18n.enabled`          | Multi-language switcher (English-only by default)    |
| `analytics.enabled`     | Drop in Plausible / GA snippet via `main.js`         |
| `animations.cursorGlow` | Disable for low-power devices                        |

---

## 🛡️ Security notes

- No third-party JS at runtime (unless you enable analytics).
- Form submission goes to your chosen provider only.
- Honeypot field rejects naive bots silently.
- All HTML interpolation goes through `escapeHtml()`.

---

## 📜 License

MIT — use it, fork it, ship your own.

> Built with intent by Saravana Kumar B.
