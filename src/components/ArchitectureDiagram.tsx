import { useState, useRef, useEffect } from "react";
import {
  FileText, Database, LayoutList, PenTool, Maximize2, ScanLine,
  PackageCheck, RefreshCw, X, AlertTriangle, CheckCircle,
} from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

type NodeId =
  | "story-primary" | "novel-config" | "naming-ref" | "anchor"
  | "context-packet" | "scene-bank" | "skeleton" | "expansion"
  | "lore-check" | "scan-report" | "pass-decision"
  | "canon-assembly" | "artifact-update";

interface DiagramNode {
  id: NodeId;
  label: string;
  icon: typeof FileText;
  x: number;
  y: number;
  category: "document" | "phase" | "quality";
  detail: {
    title: string;
    body: string;
    sample?: string;
  };
}

const NODES: DiagramNode[] = [
  { id: "story-primary", label: "Story Primary", icon: FileText, x: 10, y: 8, category: "document",
    detail: { title: "Story Primary", body: "The novel's governing document. Contains premise, arc breakdowns with per-chapter beat specifications, timeline ledger, motif registry, and prose directives. Outranks all other artifacts.", sample: "Arc VI, Ch 140 entry:\nBeat: Vorn's death arrives through the lattice before any channel confirms it.\nTone: Institutional grief processed through century-trained competence.\nPROSE DIRECTIVE: The face shows what it absorbs in the interval before the person inside it has decided how to carry it." }},
  { id: "novel-config", label: "Novel Config", icon: Database, x: 35, y: 8, category: "document",
    detail: { title: "Novel Configuration", body: "Per-novel operational settings: chapter length targets (3,000–4,000 words), voice rules, character disruption registers, eval dimension weights (PRIMARY/SECONDARY/TERTIARY), writing technique activation, pass activation settings.", sample: "PRIMARY: sensory_grounding, dialogue_humanity,\n  emotional_restraint, voice_consistency, arc_coherence\nSECONDARY: pacing_fit, scene_pressure, ending_residue\nOAC_TARGET_INFLATION: 120%" }},
  { id: "naming-ref", label: "Naming Reference", icon: Database, x: 60, y: 8, category: "document",
    detail: { title: "Naming Reference", body: "Every proper noun in the novel — characters, locations, factions, institutions, objects. Each entry marked [INITIALIZED] or [ADDED Ch N]. Checked before every chapter assembly. Prevents naming collisions across 170+ chapters.", sample: "Saelis Vorn — Continuity provisions office,\n  administrative director. [ADDED Ch 140]\nMedas Vorn — Journalist. [ADDED Ch 120]\n  Note: surname collision, different first names.\n  Acceptable per naming rules." }},
  { id: "anchor", label: "Anchor Files", icon: Database, x: 85, y: 8, category: "document",
    detail: { title: "Anchor Files", body: "Lore state snapshots written every 10 chapters. Compress and preserve the critical state from each batch — world state, character states, open threads, resolved threads. A cold-start model reads the latest anchor to resume with full consistency.", sample: "anchor_v14_ch131-140.txt:\nWorld state: Post-engagement. Meridian withdrawal\n  confirmed. Seven peripheral bodies permanently dark.\nIris state: Lattice connection at fewer-instruments.\n  Micro-disconnections every 72 hours.\nOpen thread: Vorn's legal vocabulary — who carries it?" }},

  { id: "context-packet", label: "Context Packet", icon: FileText, x: 10, y: 38, category: "phase",
    detail: { title: "Phase 0 — Context Packet", body: "Built before every chapter. Contains: task type, chapter range, POV owner, arc pressure, open threads, locked facts, scene goals, no-go items, beat trajectory for the 3–4 chapters before and after. Also extracts the story primary's Location, Tone, PROSE DIRECTIVE, and CONSTRAINT labels.", sample: "context_packet_ch140.md:\nPOV: Omniscient (Helia/Iris/Nora rotation)\nArc pressure: Terminal — Vorn's death is the\n  first non-combat loss in the arc\nLocked: Vorn's 31-year tenure, cardiac event,\n  09:17 timestamp, 73-minute lattice delay\nNo-go: Do not name the grief explicitly" }},
  { id: "scene-bank", label: "Scene Bank", icon: LayoutList, x: 33, y: 38, category: "phase",
    detail: { title: "Phase 2 — Scene Bank", body: "Scene list with dramatic purpose, conflict pressure, what changes, what residue remains. Each story primary beat is translated into the situation that produces the behavior — what forces or reveals it, who else is in the scene, what must not be stated explicitly.", sample: "Ch 140, Scene 2:\nPurpose: Lattice registers absence before\n  notification — governance grief processed\n  through century-trained channels.\nChanges: Reader sees the face absorb and\n  redirect in 38 seconds.\nResidue: 73 minutes of carrying before naming." }},
  { id: "skeleton", label: "Skeleton v1", icon: PenTool, x: 56, y: 38, category: "phase",
    detail: { title: "Phase 3 — Skeleton Draft", body: "First pass: 1,400–2,200 words. All beats present, no fact contradictions, no missing transitions. Every scene changes knowledge, pressure, intimacy, leverage, or cost. This is structure proof, not finished prose.", sample: "ch140_v1.txt — 2,309 words\nAll three POV sections present.\nVorn paragraph: 1.5 paragraphs (directive says one).\nPolitical consequence section dominates over\n  human response. → Flagged for redistribution." }},
  { id: "expansion", label: "Expansion v2", icon: Maximize2, x: 79, y: 38, category: "phase",
    detail: { title: "Phase 4 — Expansion Pass", body: "Reach 3,000–4,000 words through scene pressure, sensory grounding, hesitation, aftermath, subtext. Expansion moves: extend negotiation beats, add environmental resistance, add interrupted thought, add physical actions that alter tempo, add aftermath beats that create residue.", sample: "Ch 140 expansion points:\n+250: Helia's private grief — the moment it\n  arrives in the body before routing invisible.\n+200: Iris/Nora embodied response to loss\n  notification.\n+150: Destabilization — one surface-rupture\n  moment across three characters." }},

  { id: "lore-check", label: "Lore Check", icon: AlertTriangle, x: 10, y: 68, category: "quality",
    detail: { title: "Phase 4.5 — Lore Consistency Check", body: "Three required checks before any prose work. Timeline arithmetic: verify every duration statement against the timeline ledger. Naming cross-check: every proper noun verified against naming reference. Knowledge boundary: each character acts only on information they could possess.", sample: "Ch 140 lore check:\nTimeline: Vorn's 31 years (entered at 36,\n  died at 67). 67 - 36 = 31. ✓\nNaming: 'Saelis Vorn' — surname collision\n  with Medas Vorn (Ch 120). Acceptable:\n  different first names, roles, contexts.\nKnowledge: Iris knows at 09:17 via lattice.\n  Nora learns at 10:30 via feed. ✓" }},
  { id: "scan-report", label: "Scan Report", icon: ScanLine, x: 33, y: 68, category: "quality",
    detail: { title: "10-Dimensional Scan", body: "Each chapter scored 1–10 across dimensions. PRIMARY dimensions must score ≥7 for assembly. Score interpretation is arc-position aware — a scene_pressure of 7 is correct for a pastoral chapter and wrong for an engagement chapter.", sample: "Ch 140 scan:\nsensory_grounding:    8\ndialogue_humanity:    9\nemotional_restraint:  8\nvoice_consistency:    9\narc_coherence:        9\npacing_fit:           7\nscene_pressure:       7 (correct for grief ch)\nending_residue:       9\nVerdict: EXPANSION-COUPLED" }},
  { id: "pass-decision", label: "Pass Decision", icon: CheckCircle, x: 56, y: 68, category: "quality",
    detail: { title: "Smart Pass Protocol", body: "After eval, a decision tree routes to the correct pass. Lore failure → stop. Any PRIMARY <6 → scene reconstruction. Over target → Compression Pass. Under target → Expansion Pass. Then: targeted passes per weak dimension. A chapter that has been through two passes without improvement → escalate to scene reconstruction.", sample: "Ch 140 decision flow:\nLore: PASS\nLength: 2,309w → under MIN by 691w\n  → Route to EXPANSION-COUPLED\nPRIMARY check: all ≥ 7 ✓\nDestabilization needed: YES\n  (grief chapter needs one surface-rupture)\nFinal verdict: STANDARD + EXPANSION" }},
  { id: "canon-assembly", label: "Canon Assembly", icon: PackageCheck, x: 79, y: 68, category: "phase",
    detail: { title: "Phase 6 — Canon Assembly", body: "Only after structure, length, lore, and prose review pass. Merge into the novel file. Verify neighboring chapter transitions. Apply the exact chapter marker format. A chapter with any lore failure or PRIMARY dimension <7 cannot enter canon.", sample: "Assembly gate for Ch 140:\n✓ Chapter marker correct\n✓ No factual drift vs. story primary\n✓ All names in naming reference\n✓ Scene sequence causally complete\n✓ Word count: 3,000+ (after expansion)\n✓ Prose review completed\n→ ASSEMBLED into hollow-iris.txt" }},
  { id: "artifact-update", label: "Artifact Update", icon: RefreshCw, x: 92, y: 88, category: "phase",
    detail: { title: "Phase 7 — Artifact Update", body: "After assembly: update naming reference with new proper nouns, write new anchor file if batch closes a range, update story primary if world/relationship/political state changed, mark scene bank entries as used/deferred/dropped.", sample: "After Ch 140 assembly:\n+ NAMING_REFERENCE: Saelis Vorn added\n+ anchor_v14_ch131-140.txt: written\n+ Story Primary: Vorn's legal vocabulary\n  status → 'uncarried, thread open'\n+ Scene bank: all Ch 140 scenes → 'used'" }},
];

