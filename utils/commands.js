/**
 * Command registry for the interactive hero terminal.
 *
 * Each handler signature: (args: string[], ctx) => string | string[] | { html: string } | null
 *   - return string/array → printed as plain text
 *   - return { html }     → rendered as HTML (for links, colors)
 *   - return null         → nothing printed (e.g. clear)
 *
 * ctx helpers:
 *   ctx.clear()       — clear the terminal
 *   ctx.print(line)   — print extra line(s)
 *   ctx.history       — array of past commands
 */

const PROMPT_HOST = "portfolio";

/* Mutable session state — survives across commands within one terminal mount */
export const session = {
  user: "saran",
  isRoot: false,
};

export const promptString = () => {
  const sym = session.isRoot ? "#" : "$";
  return `${session.user}@${PROMPT_HOST}:~${sym}`;
};

const escape = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ok = (s) => s;
const err = (s) => ({ html: `<span class="t-err">${escape(s)}</span>` });
const link = (label, url) =>
  `<a href="${escape(url)}" target="_blank" rel="noopener" class="t-link">${escape(label)}</a>`;
const accent = (s) => `<span class="t-accent">${escape(s)}</span>`;
const dim = (s) => `<span class="t-dim">${escape(s)}</span>`;

/* --- File system fixture (for ls/cat) --- */
const FS = {
  "about.md": "DevSecOps Engineer @ Positka. 4+ yrs in cloud, security & LLM-powered automation.",
  "skills.json": JSON.stringify(
    {
      cloud: ["AWS", "Terraform", "Kubernetes", "Docker", "Ansible"],
      security: ["Splunk", "CrowdStrike", "SIEM", "CCSK", "DevSecOps"],
      ai: ["Claude", "Ollama", "Codex IDE", "Antigravity", "GenAI", "RAG"],
      languages: ["Python", "Bash", "SQL", "Go"],
    },
    null,
    2
  ),
  "contact.txt": "Form:     #contact (lands in my inbox)\nLinkedIn: linkedin.com/in/saran11\nGitHub:   github.com/SaRan111997",
  "resume.pdf": "[binary file]",
  ".secret": "🤫 You found it. Type `hire` to see what I'm looking for.",
};

/* --- Helpers for fake outputs --- */
const tableRow = (...cols) => cols.map((c, i) => c.padEnd([16, 22, 16, 22][i] || 12)).join("  ");

