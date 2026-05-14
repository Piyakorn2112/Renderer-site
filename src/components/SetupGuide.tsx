import { useEffect, useRef, useState } from "react";
import { Monitor, FolderOpen, Package, Play, FileText } from "lucide-react";

const STEPS = [
  {
    icon: Monitor,
    title: "Choose your AI tool",
    body: "Renderer works with any AI assistant that can read files and follow written instructions — Claude, ChatGPT, Gemini, or tools like VS Code Copilot, Cline, or Claude Code. You don't need to write code. You're just having a conversation with an AI inside a folder.",
  },
  {
    icon: FolderOpen,
    title: "Create a project folder",
    body: "Make a new folder on your computer for your novel. Think of it as your writing desk — everything (your notes, your draft, the framework files) lives here. No special software required beyond a text editor to read the files.",
  },
  {
    icon: Package,
    title: "Drop in the framework",
    body: "Copy the Renderer framework folder into your project. It's a set of plain text documents — pipeline definitions, templates, and quality-gate rules — that your AI reads as instructions. Nothing to install, nothing to configure upfront.",
  },
  {
    icon: Play,
    title: "Start your first session",
    body: "Open a conversation with your AI tool pointed at the project folder. Tell it you want to start a new Renderer project. It will walk you through creating your story primary, novel configuration, and naming reference — the three foundation documents.",
  },
  {
    icon: FileText,
    title: "Plain text files, by design",
    body: "The framework outputs .txt and .md (Markdown) files by default. Plain text loads faster, costs fewer tokens, and is easier to search, edit, and version. You can instruct your AI agent to output in other formats (Word, PDF, structured JSON) if you need them — but raw text is still the recommended default for speed and efficiency.",
  },
];

export function SetupGuide() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "6rem clamp(1.25rem, 4vw, 3rem)" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)" }}>Getting started</span>
        <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 200, color: "var(--text)", marginTop: "0.5rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          Five steps. Start writing.
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)", color: "var(--text-tertiary)", marginTop: "0.75rem", maxWidth: 560, margin: "0.75rem auto 0" }}>
          No coding required. Works with any AI assistant that can read files.
        </p>
      </div>

      <div
        ref={ref}
        className="glass-card"
        style={{
          padding: "clamp(1.25rem, 2vw, 2rem)",
          maxWidth: 720,
          margin: "0 auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
                padding: "1.25rem 0",
                borderBottom: i < STEPS.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(255,156,0,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                color: "var(--accent)",
                fontSize: "0.8rem",
                fontWeight: 600,
                fontFamily: "var(--font-ui)",
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.25rem" }}>
                  <Icon size={14} style={{ color: "var(--text-tertiary)" }} />
                  <h4 style={{ fontFamily: "var(--font-ui)", fontSize: "0.9rem", fontWeight: 500, color: "var(--text)", margin: 0 }}>{step.title}</h4>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>{step.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
