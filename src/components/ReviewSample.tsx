import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

const REVIEW_ENTRIES = [
  {
    id: "over-explain",
    tag: "TARGET 2",
    severity: "Fix",
    label: "Over-explanation",
    chapter: "Ch 102",
    finding: "The \"decisive moment\" passage explains what the physical gesture means immediately after showing it. The explanation arrests the kinesthetic immediacy that the concept generates.",
    v1: `"Both hands came together... the pressing being the
fleet's contraction felt through the lattice as the
fragment's kinesthetic experience."`,
    action: "Cut the explanatory clause. Go directly to what Nora holds — the hands, the pressure. The reader can complete the image.",
    v2: `"Both hands came together."

[Explanatory clause removed. Next line goes
directly to Nora's physical awareness of
the pressure.]`,
    accepted: true,
  },
  {
    id: "annotation",
    tag: "TARGET 2",
    severity: "Fix",
    label: "Annotation after image",
    chapter: "Ch 103",
    finding: "The narrator analyzes the pronoun-shift's meaning immediately after Iris uses \"she\" for Helia for the first time. The explanation arrives before the reader has time to feel the weight of the shift.",
    v1: `"The tenderness was the conversion's product.
The tenderness was new."

[Followed by analysis of why the tenderness
appeared — the shared experience converting
intellectual recognition to emotional response.]`,
    action: "Cut the explanatory paragraph. Let the pronoun and the silence do the work.",
    v2: `[Paragraph removed. The line "beautiful when
she commands" now holds the full silence.
No narrator gloss.]`,
    accepted: true,
  },
  {
    id: "behavior",
    tag: "TARGET 7",
    severity: "Investigate",
    label: "Character behavior register",
    chapter: "Ch 101",
    finding: "Iris's zero-gravity context was supposed to produce behavioral novelty — the governance function doesn't have a protocol for zero gravity. But Iris remains in her standard embodied register throughout. No moment where her body does something the governance function's usual protocols wouldn't generate.",
    v1: `[Iris narrates the battle while Nora holds her.
Standard mirroring response. No zero-gravity-
specific behavioral departure.]`,
    action: "Add one moment where the lattice-echo produces something unexpected in the zero-g context. Not dramatic — a small physical tell specific to the environment's strangeness.",
    v2: `[One line added where Iris's body responds to
the unprecedented physical experience through
the lattice — a fractional behavioral departure
the reader recognizes as new.]`,
    accepted: true,
  },
  {
    id: "word-love",
    tag: "TARGET 4",
    severity: "Fix",
    label: "The word \"love\"",
    chapter: "Ch 104",
    finding: "\"The intentionality was the love's practice.\" — The label arrives where the physical gesture (Nora's hands finding the pain-specific places on Iris's body) was doing sufficient work without it.",
    v1: `"Nora's hands on the neck where the headache
persisted. The intentionality was the love's
practice."`,
    action: "Remove the sentence. The gesture is the love. Let the physical detail be the final line of that sequence.",
    v2: `"Nora's hands on the neck where the headache
persisted."

[The sentence "The intentionality was the love's
practice." removed. The gesture carries.]`,
    accepted: true,
  },
  {
    id: "keep",
    tag: "KEEP",
    severity: "Keep",
    label: "Pipeline found — not specified",
    chapter: "Ch 102",
    finding: "\"She hated this. She was magnificent at it.\" — The batch's most efficient conjunction. Earned through the zero-gravity dance sequence. The repetition at chapter's end is correct.",
    v1: `"She hated this. She was magnificent at it."`,
    action: "No change. Protect this line.",
    v2: `"She hated this. She was magnificent at it."

[Unchanged. The review system confirms: do not
touch prose that carries its own weight.]`,
    accepted: false,
  },
];

