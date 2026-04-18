/**
 * Interactive terminal component for the hero.
 * Mounts into a target element. Supports:
 *   - command execution (utils/commands.js)
 *   - command history (↑ / ↓)
 *   - tab autocomplete
 *   - typed-in welcome banner
 *   - clickable links inside output
 *   - scroll lock to bottom on new output
 */

import { execute, completions, promptString } from "../utils/commands.js";

export function mountTerminal(target, { onMount } = {}) {
  if (!target) return;

  target.innerHTML = `
    <div class="term-card glass-strong" data-term>
      <header class="term-bar">
        <div class="term-dots">
          <span></span><span></span><span></span>
        </div>
        <div class="term-title">${promptString().replace(":~$", "")}</div>
        <button class="term-clear" type="button" title="Clear (Ctrl+L)">clear</button>
      </header>
      <div class="term-body" data-term-body tabindex="0">
        <div class="term-output" data-term-output></div>
        <div class="term-line" data-term-line>
          <span class="term-prompt">${promptString()}</span>
          <span class="term-input-wrap">
            <input
              class="term-input"
              data-term-input
              type="text"
              spellcheck="false"
              autocomplete="off"
              autocapitalize="off"
              aria-label="Terminal input"
            />
            <span class="term-caret" data-term-caret></span>
          </span>
        </div>
      </div>
    </div>
  `;

  const root = target.querySelector("[data-term]");
  const body = target.querySelector("[data-term-body]");
  const output = target.querySelector("[data-term-output]");
  const input = target.querySelector("[data-term-input]");
  const clearBtn = target.querySelector(".term-clear");

  const state = {
    history: [],
    historyIdx: -1,
    draft: "",
  };

  /* ---------- Rendering ---------- */
  const printRaw = (html) => {
    const line = document.createElement("div");
    line.className = "term-out-line";
    line.innerHTML = html;
    output.appendChild(line);
    body.scrollTop = body.scrollHeight;
  };

  const printResult = (res) => {
    if (res == null) return;
    // Strings from commands ARE HTML (commands use accent()/dim()/link() helpers
    // that emit safe markup; user-typed input is escaped at the command layer).
    if (typeof res === "string") {
      res.split("\n").forEach((l) => printRaw(l || "&nbsp;"));
      return;
    }
    if (Array.isArray(res)) {
      res.forEach((l) => printRaw(typeof l === "string" ? (l || "&nbsp;") : (l?.html ?? "")));
      return;
    }
    if (res && typeof res === "object" && "html" in res) {
      printRaw(res.html);
    }
  };

  const escape = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const printPrompt = (cmd) => {
    printRaw(`<span class="term-prompt">${promptString()}</span> <span class="term-cmd">${escape(cmd)}</span>`);
  };

  const livePrompt = target.querySelector(".term-line .term-prompt");
  const refreshPrompt = () => {
    if (livePrompt) {
      livePrompt.textContent = promptString();
      livePrompt.classList.toggle("is-root", promptString().endsWith("#"));
    }
  };

  const ctx = {
    history: state.history,
    clear: () => {
      output.innerHTML = "";
    },
    print: (line) => printRaw(typeof line === "string" ? escape(line) : (line?.html ?? "")),
    refreshPrompt,
  };

  /* ---------- Run a command ---------- */
  const run = (raw) => {
    const cmd = raw.trim();
    if (cmd) {
      printPrompt(cmd);
      state.history.push(cmd);
      state.historyIdx = state.history.length;
      try {
        const res = execute(cmd, ctx);
        // commands.js returns may be string/array/{html}/null
        if (res !== null) printResult(res);
      } catch (e) {
        printRaw(`<span class="t-err">error: ${escape(e.message)}</span>`);
      }
    } else {
      printPrompt("");
    }
    input.value = "";
    body.scrollTop = body.scrollHeight;
  };

  /* ---------- Welcome banner (typed in) ---------- */
  const banner = [
    `<span class="t-accent">Welcome to SaRan's portfolio.</span>`,
    `<span class="t-dim">Type <span class="t-accent">help</span> to list commands · try <span class="t-accent">whoami</span>, <span class="t-accent">about</span>, or <span class="t-accent">docker ps</span></span>`,
    "",
  ];

  const playBanner = async () => {
    for (const line of banner) {
      printRaw(line || "&nbsp;");
      await sleep(180);
    }
  };

  /* ---------- Input handling ---------- */
  input.addEventListener("keydown", (e) => {
    // Submit
    if (e.key === "Enter") {
      e.preventDefault();
      run(input.value);
      return;
    }
    // History up
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (state.historyIdx === state.history.length) state.draft = input.value;
      if (state.historyIdx > 0) {
        state.historyIdx--;
        input.value = state.history[state.historyIdx];
        moveCaretToEnd(input);
      }
      return;
    }
    // History down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (state.historyIdx < state.history.length - 1) {
        state.historyIdx++;
        input.value = state.history[state.historyIdx];
      } else {
        state.historyIdx = state.history.length;
        input.value = state.draft || "";
      }
      moveCaretToEnd(input);
      return;
    }
    // Tab autocomplete
    if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.value.split(" ");
      const last = parts[parts.length - 1];
      const matches = completions(last);
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        input.value = parts.join(" ") + " ";
      } else if (matches.length > 1) {
        printPrompt(input.value);
        printRaw(`<span class="t-dim">${matches.join("  ")}</span>`);
      }
      return;
    }
    // Ctrl+L clear
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
      e.preventDefault();
      ctx.clear();
      return;
    }
    // Ctrl+C abort line
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      printPrompt(input.value + "^C");
      input.value = "";
    }
  });

  // Focus input when clicking anywhere in body
  body.addEventListener("click", () => input.focus());

  clearBtn.addEventListener("click", () => {
    ctx.clear();
    input.focus();
  });

  // Bootstrap
  playBanner().then(() => input.focus());

  if (onMount) onMount({ run });
  return { run };
}

/* ---------- Tiny utils ---------- */
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function moveCaretToEnd(el) {
  requestAnimationFrame(() => {
    el.selectionStart = el.selectionEnd = el.value.length;
  });
}
