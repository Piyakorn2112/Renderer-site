import { useEffect, useRef, useState } from "react";

interface NovelCardProps {
  title: string;
  status: string;
  genre: string;
  chapters: string;
  premise: string;
  detail: string;
  delay: number;
}

function NovelCard({ title, status, genre, chapters, premise, detail, delay }: NovelCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="glass-card"
      style={{
        padding: "clamp(1.5rem, 3vw, 2rem)",
        flex: "1 1 420px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
        transition: `opacity 0.65s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s, transform 0.65s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
        <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", background: "rgba(255,156,0,0.08)", color: "var(--accent)", border: "1px solid rgba(255,156,0,0.2)", borderRadius: "var(--pill-radius)", padding: "4px 12px" }}>{genre}</span>
        <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-tertiary)", background: "rgba(128,128,128,0.08)", border: "1px solid var(--border)", borderRadius: "var(--pill-radius)", padding: "4px 12px" }}>{status}</span>
      </div>
      <h3 style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)", fontWeight: 400, fontStyle: "italic", color: "var(--text)", marginBottom: "0.25rem" }}>{title}</h3>
      <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", marginBottom: "1rem" }}>{chapters}</p>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.875rem, 1.5vw, 0.95rem)", lineHeight: 1.75, color: "var(--text-secondary)", marginBottom: "1.25rem" }}>{premise}</p>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", lineHeight: 1.65, color: "var(--text-tertiary)" }}>{detail}</p>
    </div>
  );
}

export function NovelsSection() {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "6rem clamp(1.25rem, 4vw, 3rem)" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)" }}>The evidence</span>
        <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 200, color: "var(--text)", marginTop: "0.5rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          Two novels. Two states of the same system.
        </h2>
      </div>
      <div style={{ display: "flex", gap: "clamp(1rem, 2vw, 1.5rem)", flexWrap: "wrap" }}>
        <NovelCard
          title="Hollow Iris"
          status="Complete"
          genre="Literary Sci-Fi"
          chapters="~170 chapters"
          premise="A journalist covers the political crisis that will end a distributed governance consciousness. She falls in love with one of its fragments."
          detail="First novel produced with the framework. The system was in active development throughout — coherent and capable but not yet strictly disciplined."
          delay={0.1}
        />
        <NovelCard
          title="The Root Crown"
          status="In Progress"
          genre="Literary Fantasy"
          chapters="178 chapters planned · Dual-timeline"
          premise="Two women separated by centuries touch the same buried thing. Neither knows what the other is."
          detail="Uses the mature pipeline — strict cross-timeline mapping, formalized quality gate with 10-dimensional scoring, narrative causality tracking from chapter one."
          delay={0.25}
        />
      </div>
      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.875rem, 1.5vw, 0.95rem)", fontStyle: "italic", color: "var(--text-tertiary)", maxWidth: 680, margin: "0 auto", lineHeight: 1.75 }}>
          Hollow Iris demonstrated capability. The Root Crown demonstrates discipline. The evolution between them is visible in the log files.
        </p>
      </div>
    </section>
  );
}
