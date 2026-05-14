import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Layers, Sparkles } from "lucide-react";

interface ArgumentBlockProps {
  icon: React.ReactNode;
  label: string;
  title: string;
  body: string;
  delay: number;
}

function ArgumentBlock({ icon, label, title, body, delay }: ArgumentBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="glass-card"
      style={{
        padding: "clamp(1.5rem, 3vw, 2rem)", flex: "1 1 300px",
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
    </div>
  );
}

export function ArgumentSection() {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "6rem clamp(1.25rem, 4vw, 3rem)" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)" }}>The core insight</span>
        <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 200, color: "var(--text)", marginTop: "0.5rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          Most people start with sentences. Renderer starts with structure.
        </h2>
      </div>
      <div style={{ display: "flex", gap: "clamp(1rem, 2vw, 1.5rem)", flexWrap: "wrap" }}>
        <ArgumentBlock
          icon={<AlertTriangle size={16} />}
          label="The problem"
          title="Long-form fiction has a distance problem."
          body="By chapter 50 the voice has shifted. By chapter 80 the planted image is forgotten. The problem isn't the model's capability — it's the architecture around it."
          delay={0.1}
        />
        <ArgumentBlock
          icon={<Layers size={16} />}
          label="The approach"
          title="Resolve from world to arc to chapter to prose."
          body="The novel's state lives in documents, not memory. Configuration, story primary, naming reference, anchor files — each chapter is generated from the document set, not from accumulated context."
          delay={0.25}
        />
        <ArgumentBlock
          icon={<Sparkles size={16} />}
          label="The method"
          title="Generate, evaluate, iterate."
          body="Chapters pass through a 10-dimensional quality gate with arc-position awareness. The pipeline knows which passes to run based on what the scan finds. The log files for all of it are here."
          delay={0.4}
        />
      </div>
    </section>
  );
}
