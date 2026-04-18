import { html, raw, mount, $, on } from "../utils/dom.js";
import { icon } from "../utils/icons.js";
import { sendEmail, validate } from "../utils/email.js";
import { toast } from "../utils/toast.js";

export function renderContact(site, features) {
  const channels = site.social
    .filter((s) => ["linkedin", "github", "mail"].includes(s.icon))
    .map(
      (s) => `
        <a href="${s.url}" target="_blank" rel="noopener" class="contact-channel">
          <span class="contact-channel-icon">${icon(s.icon)}</span>
          <span><strong>${s.label}</strong><br>
            <span style="color: var(--text-muted); font-size: var(--fs-xs);">${s.url.replace("mailto:", "")}</span>
          </span>
        </a>
      `
    )
    .join("");

  mount(
    "#contact",
    html`
      <div class="container">
        <div class="reveal">
          <div class="section-eyebrow">Contact</div>
          <h2 class="section-title">Let's build something.</h2>
          <p class="section-subtitle">
            Got a role in mind, an idea to validate, or just want to chat about AI-augmented DevSecOps? I'd love to hear from you.
          </p>
        </div>

        <div class="contact-grid">
          <div class="contact-side reveal reveal-delay-1">
            <h3>Reach out directly</h3>
            <p>I usually reply within 24 hours. The fastest way is email or LinkedIn.</p>
            <div class="contact-channels">${raw(channels)}</div>
          </div>

          <form class="contact-form reveal reveal-delay-2" id="contact-form" novalidate>
            <div class="form-row">
              <label for="cf-name">Name</label>
              <input id="cf-name" name="name" type="text" required autocomplete="name" />
              <span class="error-msg"></span>
            </div>
            <div class="form-row">
              <label for="cf-email">Email</label>
              <input id="cf-email" name="email" type="email" required autocomplete="email" />
              <span class="error-msg"></span>
            </div>
            <div class="form-row">
              <label for="cf-message">Message</label>
              <textarea id="cf-message" name="message" required></textarea>
              <span class="error-msg"></span>
            </div>

            <input class="form-honeypot" type="text" name="${features.email.honeypotField}" tabindex="-1" autocomplete="off" aria-hidden="true" />

            <div class="form-submit">
              <small>By sending, you agree I may reply to your email.</small>
              <button type="submit" class="btn btn-primary" id="cf-submit">
                Send message ${raw(icon("arrow"))}
              </button>
            </div>
          </form>
        </div>
      </div>
    `
  );

  wireForm(features);
}

function wireForm(features) {
  const form = $("#contact-form");
  const submitBtn = $("#cf-submit");
  if (!form) return;

  on(form, "submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    // Honeypot trap — silently succeed
    if (fd.get(features.email.honeypotField)) {
      toast(features.email.successMessage, "success");
      form.reset();
      return;
    }

    const payload = {
      name: fd.get("name")?.trim() || "",
      email: fd.get("email")?.trim() || "",
      message: fd.get("message")?.trim() || "",
    };

    // Reset prior errors
    form.querySelectorAll(".form-row").forEach((row) => row.classList.remove("has-error"));

    const { valid, errors } = validate(payload);
    if (!valid) {
      Object.entries(errors).forEach(([field, msg]) => {
        const input = form.querySelector(`[name="${field}"]`);
        const row = input?.closest(".form-row");
        if (row) {
          row.classList.add("has-error");
          row.querySelector(".error-msg").textContent = msg;
        }
      });
      return;
    }

    submitBtn.disabled = true;
    const originalHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span class="spinner"></span> Sending…`;

    const result = await sendEmail(payload, features.email);

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;

    if (result.ok) {
      toast(features.email.successMessage, "success");
      form.reset();
    } else {
      toast(`${features.email.errorMessage} (${result.error || "unknown"})`, "error", 6000);
    }
  });
}