export function ReviewSample() {
  const [activeEntry, setActiveEntry] = useState(0);
  const [showV2, setShowV2] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const entry = REVIEW_ENTRIES[activeEntry];

  return (
    <section ref={ref} style={{ maxWidth: 1100, margin: "0 auto", padding: "6rem clamp(1.25rem, 4vw, 3rem)" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)" }}>
          Real review log
        </span>
        <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 200, color: "var(--text)", marginTop: "0.5rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          What the scan finds. What the pass changes. What it keeps.
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)", color: "var(--text-tertiary)", marginTop: "0.75rem", maxWidth: 560, margin: "0.75rem auto 0" }}>
          From the Hollow Iris batch 6 review (Ch 101–115). These are real findings from the automated scan and the pass decisions that followed.
        </p>
      </div>

      <div style={{
        display: "flex", gap: "clamp(1rem, 2vw, 1.5rem)", flexDirection: isMobile ? "column" : "row",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
      }}>
        {/* Entry list */}
        <div style={isMobile ? {
          display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, WebkitOverflowScrolling: "touch" as const,
        } : {
          flex: "0 0 clamp(260px, 30%, 320px)", display: "flex", flexDirection: "column" as const, gap: 6,
        }}>
          {REVIEW_ENTRIES.map((e, i) => (
            <button
              key={e.id}
              onClick={() => { setActiveEntry(i); setShowV2(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: isMobile ? "8px 14px" : "10px 14px",
                borderRadius: 12,
                background: activeEntry === i ? "rgba(255,156,0,0.06)" : "transparent",
                border: `1px solid ${activeEntry === i ? "rgba(255,156,0,0.18)" : "transparent"}`,
                textAlign: "left",
                transition: "all 0.2s ease",
                cursor: "pointer",
                whiteSpace: isMobile ? "nowrap" : undefined,
                flexShrink: isMobile ? 0 : undefined,
              }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: e.severity === "Keep" ? "#10b981" : e.severity === "Fix" ? "var(--accent)" : "var(--accent-light)",
              }} />
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text)" }}>{e.label}</div>
                {!isMobile && (
                  <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{e.chapter} · {e.tag}</div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="glass-card" style={{ flex: 1, padding: "clamp(1.25rem, 2vw, 1.75rem)", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{
              fontSize: "9px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "3px 10px", borderRadius: "var(--pill-radius)",
              background: entry.severity === "Keep" ? "rgba(16,185,129,0.08)" : entry.severity === "Fix" ? "rgba(255,156,0,0.08)" : "rgba(255,223,174,0.15)",
              color: entry.severity === "Keep" ? "#10b981" : "var(--accent)",
              border: `1px solid ${entry.severity === "Keep" ? "rgba(16,185,129,0.2)" : "rgba(255,156,0,0.2)"}`,
            }}>{entry.severity === "Keep" ? "Accepted — no change" : entry.severity === "Fix" ? "Finding → fixed" : "Finding → investigated"}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{entry.chapter}</span>
          </div>

          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "1rem" }}>
            {entry.finding}
          </p>

          {entry.severity !== "Keep" && (
            <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", marginBottom: "1rem", fontStyle: "italic" }}>
              Action: {entry.action}
            </p>
          )}

          {/* v1 / v2 toggle */}
          <div style={{ display: "flex", gap: 6, marginBottom: "0.75rem" }}>
            <button
              onClick={() => setShowV2(false)}
              className="glass-pill"
              style={{ padding: "6px 14px", fontSize: "0.75rem", fontWeight: 500, background: !showV2 ? "rgba(255,156,0,0.08)" : undefined, color: !showV2 ? "var(--accent)" : "var(--text-tertiary)", cursor: "pointer" }}
            >v1 Draft</button>
            <button
              onClick={() => setShowV2(true)}
              className="glass-pill"
              style={{ padding: "6px 14px", fontSize: "0.75rem", fontWeight: 500, background: showV2 ? "rgba(16,185,129,0.08)" : undefined, color: showV2 ? "#10b981" : "var(--text-tertiary)", cursor: "pointer" }}
            >{entry.severity === "Keep" ? "Kept" : "v2 After Pass"}</button>
          </div>

          <div style={{
            padding: "1rem",
            background: "rgba(128,128,128,0.03)",
            borderRadius: 9,
            border: `1px solid ${showV2 && entry.accepted ? "rgba(16,185,129,0.15)" : "var(--border)"}`,
            fontFamily: "var(--font-body)",
            fontSize: "0.82rem",
            lineHeight: 1.75,
            color: "var(--text-secondary)",
            whiteSpace: "pre-wrap",
            transition: "border-color 0.3s ease",
          }}>
            {showV2 ? entry.v2 : entry.v1}
          </div>
        </div>
      </div>
    </section>
  );
}
