/**
 * Pluggable email sender.
 * Default: Formspree. Replace with your own provider by changing config/features.json.
 *
 * Provider contract: async sendEmail(payload, config) → { ok: boolean, error?: string }
 */

const providers = {
  formspree: async (payload, config) => {
    if (!config.endpoint || config.endpoint.includes("REPLACE_WITH_YOUR_ID")) {
      return { ok: false, error: "Email endpoint not configured." };
    }
    try {
      const res = await fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return { ok: true };
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data?.error || `HTTP ${res.status}` };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  },

  // Example shim — drop-in for a custom serverless function:
  custom: async (payload, config) => {
    const res = await fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok };
  },

  // Web3Forms — paste an access_key UUID into config.endpoint
  // Sign up at web3forms.com → gives back a UUID that points to your email
  web3forms: async (payload, config) => {
    if (!config.endpoint || config.endpoint.includes("PASTE_") || config.endpoint.includes("REPLACE_WITH")) {
      return { ok: false, error: "Email endpoint not configured." };
    }
    try {
      const subject = (config.subject || "Portfolio contact — {name}").replace("{name}", payload.name);
      const body = {
        access_key: config.endpoint,
        subject,
        from_name: `${payload.name} (portfolio)`,
        replyto: payload.email,
        name: payload.name,
        email: payload.email,
        message: payload.message,
        botcheck: false,
      };
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      return res.ok && data.success ? { ok: true } : { ok: false, error: data?.message || `HTTP ${res.status}` };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  },
};

export async function sendEmail(payload, config) {
  const provider = providers[config.provider] || providers.formspree;
  return provider(payload, config);
}

/** Validate { name, email, message } — returns { valid, errors } */
export function validate(payload) {
  const errors = {};
  if (!payload.name || payload.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errors.email = "Enter a valid email.";
  if (!payload.message || payload.message.trim().length < 10) errors.message = "Message is a little short.";
  return { valid: Object.keys(errors).length === 0, errors };
}
