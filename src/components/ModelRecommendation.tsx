import { useEffect, useRef, useState } from "react";
import { Brain, Zap } from "lucide-react";

interface ModelCardProps {
  icon: React.ReactNode;
  label: string;
  title: string;
  body: string;
  note?: string;
  delay: number;
}

function ModelCard({ icon, label, title, body, note, delay }: ModelCardProps) {
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
    <div
      ref={ref}
      className="glass-card"
      style={{
        padding: "clamp(1.5rem, 3vw, 2rem)", flex: "1 1 420px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
        transition: `opacity 0.65s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s, transform 0.65s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
        <div style={{ width: 32, height: 32, borderRadius: "var(--btn-radius)", background: "rgba(255,156,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
          {icon}
        </div>
        <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>{label}</span>
      </div>
      <h3 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(1rem, 2vw, 1.15rem)", fontWeight: 500, color: "var(--text)", marginBottom: "0.75rem", lineHeight: 1.3, letterSpacing: "-0.01em" }}>{title}</h3>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.875rem, 1.5vw, 0.95rem)", lineHeight: 1.75, color: "var(--text-secondary)" }}>{body}</p>
      {note && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", lineHeight: 1.65, color: "var(--text-tertiary)", marginTop: "0.75rem", fontStyle: "italic" }}>{note}</p>
      )}
    </div>
  );
}

export function ModelRecommendation() {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "6rem clamp(1.25rem, 4vw, 3rem)" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)" }}>Model guidance</span>
        <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 200, color: "var(--text)", marginTop: "0.5rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          Which model for which job.
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)", color: "var(--text-tertiary)", marginTop: "0.75rem", maxWidth: 560, margin: "0.75rem auto 0" }}>
          The pipeline separates structural reasoning from prose generation. Each benefits from a different model.
        </p>
      </div>
      <div style={{ display: "flex", gap: "clamp(1rem, 2vw, 1.5rem)", flexWrap: "wrap" }}>
        <ModelCard
          icon={<Brain size={16} />}
          label="Structural reasoning"
          title="Opus for architecture"
          body="Primary file construction — story primary, novel configuration, naming reference, anchor files. These documents require complex structural reasoning about narrative arcs, character systems, and world consistency across hundreds of chapters."
          note="Sonnet also handles these well for most projects."
          delay={0.1}
        />
        <ModelCard
          icon={<Zap size={16} />}
          label="Prose generation"
          title="Sonnet for writing"
          body="Chapter drafting, expansion passes, and prose refinement. Fast, high-quality prose output at significantly lower cost. The pipeline is designed so structural decisions are already locked before prose generation begins — Sonnet executes within clear constraints."
          delay={0.25}
        />
      </div>
    </section>
  );
}