/* --- The big registry --- */
export const commands = {
  /* ===== Personal ===== */
  whoami: {
    desc: "Print the current user",
    run: () => ok(accent(session.isRoot ? "root" : "SaRan")),
  },
  about: {
    desc: "Short bio",
    run: () =>
      ok([
        `Hi, I'm ${accent("Saravana Kumar")} — most call me ${accent("SaRan")}.`,
        `I build secure cloud platforms and LLM-powered DevSecOps automation.`,
        `Currently @ ${accent("Positka")}, Chennai · 4+ years experience.`,
      ]),
  },
  skills: {
    desc: "Top skills",
    run: () =>
      ok([
        `${accent("Cloud")}     AWS · Terraform · Kubernetes · Docker · Ansible`,
        `${accent("Security")}  Splunk · CrowdStrike · SIEM · CCSK · DevSecOps`,
        `${accent("AI/LLM")}    Claude · Ollama · Codex IDE · Antigravity · RAG`,
        `${accent("Code")}      Python · Bash · SQL · Go`,
        dim("→ try `cat skills.json` for the full list"),
      ]),
  },
  projects: {
    desc: "Featured work",
    run: () =>
      ok([
        `${accent("•")} LLM-Powered DevSecOps Assistant`,
        `${accent("•")} Secure AWS Landing Zone (Terraform)`,
        `${accent("•")} Container Hardening Pipeline (Trivy + Cosign)`,
        `${accent("•")} HackTheBox — active CTF grinder`,
        dim("→ scroll down to see the full case studies"),
      ]),
  },
  contact: {
    desc: "How to reach me",
    run: () =>
      ok([
        `📝 ${link("Send a message via the form", "#contact")}`,
        `💼 ${link("linkedin.com/in/saran11", "https://www.linkedin.com/in/saran11")}`,
        `🐙 ${link("github.com/SaRan111997", "https://github.com/SaRan111997")}`,
      ]),
  },
  hire: {
    desc: "Looking to work together?",
    run: () =>
      ok([
        `🎯 Open to ${accent("Senior DevSecOps")} & ${accent("Platform Engineering")} roles.`,
        `   Remote-friendly · India / EU timezones.`,
        `   Strong fit if you're shipping AI-augmented infra.`,
        dim("→ try `linkedin` or scroll to the contact form"),
      ]),
  },
  social: {
    desc: "Social links",
    run: () =>
      ok([
        `GitHub      ${link("github.com/SaRan111997", "https://github.com/SaRan111997")}`,
        `LinkedIn    ${link("linkedin.com/in/saran11", "https://www.linkedin.com/in/saran11")}`,
      ]),
  },
  github: {
    desc: "Open GitHub",
    run: () => {
      window.open("https://github.com/SaRan111997", "_blank");
      return ok(dim("Opening GitHub…"));
    },
  },
  linkedin: {
    desc: "Open LinkedIn",
    run: () => {
      window.open("https://www.linkedin.com/in/saran11", "_blank");
      return ok(dim("Opening LinkedIn…"));
    },
  },
  resume: {
    desc: "Download resume",
    run: () => {
      window.open("assets/resume.pdf", "_blank");
      return ok(dim("Downloading resume.pdf…"));
    },
  },

  /* ===== Linux ===== */
  ls: {
    desc: "List directory",
    run: (args) => {
      const all = args.includes("-a") || args.includes("-la") || args.includes("-al");
      const files = all ? Object.keys(FS) : Object.keys(FS).filter((f) => !f.startsWith("."));
      return ok(files.map((f) => (f.endsWith(".md") || f.endsWith(".json") || f.endsWith(".txt") || f.endsWith(".pdf") ? f : `${accent(f)}`)).join("  "));
    },
  },
  pwd: { desc: "Print working dir", run: () => ok("/home/saran/portfolio") },
  cd: {
    desc: "Change directory (read-only here)",
    run: (args) => (args[0] ? dim(`cd: ${args[0]}: this is a static portfolio :)`) : ok("/home/saran")),
  },
  cat: {
    desc: "Show file contents",
    run: (args) => {
      if (!args[0]) return err("usage: cat <file>");
      const f = args[0];
      if (FS[f] !== undefined) return ok(escape(FS[f]));
      return err(`cat: ${f}: No such file or directory`);
    },
  },
  echo: { desc: "Print arguments", run: (args) => ok(escape(args.join(" "))) },
  date: { desc: "Show date", run: () => ok(new Date().toString()) },
  uname: {
    desc: "System info",
    run: (args) =>
      args.includes("-a")
        ? ok("Linux saran-portfolio 6.6.0-glass #1 SMP x86_64 GNU/Linux")
        : ok("Linux"),
  },
  uptime: { desc: "Uptime", run: () => ok(`up ${Math.floor(performance.now() / 1000)}s, 1 user, load average: 0.42, 0.13, 0.05`) },
  history: {
    desc: "Show command history",
    run: (_args, ctx) =>
      ok(ctx.history.map((h, i) => `${String(i + 1).padStart(4)}  ${escape(h)}`).join("\n")),
  },
  help: {
    desc: "Show available commands",
    run: () =>
      ok([
        accent("Personal"),
        "  whoami · about · skills · projects · contact · hire · social · github · linkedin · resume",
        "",
        accent("Linux"),
        "  ls · pwd · cd · cat · echo · date · uname · uptime · history · clear",
        "",
        accent("Docker"),
        "  docker ps · docker images · docker version",
        "",
        accent("Kubernetes"),
        "  kubectl get pods · kubectl get nodes · kubectl version",
        "",
        accent("Terraform"),
        "  terraform init · plan · apply · destroy · version",
        "",
        accent("Ansible"),
        "  ansible --version · ansible-playbook site.yml",
        "",
        accent("Fun"),
        "  sudo · hack · matrix · joke · banner · coffee",
        "",
        dim("Tip: use ↑/↓ to navigate history, Tab to autocomplete."),
      ]),
  },
  clear: {
    desc: "Clear terminal",
    run: (_args, ctx) => {
      ctx.clear();
      return null;
    },
  },
  exit: {
    desc: "Exit (drops root if elevated)",
    run: (_args, ctx) => {
      if (session.isRoot) {
        session.isRoot = false;
        session.user = "saran";
        ctx.refreshPrompt?.();
        return ok([
          dim("logout"),
          accent(`Dropped root. Back to saran.`),
        ]);
      }
      return ok(dim("There's no escape from this portfolio. Try `hire` instead."));
    },
  },

  /* ===== Docker ===== */
  docker: {
    desc: "Docker CLI (simulated)",
    run: (args) => {
      const sub = args[0];
      if (!sub || sub === "--help") return ok(dim("docker [ps|images|version|run|--version]"));
      if (sub === "version" || sub === "--version") return ok("Docker version 25.0.3, build f417435");
      if (sub === "ps")
        return ok([
          tableRow("CONTAINER ID", "IMAGE", "STATUS", "PORTS"),
          tableRow("a8f3c5b2d9e1", "portfolio:latest", "Up 2 hours", "0.0.0.0:8080->80/tcp"),
          tableRow("b9c4d7e6f2a3", "nginx:alpine", "Up 2 hours", "0.0.0.0:443->443/tcp"),
          tableRow("c1e5f8a3b6d2", "trivy/scanner", "Exited (0)", ""),
        ]);
      if (sub === "images")
        return ok([
          tableRow("REPOSITORY", "TAG", "IMAGE ID", "SIZE"),
          tableRow("portfolio", "latest", "a8f3c5b2d9e1", "142MB"),
          tableRow("nginx", "alpine", "b9c4d7e6f2a3", "52MB"),
          tableRow("trivy/scanner", "0.49", "c1e5f8a3b6d2", "218MB"),
        ]);
      if (sub === "run") return ok(dim(`docker: starting container... [simulated]\nContainer started.`));
      return err(`docker: '${sub}' is not a docker command. See 'docker --help'.`);
    },
  },

  /* ===== Kubernetes ===== */
  kubectl: {
    desc: "Kubernetes CLI (simulated)",
    run: (args) => {
      const verb = args[0];
      if (!verb) return ok(dim("kubectl [get|describe|version] [pods|nodes|services]"));
      if (verb === "version") return ok("Client Version: v1.30.0\nKustomize Version: v5.0.4\nServer Version: v1.30.1");
      if (verb === "get") {
        const res = args[1];
        if (res === "pods")
          return ok([
            tableRow("NAME", "READY", "STATUS", "AGE"),
            tableRow("portfolio-7c5d8f9b6-x4k2m", "1/1", "Running", "2d"),
            tableRow("portfolio-7c5d8f9b6-p9j3n", "1/1", "Running", "2d"),
            tableRow("trivy-scanner-cron-28", "0/1", "Completed", "12m"),
          ]);
        if (res === "nodes")
          return ok([
            tableRow("NAME", "STATUS", "ROLES", "AGE"),
            tableRow("control-plane-1", "Ready", "control-plane", "47d"),
            tableRow("worker-node-1", "Ready", "<none>", "47d"),
            tableRow("worker-node-2", "Ready", "<none>", "47d"),
          ]);
        if (res === "services")
          return ok([
            tableRow("NAME", "TYPE", "CLUSTER-IP", "PORT(S)"),
            tableRow("portfolio-svc", "LoadBalancer", "10.96.42.7", "80:30080/TCP"),
          ]);
        return err(`error: the server doesn't have a resource type "${res || ""}"`);
      }
      return err(`error: unknown command "${verb}" for "kubectl"`);
    },
  },

  /* ===== Terraform ===== */
  terraform: {
    desc: "Terraform CLI (simulated)",
    run: (args) => {
      const sub = args[0];
      if (!sub || sub === "--help") return ok(dim("Terraform: init, validate, plan, apply, destroy, version"));
      if (sub === "version") return ok("Terraform v1.7.2\non linux_amd64");
      if (sub === "init")
        return ok([
          dim("Initializing the backend..."),
          dim("Initializing provider plugins..."),
          "- Finding hashicorp/aws versions matching \"~> 5.0\"...",
          "- Installing hashicorp/aws v5.42.0...",
          accent("Terraform has been successfully initialized!"),
        ]);
      if (sub === "plan")
        return ok([
          dim("Refreshing Terraform state in-memory prior to plan..."),
          dim("------------------------------------------------------------------------"),
          `+ aws_s3_bucket.portfolio_logs`,
          `+ aws_iam_role.portfolio_role`,
          `~ aws_security_group.web (in-place update)`,
          "",
          accent("Plan: 2 to add, 1 to change, 0 to destroy."),
        ]);
      if (sub === "apply")
        return ok([
          accent("aws_s3_bucket.portfolio_logs: Creating..."),
          accent("aws_iam_role.portfolio_role: Creating..."),
          dim("aws_security_group.web: Modifying... [id=sg-0a9c1f3d2]"),
          "",
          accent("Apply complete! Resources: 2 added, 1 changed, 0 destroyed."),
        ]);
      if (sub === "destroy") return err("Refusing to run 'destroy' on production. Nice try.");
      if (sub === "validate") return ok(accent("Success! The configuration is valid."));
      return err(`Terraform has no command named "${sub}".`);
    },
  },

  /* ===== Ansible ===== */
  ansible: {
    desc: "Ansible CLI (simulated)",
    run: (args) => {
      if (args[0] === "--version" || args[0] === "-v")
        return ok([
          "ansible [core 2.15.5]",
          "  config file = /etc/ansible/ansible.cfg",
          "  python version = 3.11.6",
          "  jinja version = 3.1.2",
        ]);
      return ok(dim("Usage: ansible <host-pattern> [options]\nTry: ansible --version"));
    },
  },
  "ansible-playbook": {
    desc: "Run a playbook (simulated)",
    run: (args) => {
      const pb = args[0] || "site.yml";
      return ok([
        dim(`PLAY [Deploy portfolio to ${pb}] *********************************`),
        accent("ok: [web-1]"),
        accent("ok: [web-2]"),
        dim(`TASK [common : Install hardened baseline] ************************`),
        accent("changed: [web-1]"),
        accent("changed: [web-2]"),
        "",
        `${accent("PLAY RECAP")} ******************************************************`,
        "web-1  : ok=12  changed=3  unreachable=0  failed=0",
        "web-2  : ok=12  changed=3  unreachable=0  failed=0",
      ]);
    },
  },

  /* ===== Other tools ===== */
  git: {
    desc: "Git (simulated)",
    run: (args) => {
      if (args[0] === "status") return ok("On branch main\nnothing to commit, working tree clean");
      if (args[0] === "log") return ok("commit a8f3c5 (HEAD -> main)\n  feat: glassmorphism + interactive terminal");
      if (args[0] === "--version") return ok("git version 2.43.0");
      return ok(dim("usage: git [status|log|--version]"));
    },
  },
  python: {
    desc: "Python REPL (simulated)",
    run: () => ok("Python 3.11.6 on linux\nType `exit` to leave."),
  },

  /* ===== Fun & easter eggs ===== */
  sudo: {
    desc: "Run as another user (try `sudo su`)",
    run: (args, ctx) => {
      const cmd = args.join(" ");
      if (cmd === "rm -rf /") return err("🚫 Nice try. Permission denied (and that would be illegal).");
      if (cmd === "make me a sandwich") return ok(accent("🥪 Okay."));
      if (cmd === "su" || cmd === "su -" || cmd === "-i" || cmd === "su root") {
        return becomeRoot(ctx);
      }
      // Generic sudo passthrough — for now elevate temporarily by running the rest as root
      if (args.length) {
        const inner = commands[args[0]];
        if (inner) {
          const wasRoot = session.isRoot;
          session.isRoot = true;
          try {
            const out = inner.run(args.slice(1), ctx);
            return out;
          } finally {
            session.isRoot = wasRoot;
          }
        }
      }
      return ok(dim(`[sudo] password for ${session.user}: \n${escape(cmd)}: command not found`));
    },
  },
  su: {
    desc: "Switch to root",
    run: (args, ctx) => {
      const target = args[0] || "root";
      if (target !== "root" && target !== "-") {
        return err(`su: user ${target} does not exist`);
      }
      return becomeRoot(ctx);
    },
  },
  hack: {
    desc: "Initiate the hack",
    run: () =>
      ok([
        dim("Connecting to mainframe... ▒▒▒▒▒▒▒▒▒▒"),
        dim("Bypassing firewall...      ▒▒▒▒▒▒▒▒▒▒"),
        accent("Cracking encryption...     ▒▒▒▒▒▒▒▒▒▒ 100%"),
        "",
        `Access ${accent("granted")}. Just kidding 😉  (try \`hire\` instead)`,
      ]),
  },
  matrix: {
    desc: "Wake up Neo",
    run: () => ok([
      "Wake up, Neo... 🟢",
      dim("01010111 01100001 01101011 01100101 00100000 01110101 01110000"),
    ]),
  },
  joke: {
    desc: "DevOps joke",
    run: () => {
      const jokes = [
        "Why do DevOps engineers prefer dark mode?\nBecause light attracts bugs.",
        "How many SREs does it take to change a lightbulb?\nNone, it's a hardware problem.",
        "I'd tell you a UDP joke, but you might not get it.",
        "There are 10 kinds of people in the world: those who understand binary, and those who don't.",
      ];
      return ok(jokes[Math.floor(Math.random() * jokes.length)]);
    },
  },
  coffee: {
    desc: "Brew coffee",
    run: () => ok("☕ HTTP/1.1 418 I'm a teapot"),
  },
  banner: {
    desc: "Print logo",
    run: () =>
      ok([
        "  ____       ____",
        " / ___|  __ _|  _ \\ __ _ _ __  ",
        " \\___ \\ / _` | |_) / _` | '_ \\ ",
        "  ___) | (_| |  _ < (_| | | | |",
        " |____/ \\__,_|_| \\_\\__,_|_| |_|",
        "                                ",
        accent(" DevSecOps · Cloud · LLM "),
      ]),
  },
};