const EDGES: { from: NodeId; to: NodeId; label?: string }[] = [
  { from: "story-primary", to: "context-packet", label: "beats, directives" },
  { from: "novel-config", to: "context-packet", label: "voice rules, targets" },
  { from: "naming-ref", to: "lore-check" },
  { from: "anchor", to: "context-packet", label: "lore state" },
  { from: "context-packet", to: "scene-bank" },
  { from: "scene-bank", to: "skeleton" },
  { from: "skeleton", to: "expansion" },
  { from: "expansion", to: "lore-check" },
  { from: "lore-check", to: "scan-report" },
  { from: "scan-report", to: "pass-decision" },
  { from: "pass-decision", to: "expansion", label: "REVISE" },
  { from: "pass-decision", to: "canon-assembly", label: "PASS" },
  { from: "canon-assembly", to: "artifact-update" },
  { from: "artifact-update", to: "anchor" },
  { from: "artifact-update", to: "naming-ref" },
  { from: "artifact-update", to: "story-primary" },
];

const CATEGORY_COLORS = {
  document: { bg: "rgba(255,156,0,0.10)", border: "rgba(255,156,0,0.45)", text: "var(--accent)" },
  phase: { bg: "rgba(128,128,128,0.08)", border: "var(--border-phase)", text: "var(--text-secondary)" },
  quality: { bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.45)", text: "#10b981" },
};

