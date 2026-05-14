import { useEffect, useRef, useState } from "react";
import { getTextWallLines } from "../novel-text";
import { fbm } from "../perlin";

// ══════════════════════════════════════════════════════════════
// TUNABLE PARAMETERS — adjust these to change the text wall look
// ══════════════════════════════════════════════════════════════
const GREY_BASE: [number, number, number] = [150, 150, 150];
const ACCENT_LIGHT: [number, number, number] = [237, 186, 109];
const ACCENT: [number, number, number] = [255, 156, 0];
const ACCENT_SAT: [number, number, number] = [255, 113, 0];

const GREY_THRESHOLD = 0.18;     // noise below this → grey (lower = more accent coverage)
const COLOR_LIGHT_END = 0.35;    // blend grey→accent_light ends here
const COLOR_MID_END = 0.52;      // blend accent_light→accent ends here
// above COLOR_MID_END → blend accent→accent_sat

const BASE_ALPHA = 0.32;         // alpha for grey-zone text
const COLOR_ALPHA_MIN = 0.55;    // minimum alpha for colored text
const COLOR_ALPHA_GAIN = 0.65;   // alpha ramp for colored text
const EDGE_FADE_RADIUS = 0.50;   // viewport fraction for radial fade (lower = tighter circle)
const ANIMATION_SPEED = 0.004;   // time increment per frame (higher = faster drift)
const NOISE_SCALE_X = 0.25;      // horizontal noise scale (lower = bigger color blobs)
const NOISE_SCALE_Y = 0.25;      // vertical noise scale
const QUANTIZE_STEPS = 4;        // color band steps (higher = smoother gradient)
const FLICKER_THRESHOLD = 0.97;  // sin() above this triggers flicker (higher = rarer)
const FLICKER_BOOST = 0.25;      // alpha boost during flicker
const MUTATION_INTERVAL = 240;   // frames between word swaps (~4s at 60fps)
// ══════════════════════════════════════════════════════════════

