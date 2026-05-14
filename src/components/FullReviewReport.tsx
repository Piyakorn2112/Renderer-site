import { useState, useRef, useEffect } from "react";
import { ChevronDown, FileText } from "lucide-react";

const REPORT_SECTIONS = [
  {
    title: "Arc Function Summary",
    content: `Batch 6 covers Chapters 101–115: the military peak of Arc IV through the opening of Arc V.

Ch 101–104: Zero-gravity engagement sequence. Iris's governance function operating in unprecedented conditions. Nora's operational focus. The battle's physical reality processed through the lattice.

Ch 105–108: Aftermath. The damaged station. The medical reality. The political rearrangement that the engagement forced. Iris's body processing what happened in zero gravity.

Ch 109–112: Transition into Arc V. The governance function's first post-engagement calibration. Helia's concentrated state becoming navigable. The political landscape shifting from military to institutional.

Ch 113–115: Arc V establishment. New operational parameters. Iris's lattice readings changing. The governance function adapting to post-engagement conditions.`,
  },
  {
    title: "Chapter-by-Chapter Targets",
    content: `Ch 101 — TARGET 7: Character behavior register
Iris's zero-gravity context was supposed to produce behavioral novelty — the governance function doesn't have a protocol for zero gravity. But Iris remains in her standard embodied register throughout. No moment where her body does something the governance function's usual protocols wouldn't generate.
Action: Add one moment where the lattice-echo produces something unexpected in the zero-g context.

Ch 102 — TARGET 2: Over-explanation
"The decisive moment" passage explains what the physical gesture means immediately after showing it. The explanation arrests the kinesthetic immediacy.
Action: Cut the explanatory clause. The reader can complete the image.
KEEP: "She hated this. She was magnificent at it." — The batch's most efficient conjunction. Protect this line.

Ch 103 — TARGET 2: Annotation after image
The narrator analyzes the pronoun-shift's meaning immediately after Iris uses "she" for Helia for the first time. The explanation arrives before the reader has time to feel the weight.
Action: Cut the explanatory paragraph. Let the pronoun and the silence do the work.

Ch 104 — TARGET 4: The word "love"
"The intentionality was the love's practice." — The label arrives where the physical gesture (Nora's hands finding the pain-specific places on Iris's body) was doing sufficient work.
Action: Remove the sentence. The gesture is the love.

Ch 105 — TARGET 1: AI-register tone
"The calibration was the body's acknowledgment of the engagement's residue." — This sentence reads as a technical document rather than prose.
Action: Replace with physical specificity. What does the calibration feel like in the hands, the neck, the chest?

Ch 106 — TARGET 3: Crowd quantification
"The seven hundred personnel of the forward section" — The number serves no dramatic purpose and reads as inventory.
Action: Replace with the specific detail that matters: who is absent, who is injured, what the corridor looks like now.

Ch 107 — Clean. No targets flagged.

Ch 108 — TARGET 5: Acquisition backstory
Two paragraphs of Helia's administrative history inserted mid-scene. The backstory interrupts the dramatic present.
Action: Cut to one sentence. The reader needs to know Helia's role, not her career timeline.

Ch 109–115 — Mixed targets across over-explanation (3 instances), AI register (2 instances), and one structural issue where scene order creates a logic gap.`,
  },
  {
    title: "Cross-Chapter Patterns",
    content: `"Love" inventory — 4 instances in batch:
• Ch 102: "the love's operational form" — borderline, context-dependent
• Ch 104: "the love's practice" — flagged for removal
• Ch 110: "love was the word she had for it" — earned, character-specific
• Ch 114: "the love that the governance function processed" — AI-register, flagged

"Be careful / I'm always careful" ritual:
Appears in Ch 101 (pre-engagement) and Ch 112 (post-engagement). The repetition is correct — the ritual's meaning changes after the battle. Both instances kept.

Iris's voice register drift:
Chapters 101–104 maintain the formal-intimate register. Ch 105–106 drift toward clinical observation (flagged as AI-register). Ch 107–115 recover.

Notebook motif:
First appearance in batch at Ch 109. Nora's return to journalism after the engagement. The notebook represents the restoration of professional identity. Three appearances across Ch 109–115, all contextually earned.`,
  },
  {
    title: "Priority Edit List",
    content: `Structural:
1. Ch 101 — Add zero-gravity behavioral departure for Iris
2. Ch 109 — Reorder scenes to fix logic gap (Iris references information she doesn't yet have)

Over-explanation (P1):
3. Ch 102 — Cut "decisive moment" explanatory clause
4. Ch 103 — Remove pronoun-shift analysis paragraph
5. Ch 104 — Remove "The intentionality was the love's practice"
6. Ch 108 — Cut Helia backstory to one sentence
7. Ch 110 — Trim aftermath reflection (two paragraphs → one)
8. Ch 113 — Remove narrator gloss on calibration scene

"Love" instances:
9. Ch 104 — Remove (gesture carries without the label)
10. Ch 114 — Rewrite (AI-register)
11. Ch 102 — Monitor (borderline, may survive in context)
12. Ch 110 — Keep (earned)

Character/Behavioral:
13. Ch 101 — Iris zero-gravity departure
14. Ch 105–106 — Voice register correction (2 chapters)

Distribution:
15. Ch 106 — Replace crowd number with specific detail
16. Ch 108 — Redistribute backstory weight

Enrichment:
17. Ch 107 — Add one physical detail to transition scene (currently clean but sparse)
18. Ch 112 — Strengthen "be careful" repetition with one new physical element`,
  },
];