const LAYER_GROUPS: { key: "document" | "phase" | "quality"; label: string; sub: string }[] = [
  { key: "document", label: "Document Layer", sub: "Persistent state" },
  { key: "phase", label: "Pipeline Phases", sub: "Per-chapter execution" },
  { key: "quality", label: "Quality Gate", sub: "Evaluation + routing" },
];

function NodeButton({ node, isSelected, dimmed, onSelect }: {
  node: DiagramNode;
  isSelected: boolean;
  isConnected: boolean;
  dimmed: boolean;
  onSelect: () => void;
}) {
  const Icon = node.icon;
  const colors = CATEGORY_COLORS[node.category];
  const [isHov, setIsHov] = useState(false);

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => { setIsHov(true); }}
      onMouseLeave={() => { setIsHov(false); }}
      style={{
        background: "var(--bg)",
        border: `1px solid ${isSelected ? "var(--accent)" : colors.border}`,
        borderRadius: 12,
        padding: "8px 14px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        opacity: dimmed ? 0.25 : 1,
        transition: "all 0.25s cubic-bezier(0.23, 1, 0.32, 1)",
        boxShadow: isSelected ? "0 0 0 2px rgba(255,156,0,0.15)" : "var(--shadow-glass)",
        whiteSpace: "nowrap",
        flexShrink: 0,
        transform: `scale(${isHov ? 1.05 : 1})`,
      }}
    >
      <div style={{
        background: dimmed ? "var(--bg-glass)" : colors.bg,
        position: "absolute",
        left:0,
        right:0,
        top:0,
        bottom:0,
        borderRadius: 12,
      }}></div>
      <Icon size={13} style={{ color: colors.text, flexShrink: 0 }} />
      <span style={{ fontSize: "0.75rem", fontWeight: 500, color: !dimmed ? "var(--text)" : "var(--text-secondary)" }}>{node.label}</span>
    </button>
  );
}