/** Aliases for natural-feeling typing. */
export const ALIASES = {
  "ll": "ls -la",
  "ls -la": "ls -la",
  "ls -a": "ls -a",
};

/** Parse + dispatch a single command line. */
export function execute(line, ctx) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Alias
  const expanded = ALIASES[trimmed] || trimmed;

  const tokens = expanded.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
  const head = tokens.shift();
  const args = tokens.map((t) => t.replace(/^"|"$/g, ""));

  const cmd = commands[head];
  if (!cmd) {
    return err(`${head}: command not found. Type \`help\` for available commands.`);
  }
  return cmd.run(args, ctx);
}

/** Tab-completion candidates for a partial input. */
export function completions(prefix) {
  if (!prefix) return [];
  return Object.keys(commands).filter((c) => c.startsWith(prefix));
}

/** Switch the session to root and refresh the prompt. */
function becomeRoot(ctx) {
  if (session.isRoot) {
    return ok(dim("You're already root. Use `exit` to drop privileges."));
  }
  session.isRoot = true;
  session.user = "root";
  ctx.refreshPrompt?.();
  return ok([
    dim("[sudo] password for saran: ************"),
    "",
    `${accent("root@portfolio")} access ${accent("granted")}.`,
    dim("Use `whoami` to confirm. Type `exit` to drop back to saran."),
  ]);
}