const SCAN_REPORT = `Scan Report: Ch 131–140 (v1 pre-assembly)
Date: 2026-04-30
Mode: Expansion-coupled pre-assembly

Summary Table:
┌──────────┬──────────────────────┬───────┬─────────┬────────┬────────┬─────────────────────┐
│ Chapter  │ Title                │ Words │ Needed  │ Destab │ Embod  │ Verdict             │
├──────────┼──────────────────────┼───────┼─────────┼────────┼────────┼─────────────────────┤
│ Ch 131   │ The Reconstruction   │ 2,682 │ +318    │ YES    │ YES    │ EXPANSION-COUPLED   │
│ Ch 132   │ The DAF's Final Vote │ 2,274 │ +726    │ YES    │ PASS   │ EXPANSION-COUPLED   │
│ Ch 133   │ The Network          │ 2,415 │ +585    │ PASS   │ YES    │ EXPANSION-COUPLED   │
│ Ch 134   │ The Final Fleet      │ 1,963 │ +1,037  │ YES    │ YES    │ EXPANSION-COUPLED   │
│ Ch 135   │ The Lattice Narrows  │ 2,887 │ +113    │ PASS   │ PASS   │ LIGHT               │
│ Ch 136   │ The Evening Practice │ 3,104 │ —       │ PASS   │ PASS   │ PASS                │
│ Ch 137   │ The Burning Face II  │ 2,153 │ +847    │ YES    │ YES    │ EXPANSION-COUPLED   │
│ Ch 138   │ The Conversation     │ 2,671 │ +329    │ PASS   │ YES    │ LIGHT + EXPANSION   │
│ Ch 139   │ Diminishment         │ 2,547 │ +453    │ YES    │ YES    │ LIGHT + EXPANSION   │
│ Ch 140   │ The Loss             │ 2,309 │ +691    │ YES    │ YES    │ STANDARD + EXPANSION│
└──────────┴──────────────────────┴───────┴─────────┴────────┴────────┴─────────────────────┘

Total deficit: ~8,233 words across 10 chapters.
All chapters routed to expansion-coupled passes before assembly.

Top Expansion Points by Chapter:

Ch 131: +100 environmental aftermath detail, +120 governance function processing the reconstruction visually, +100 Nora's physical response to seeing repair crews
Ch 132: +200 DAF chamber physicality, +150 vote mechanics tension, +200 Iris processing the political through the lattice, +176 aftermath beat
Ch 134: +300 fleet departure sensory grounding, +250 Iris's lattice reading of the fleet's withdrawal, +200 Nora's notebook entry, +287 environmental pressure
Ch 137: +250 face-burning sequence extension, +200 Helia's physical response, +200 Iris's governance function recalibrating, +197 aftermath residue
Ch 139: +150 diminishment physicality, +150 lattice narrowing sensation, +153 aftermath beat
Ch 140: +200 Vorn death notification through lattice, +150 Helia's 73-minute carrying, +150 governance grief, +191 institutional response`;

export function FullReviewReport() {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"review" | "scan">("review");
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(1.25rem, 4vw, 3rem) 4rem" }}>
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {/* Toggle bar */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="glass-card"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FileText size={15} style={{ color: "var(--accent)", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text)" }}>Full review reports</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginTop: 2 }}>Batch 6 evaluation (Ch 101–115) and scan report (Ch 131–140)</div>
            </div>
          </div>
          <ChevronDown
            size={16}
            style={{
              color: "var(--text-tertiary)",
              transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
              transform: expanded ? "rotate(180deg)" : "rotate(0)",
              flexShrink: 0,
            }}
          />
        </button>

        {/* Expandable content */}
        <div style={{
          maxHeight: expanded ? 2400 : 0,
          overflow: "hidden",
          transition: "max-height 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
        }}>
          <div className="glass-card" style={{ marginTop: 8, padding: "clamp(1rem, 2vw, 1.5rem)" }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem" }}>
              <button
                onClick={() => setActiveTab("review")}
                className="glass-pill"
                style={{
                  padding: "6px 14px", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer",
                  background: activeTab === "review" ? "rgba(255,156,0,0.08)" : undefined,
                  color: activeTab === "review" ? "var(--accent)" : "var(--text-tertiary)",
                }}
              >Batch 6 Review</button>
              <button
                onClick={() => setActiveTab("scan")}
                className="glass-pill"
                style={{
                  padding: "6px 14px", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer",
                  background: activeTab === "scan" ? "rgba(255,156,0,0.08)" : undefined,
                  color: activeTab === "scan" ? "var(--accent)" : "var(--text-tertiary)",
                }}
              >Scan Report</button>
            </div>

            {activeTab === "review" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {REPORT_SECTIONS.map(section => (
                  <div key={section.title}>
                    <h4 style={{ fontFamily: "var(--font-ui)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
                      {section.title}
                    </h4>
                    <div style={{
                      padding: "0.75rem 1rem",
                      background: "rgba(128,128,128,0.03)",
                      borderRadius: 9,
                      border: "1px solid var(--border)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.78rem",
                      lineHeight: 1.75,
                      color: "var(--text-secondary)",
                      whiteSpace: "pre-wrap",
                    }}>
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: "0.75rem 1rem",
                background: "rgba(128,128,128,0.03)",
                borderRadius: 9,
                border: "1px solid var(--border)",
                fontFamily: "ui-monospace, Consolas, monospace",
                fontSize: "0.7rem",
                lineHeight: 1.6,
                color: "var(--text-secondary)",
                whiteSpace: "pre-wrap",
                overflowX: "auto",
              }}>
                {SCAN_REPORT}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