export function ArchitectureDiagram() {
  const [selected, setSelected] = useState<NodeId | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const selectedNode = NODES.find(n => n.id === selected);
  const connectedTo = selected ? EDGES.filter(e => e.from === selected || e.to === selected).map(e => e.from === selected ? e.to : e.from) : [];

  const handleSelect = (id: NodeId) => setSelected(prev => prev === id ? null : id);

  return (
    <section ref={containerRef} style={{ maxWidth: 1200, margin: "0 auto", padding: "6rem clamp(1.25rem, 4vw, 3rem)" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--accent)" }}>System architecture</span>
        <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 200, color: "var(--text)", marginTop: "0.5rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          The architecture visible all the way down.
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)", color: "var(--text-tertiary)", marginTop: "0.75rem" }}>
          Click any node to inspect. Every connection is a real data dependency.
        </p>
      </div>

      <div style={{
        display: "flex", gap: "clamp(1rem, 2vw, 1.5rem)", flexDirection: isMobile ? "column" : "row",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
      }}>
        {isMobile ? (
          /* Mobile: vertical layer groups with scrollable rows */
          <div>
            {LAYER_GROUPS.map((layer, li) => {
              const layerNodes = NODES.filter(n => n.category === layer.key);
              return (
                <div key={layer.key} style={{ marginBottom: li < LAYER_GROUPS.length - 1 ? "1.5rem" : 0 }}>
                  <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.5rem", opacity: 0.7 }}>
                    <div>{layer.label}</div>
                    <div style={{ fontSize: "8px", fontWeight: 400, letterSpacing: "0.1em", marginTop: 2 }}>{layer.sub}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, paddingTop: 8 }}>
                    {layerNodes.map(node => {
                      const isSelected = selected === node.id;
                      const isConnected = connectedTo.includes(node.id);
                      const dimmed = !!selected && !isSelected && !isConnected;
                      return (
                        <NodeButton
                          key={node.id}
                          node={node}
                          isSelected={isSelected}
                          isConnected={isConnected}
                          dimmed={dimmed}
                          onSelect={() => handleSelect(node.id)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop: absolute-positioned diagram with SVG edges */
          <div style={{ flex: "1 1 600px", minHeight: 460, position: "relative" }}>

            {/* SVG edges — z-index 0, always behind nodes */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "visible" }}>
              {EDGES.map((edge, i) => {
                const from = NODES.find(n => n.id === edge.from)!;
                const to = NODES.find(n => n.id === edge.to)!;
                const x1 = from.x + 4;
                const y1 = from.y + 5;
                const x2 = to.x + 4;
                const y2 = to.y + (to.y > from.y ? 0 : 5);
                const isActive = selected && (edge.from === selected || edge.to === selected);
                const isRevise = edge.label === "REVISE";
                return (
                  <line
                    key={i}
                    x1={`${x1}%`} y1={`${y1}%`}
                    x2={`${x2}%`} y2={`${y2}%`}
                    stroke={isActive ? "var(--accent)" : "var(--border)"}
                    strokeWidth={isActive ? 1.5 : 0.8}
                    strokeDasharray={isRevise ? "4 3" : "none"}
                    opacity={selected && !isActive ? 0.2 : 0.6}
                    style={{ transition: "opacity 0.3s, stroke 0.3s" }}
                  />
                );
              })}
            </svg>

            {/* Nodes — z-index 1, positioned absolutely to fill container */}
            <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
              {NODES.map(node => {
                const isSelected = selected === node.id;
                const isConnected = connectedTo.includes(node.id);
                const dimmed = !!selected && !isSelected && !isConnected;
                return (
                  <div
                    key={node.id}
                    style={{
                      position: "absolute",
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: "translate(-50%, 0)",
                      zIndex: isSelected ? 10 : 1,
                    }}
                  >
                    <NodeButton
                      node={node}
                      isSelected={isSelected}
                      isConnected={isConnected}
                      dimmed={dimmed}
                      onSelect={() => handleSelect(node.id)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Layer labels */}
            <div style={{ position: "absolute", left: 0, top: "2%", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-tertiary)", opacity: 0.4, pointerEvents: "none" }}>
              Document Layer
            </div>
            <div style={{ position: "absolute", left: 0, top: "32%", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-tertiary)", opacity: 0.4, pointerEvents: "none" }}>
              Pipeline Phases
            </div>
            <div style={{ position: "absolute", left: 0, top: "62%", fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-tertiary)", opacity: 0.4, pointerEvents: "none" }}>
              Quality Gate
            </div>
          </div>
        )}

        {/* Detail panel */}
        <div
          className="glass-card"
          style={{
            flex: isMobile ? "1 1 100%" : "0 0 clamp(300px, 35%, 400px)",
            padding: "clamp(1.25rem, 2vw, 1.75rem)",
            minHeight: isMobile ? 200 : 460,
            opacity: selectedNode ? 1 : 0.5,
            transition: "opacity 0.3s ease",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {selectedNode ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: CATEGORY_COLORS[selectedNode.category].text }}>
                    {selectedNode.category}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-ui)", fontSize: "1rem", fontWeight: 500, color: "var(--text)", marginTop: "0.25rem" }}>{selectedNode.detail.title}</h3>
                </div>
                <button onClick={() => setSelected(null)} style={{ padding: 4, borderRadius: "var(--btn-radius)", color: "var(--text-tertiary)", cursor: "pointer", background: "none", border: "none" }}>
                  <X size={14} />
                </button>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "1rem" }}>{selectedNode.detail.body}</p>
              {selectedNode.detail.sample && (
                <div style={{ padding: "0.75rem 1rem", background: "rgba(128,128,128,0.04)", borderRadius: 9, border: "1px solid var(--border)", fontFamily: "ui-monospace, Consolas, monospace", fontSize: "0.72rem", lineHeight: 1.6, color: "var(--text-tertiary)", whiteSpace: "pre-wrap", flex: 1, overflow: "auto" }}>
                  {selectedNode.detail.sample}
                </div>
              )}
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-tertiary)", lineHeight: 1.65 }}>
                Click any node to see its role, data format, and a real sample from the Hollow Iris pipeline.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
        {([
          { color: "rgba(255,156,0,0.18)", label: "Document layer" },
          { color: "var(--border)", label: "Pipeline phase" },
          { color: "rgba(16,185,129,0.18)", label: "Quality gate" },
        ]).map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, border: `1.5px solid ${item.color}` }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
