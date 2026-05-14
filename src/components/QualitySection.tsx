import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

const SCAN_DATA = [
  { ch: "Ch 131", title: "The Reconstruction", words: 2682, verdict: "EXPANSION-COUPLED", scores: { sg: 7, dh: 7, er: 7, vc: 8, ac: 8, pf: 6, sp: 6, re: 7 } },
  { ch: "Ch 132", title: "The DAF's Final Vote", words: 2274, verdict: "EXPANSION-COUPLED", scores: { sg: 6, dh: 7, er: 7, vc: 8, ac: 8, pf: 7, sp: 7, re: 7 } },
  { ch: "Ch 134", title: "The Final Fleet", words: 1963, verdict: "EXPANSION-COUPLED", scores: { sg: 6, dh: 6, er: 7, vc: 8, ac: 7, pf: 6, sp: 7, re: 6 } },
  { ch: "Ch 137", title: "The Burning Face II", words: 2153, verdict: "LIGHT + EXPANSION", scores: { sg: 8, dh: 8, er: 8, vc: 9, ac: 8, pf: 7, sp: 8, re: 8 } },
  { ch: "Ch 139", title: "Diminishment", words: 2547, verdict: "LIGHT + EXPANSION", scores: { sg: 8, dh: 8, er: 8, vc: 9, ac: 9, pf: 7, sp: 7, re: 8 } },
  { ch: "Ch 140", title: "The Loss", words: 2309, verdict: "STANDARD + EXPANSION", scores: { sg: 8, dh: 9, er: 8, vc: 9, ac: 9, pf: 7, sp: 7, re: 9 } },
];

const DIM_LABELS: Record<string, string> = {
  sg: "Sensory Grounding", dh: "Dialogue Humanity", er: "Emotional Restraint",
  vc: "Voice Consistency", ac: "Arc Coherence", pf: "Pacing Fit",
  sp: "Scene Pressure", re: "Ending Residue",
};

function scoreColor(score: number) {
  return score >= 8 ? "#10b981" : score >= 7 ? "var(--accent)" : "#ef4444";
}
function scoreBg(score: number) {
  return score >= 8 ? "rgba(16,185,129,0.1)" : score >= 7 ? "rgba(255,156,0,0.08)" : "rgba(239,68,68,0.08)";
}

function ScoreCell({ score }: { score: number }) {
  return (
    <td style={{ padding: "4px" }}>
      <div style={{ padding: "8px 8px", textAlign: "center", fontSize: "0.75rem", fontWeight: 600, fontVariantNumeric: "tabular-nums", color: scoreColor(score), background: scoreBg(score), borderRadius: 4 }}>
      {score}
      </div>
    </td>
  );
}

function MobileCard({ row }: { row: typeof SCAN_DATA[0] }) {
  return (
    <div style={{
      padding: "1rem",
      borderRadius: 12,
      border: "1px solid var(--border)",
      background: "var(--bg-glass)",
      marginBottom: 8,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text)" }}>{row.ch}</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{row.title}</div>
        </div>
        <div style={{ fontSize: "0.8rem", fontVariantNumeric: "tabular-nums", color: row.words < 3000 ? "var(--accent)" : "var(--text-secondary)" }}>
          {row.words.toLocaleString()}w
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginBottom: 10 }}>
        {Object.entries(row.scores).map(([k, v]) => (
          <div key={k} style={{ textAlign: "center", padding: "4px 2px", borderRadius: 4, background: scoreBg(v) }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: scoreColor(v), fontVariantNumeric: "tabular-nums" }}>{v}</div>
            <div style={{ fontSize: "0.55rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: "0.7rem", fontWeight: 500, color: "var(--text-tertiary)" }}>{row.verdict}</div>
    </div>
  );
}

export function QualitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const isMobile = useIsMobile();

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
        <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)" }}>
          Real scan data
        </span>
        <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 200, color: "var(--text)", marginTop: "0.5rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          From the Ch 131–140 scan report.
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)", color: "var(--text-tertiary)", marginTop: "0.75rem", maxWidth: 560, margin: "0.75rem auto 0" }}>
          Pre-assembly scan. Total deficit: ~8,233 words across 10 chapters. All routed to expansion-coupled passes before assembly.
        </p>
      </div>

      <div
        ref={ref}
        className="glass-card"
        style={{
          padding: "clamp(1rem, 2vw, 1.5rem)",
          overflowX: isMobile ? undefined : "auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {isMobile ? (
          <div>
            {SCAN_DATA.map(row => <MobileCard key={row.ch} row={row} />)}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px", minWidth: 700 }}>
            <thead>
              <tr>
                <th style={{ padding: "6px 10px", textAlign: "left", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Chapter</th>
                <th style={{ padding: "6px 8px", textAlign: "right", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Words</th>
                {Object.keys(DIM_LABELS).map(k => (
                  <th key={k} style={{ padding: "6px 8px", textAlign: "center", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-tertiary)", whiteSpace: "nowrap" }} title={DIM_LABELS[k]}>
                    {k.toUpperCase()}
                  </th>
                ))}
                <th style={{ padding: "6px 10px", textAlign: "left", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {SCAN_DATA.map((row, i) => (
                <tr
                  key={row.ch}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    background: hoveredRow === i ? "rgba(255,156,0,0.03)" : "transparent",
                    transition: "background 0.15s ease",
                  }}
                >
                  <td style={{ padding: "6px 10px" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text)" }}>{row.ch}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{row.title}</div>
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "right", fontSize: "0.8rem", color: row.words < 3000 ? "var(--accent)" : "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
                    {row.words.toLocaleString()}
                  </td>
                  {Object.keys(row.scores).map(k => (
                    <ScoreCell key={k} score={row.scores[k as keyof typeof row.scores]} />
                  ))}
                  <td style={{ padding: "6px 10px", fontSize: "0.7rem", fontWeight: 500, color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>{row.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { color: "rgba(16,185,129,0.1)", label: "≥ 8 — strong" },
            { color: "rgba(255,156,0,0.08)", label: "7 — passing" },
            { color: "rgba(239,68,68,0.08)", label: "< 7 — targeted pass required" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
              <span style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
