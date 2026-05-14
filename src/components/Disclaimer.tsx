import { useEffect, useRef, useState } from "react";

const ITEMS = [
  "AI-generated content requires human review and editorial judgment.",
  "Results vary based on model, prompts, and source material quality.",
  "The framework is a tool — the writer's vision and editorial judgment remain essential.",
  "No guarantee of publication-ready output without human editing.",
  "Evidence presented is from specific projects under controlled conditions.",
];

export function Disclaimer() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "3rem clamp(1.25rem, 4vw, 3rem)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div style={{
        width: "3rem",
        height: 1,
        background: "linear-gradient(90deg, transparent, var(--border), transparent)",
        margin: "0 auto 2rem",
      }} />

      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "9px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
          Important considerations
        </span>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {ITEMS.map(item => (
          <li
            key={item}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              lineHeight: 1.75,
              color: "var(--text-tertiary)",
              paddingLeft: "1rem",
              position: "relative",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ position: "absolute", left: 0, color: "var(--border)" }}>—</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