type C3 = readonly [number, number, number];
function mix(a: C3, b: C3, t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

// Logo typing animation timeline (ms from mount)
// Discrete character reveal steps — clipRight % after each character appears
// R      e     n     d     e     r     e     r     |
const CHAR_CLIPS = [87.5, 77, 65, 53, 43, 34, 23, 12, 0];
// Per-character delays in ms (natural typing cadence variation)
const CHAR_DELAYS = [100, 90, 110, 85, 105, 95, 80, 120];

const CURSOR_APPEAR = 400;
const TYPE_R_AT = 900;
const BLINK1_DUR = 1060; // 2 blinks × 530ms cycle
const TYPE_REST_AT = TYPE_R_AT + 50 + BLINK1_DUR; // ~2010
const BLINK2_DUR = 1060;
// Pipe bar in SVG is ~36 units / 2026 viewBox width = 1.78%
const CURSOR_WIDTH_PCT = 1.72;

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const tRef = useRef(0);
  const linesRef = useRef(getTextWallLines());
  const mutationCounterRef = useRef(0);

  const [clipRight, setClipRight] = useState(100);
  const [showCursor, setShowCursor] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [cursorFading, setCursorFading] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);

  // Typing animation — discrete per-character steps, no smooth transition
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    // Cursor appears and blinks
    t(CURSOR_APPEAR, () => setShowCursor(true));

    // Type "R" — single discrete jump
    t(TYPE_R_AT, () => {
      setIsTyping(true);
      setClipRight(CHAR_CLIPS[0]);
    });
    t(TYPE_R_AT + 50, () => setIsTyping(false));

    // After 2 blinks, type "enderer|" character by character
    let cumDelay = 0;
    for (let i = 1; i < CHAR_CLIPS.length; i++) {
      cumDelay += CHAR_DELAYS[i - 1];
      const clip = CHAR_CLIPS[i];
      t(TYPE_REST_AT + cumDelay, () => setClipRight(clip));
    }
    t(TYPE_REST_AT, () => setIsTyping(true));
    const typingEnd = TYPE_REST_AT + cumDelay + 50;
    t(typingEnd, () => setIsTyping(false));

    // After 2 more blinks, fade cursor and show tagline
    const cursorFadeAt = typingEnd + BLINK2_DUR;
    t(cursorFadeAt, () => setCursorFading(true));
    t(cursorFadeAt + 300, () => setShowCursor(false));
    t(cursorFadeAt + 500, () => setTaglineVisible(true));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Canvas text wall animation
  useEffect(() => {
    const canvas = canvasRef.current!;
    const container = containerRef.current!;
    const ctx = canvas.getContext("2d")!;
    let running = true;

    function frame() {
      if (!running) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) { rafRef.current = requestAnimationFrame(frame); return; }

      const cw = Math.round(w * dpr);
      const ch = Math.round(h * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const time = tRef.current;
      const lines = linesRef.current;
      const fontSize = Math.max(12, Math.min(16, w * 0.0095));
      const lineH = fontSize * 1.85;
      ctx.font = `700 ${fontSize}px Georgia, "Times New Roman", serif`;
      ctx.textBaseline = "top";

      const totalH = lines.length * lineH;
      const y0 = (h - totalH) / 2;
      const centerX = w / 2;
      const centerY = h / 2;
      const maxR = Math.max(w, h) * EDGE_FADE_RADIUS;

      for (let i = 0; i < lines.length; i++) {
        const y = y0 + i * lineH;
        const line = lines[i];
        const lineW = ctx.measureText(line).width;
        const copies = Math.ceil(w / (lineW + 60)) + 1;

        for (let copy = 0; copy < copies; copy++) {
          const baseX = copy * (lineW + 60) - 30;
          const words = line.split(" ");
          let x = baseX;
          const spW = ctx.measureText(" ").width;

          for (let j = 0; j < words.length; j++) {
            const word = words[j];
            const ww = ctx.measureText(word).width;
            const mx = x + ww / 2;
            const my = y + fontSize / 2;

            const nRaw = (fbm(mx / (w * NOISE_SCALE_X) + time * 0.18, my / (h * NOISE_SCALE_Y) + time * 0.09, 4, 2.2, 0.5) + 1) * 0.5;
            const n = Math.floor(nRaw * QUANTIZE_STEPS) / QUANTIZE_STEPS;

            let c: [number, number, number];
            if (n < GREY_THRESHOLD) c = [...GREY_BASE];
            else if (n < COLOR_LIGHT_END) c = mix(GREY_BASE, ACCENT_LIGHT, (n - GREY_THRESHOLD) / (COLOR_LIGHT_END - GREY_THRESHOLD));
            else if (n < COLOR_MID_END) c = mix(ACCENT_LIGHT, ACCENT, (n - COLOR_LIGHT_END) / (COLOR_MID_END - COLOR_LIGHT_END));
            else c = mix(ACCENT, ACCENT_SAT, Math.min(1, (n - COLOR_MID_END) / (1 - COLOR_MID_END)));

            const dx = mx - centerX;
            const dy = my - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const edgeFade = Math.max(0, 1 - (dist / maxR) * (dist / maxR));

            const flickerPhase = Math.sin(time * 3.7 + mx * 0.01 + my * 0.02);
            const flicker = flickerPhase > FLICKER_THRESHOLD ? FLICKER_BOOST : 0;

            const colorStrength = n > GREY_THRESHOLD
              ? COLOR_ALPHA_MIN + (n - GREY_THRESHOLD) * COLOR_ALPHA_GAIN
              : BASE_ALPHA;
            const a = Math.max(0, Math.min(1, edgeFade * (colorStrength + flicker)));

            ctx.fillStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a.toFixed(3)})`;
            ctx.fillText(word, x, y);
            x += ww + spW;
          }
        }
      }

      mutationCounterRef.current += 1;
      if (mutationCounterRef.current > MUTATION_INTERVAL) {
        mutationCounterRef.current = 0;
        const mutableLines = [...linesRef.current];
        const lineIdx = Math.floor(Math.random() * mutableLines.length);
        const words = mutableLines[lineIdx].split(" ");
        if (words.length > 2) {
          const wordIdx = Math.floor(Math.random() * words.length);
          const donorLineIdx = Math.floor(Math.random() * mutableLines.length);
          const donorWords = mutableLines[donorLineIdx].split(" ");
          words[wordIdx] = donorWords[Math.floor(Math.random() * donorWords.length)];
          mutableLines[lineIdx] = words.join(" ");
          linesRef.current = mutableLines;
        }
      }

      tRef.current += ANIMATION_SPEED;
      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, var(--bg) 85%)",
        pointerEvents: "none", zIndex: 1,
      }} />
      
      {/* Blur layer — masked so blur only applies near edges */}
      <div style={{
        position: "absolute", inset: 0,
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        maskImage: "radial-gradient(ellipse at center, transparent 28%, black 65%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, transparent 28%, black 65%)",
      }} />

      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        width: "min(600px, 90vw)", height: "200px",
        background: "radial-gradient(ellipse, rgba(255, 156, 0, 0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        zIndex: 1,
      }} />

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem" }}>
        {/* Logo with typing animation */}
        <div style={{ position: "relative", width: "min(520px, 75vw)" }}>
          <img
            src="/logo.svg"
            alt="Renderer"
            style={{
              width: "100%",
              height: "auto",
              clipPath: `inset(0 ${clipRight}% 0 0)`,
              filter: "var(--logo-filter, none)",
            }}
          />
          {/* Typing cursor — sized to match the SVG pipe bar */}
          {showCursor && (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                height: "97%",
                width: `${CURSOR_WIDTH_PCT}%`,
                // Offset by cursor width + 0.6% SVG right margin so cursor overlaps the pipe bar
                left: `${100 - clipRight - CURSOR_WIDTH_PCT - 0.3}%`,
                borderRadius: 9999,
                background: "var(--text)",
                opacity: cursorFading ? 0 : undefined,
                transition: cursorFading ? "opacity 0.3s ease" : "none",
                animation: isTyping ? "none" : "cursorBlink 530ms step-end infinite",
              }}
            />
          )}
        </div>

        <p
          className="glass-pill"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
            color: "var(--text-secondary)",
            letterSpacing: "0.02em",
            opacity: taglineVisible ? 1 : 0,
            transform: taglineVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
            textAlign: "center",
            maxWidth: "90vw",
            padding: "0.5rem 1.5rem",
            margin: 0,
          }}
        >
          Prose is the last thing you touch.
        </p>
      </div>

      <style>{`
        @media (prefers-color-scheme: dark) { :root { --logo-filter: invert(1); } }
        @keyframes cursorBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
