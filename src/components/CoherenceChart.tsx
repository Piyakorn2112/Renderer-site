import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

const CH18 = {
  chapter: "Ch 18",
  title: "Intimate Geography",
  arc: "Arc I — Establishment",
  excerpt: `Nora's hand was near Iris's hand. Not touching — separated by centimeters, by the specific distance that marks the boundary between companionship and something else.`,
  detail: `Iris's warmth was palpable. At this distance, Nora could feel it — not the ambient warmth of Iris's quarters, which was environmental, distributed, managed, but Iris's personal warmth, the thermal signature of her body radiating across the centimeters between them.`,
  seeds: [
    "Warmth established as Iris's own, not the lattice's",
    "Observation platform — light through aligned rings",
    "The almost-touching as more intimate than touching",
    "Temperature as the conversation words circle around",
  ],
};

const CH145 = {
  chapter: "Ch 145",
  title: "The Kiss",
  arc: "Arc VI — Resolution",
  excerpt: `Her hands had dropped the precision. The hands that were holding Nora's shoulder and the base of Nora's neck were not performing any calculation. They were the hands of a person who had spent two years becoming a person.`,
  detail: `Nora chose the warmth, knowing what the warmth was. She had been choosing it for two years. The warmth was the lattice. The lattice was part of what she was. Nora chose her.`,
  payoffs: [
    "Warmth recognized as deliberate choice, not just sensation",
    "Precision drops — governance function absent from the hands",
    "Temperature differential: two bodies, two temperatures",
    "\"Whatever happens. This was mine. This is mine.\"",
  ],
};

const CHAIN = [
  {
    label: "Anchor File",
    sub: "anchor_v2_ch11-20.txt",
    body: "Planted seed: \"Iris's warmth palpable at observation platform distance.\" Preserved across 13 subsequent anchor files. Each anchor carries forward the warmth-as-identity motif without decay.",
  },
  {
    label: "Story Primary",
    sub: "Ch 145 entry",
    body: "Prose directive: \"The warmth becomes herself.\" Beat specification: precision drops, governance function's register absent. The story primary knows what Ch 18 established because the anchor preserved it.",
  },
  {
    label: "Context Packet",
    sub: "context_packet_ch141-150.md",
    body: "Locked fact: \"Iris's warmth — established Ch 18, carried through anchor chain.\" The context packet makes the 127-chapter-old establishment available to the model generating Ch 145.",
  },
];

export function CoherenceChart() {
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

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "6rem clamp(1.25rem, 4vw, 3rem)" }}>
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)" }}>
          Distance coherence
        </span>
        <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 200, color: "var(--text)", marginTop: "0.5rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          How connections survive distance.
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)", color: "var(--text-tertiary)", marginTop: "0.75rem", maxWidth: 620, margin: "0.75rem auto 0" }}>
          The architecture diagram shows the chapter loop. It doesn't show what makes chapter 145's landing possible after 127 chapters of distance.
        </p>
      </div>

      <div
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {/* Chapter panels + chain */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "clamp(1rem, 2vw, 1.5rem)",
          alignItems: "stretch",
        }}>
          {/* Ch 18 */}
          <ChapterPanel side="left" data={CH18} visible={visible} />

          {/* Document chain — the mechanism */}
          <div style={{
            flex: isMobile ? "none" : "0 0 clamp(240px, 28%, 300px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 12,
          }}>
            <div style={{ textAlign: "center", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 4, opacity: 0.7 }}>
              Preservation chain
            </div>
            {CHAIN.map((link, i) => (
              <div
                key={link.label}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: 12,
                  border: "1px solid rgba(255,156,0,0.15)",
                  background: "rgba(255,156,0,0.03)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1) ${0.3 + i * 0.15}s, transform 0.5s cubic-bezier(0.23, 1, 0.32, 1) ${0.3 + i * 0.15}s`,
                }}
              >
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", marginBottom: 2 }}>{link.label}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", fontFamily: "ui-monospace, Consolas, monospace", marginBottom: 4 }}>{link.sub}</div>
                <div style={{ fontSize: "0.75rem", lineHeight: 1.55, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{link.body}</div>
              </div>
            ))}
            {/* Arrows between chain links */}
            {!isMobile && (
              <div style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--text-tertiary)", opacity: 0.4, letterSpacing: "0.3em" }}>
                ↓ ↓ ↓
              </div>
            )}
          </div>

          {/* Ch 145 */}
          <ChapterPanel side="right" data={CH145} visible={visible} />
        </div>

        {/* Label */}
        <div style={{
          textAlign: "center",
          marginTop: "2.5rem",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1) 0.6s",
        }}>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.85rem, 1.4vw, 1rem)",
            color: "var(--text-secondary)",
            fontStyle: "italic",
            maxWidth: 640,
            margin: "0 auto",
            lineHeight: 1.65,
          }}>
            127 chapters apart. The connection survived because it lived in documents, not memory.
          </p>
        </div>
      </div>
    </section>
  );
}

function ChapterPanel({ side, data, visible }: {
  side: "left" | "right";
  data: typeof CH18 | typeof CH145;
  visible: boolean;
}) {
  const items = "seeds" in data ? data.seeds : data.payoffs;
  const itemLabel = "seeds" in data ? "Planted" : "Landed";
  const itemColor = "seeds" in data ? "var(--accent)" : "#10b981";
  const delay = side === "left" ? 0.1 : 0.5;

  return (
    <div
      className="glass-card"
      style={{
        flex: "1 1 0",
        padding: "clamp(1.25rem, 2vw, 1.75rem)",
        display: "flex",
        flexDirection: "column",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
        transition: `opacity 0.65s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s, transform 0.65s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s`,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
        <span style={{
          fontSize: "9px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
          padding: "3px 10px", borderRadius: "var(--pill-radius)",
          background: side === "left" ? "rgba(255,156,0,0.08)" : "rgba(16,185,129,0.08)",
          color: side === "left" ? "var(--accent)" : "#10b981",
          border: `1px solid ${side === "left" ? "rgba(255,156,0,0.2)" : "rgba(16,185,129,0.2)"}`,
        }}>{data.chapter}</span>
        <span style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{data.arc}</span>
      </div>

      <h3 style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 1.8vw, 1.15rem)", fontWeight: 400, fontStyle: "italic", color: "var(--text)", marginBottom: "0.75rem", lineHeight: 1.3 }}>
        {data.title}
      </h3>

      {/* Prose excerpts */}
      <div style={{
        padding: "0.75rem 1rem",
        background: "rgba(128,128,128,0.03)",
        borderRadius: 9,
        border: "1px solid var(--border)",
        marginBottom: "0.75rem",
      }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", lineHeight: 1.7, color: "var(--text-secondary)", fontStyle: "italic" }}>
          "{data.excerpt}"
        </p>
      </div>
      <div style={{
        padding: "0.75rem 1rem",
        background: "rgba(128,128,128,0.03)",
        borderRadius: 9,
        border: "1px solid var(--border)",
        marginBottom: "1rem",
      }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", lineHeight: 1.7, color: "var(--text-secondary)", fontStyle: "italic" }}>
          "{data.detail}"
        </p>
      </div>

      {/* Seeds / Payoffs */}
      <div style={{ marginTop: "auto" }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: itemColor, marginBottom: 6, opacity: 0.7 }}>{itemLabel}</div>
        {items.map(item => (
          <div key={item} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "flex-start" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: itemColor, flexShrink: 0, marginTop: 5, opacity: 0.5 }} />
            <span style={{ fontSize: "0.75rem", lineHeight: 1.5, color: "var(--text-tertiary)" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
