import { useEffect, useRef, useState } from "react";
import { Download, ArrowRight, MoreHorizontal } from "lucide-react";

const NAV_LINKS = [
  { href: "#architecture", label: "Architecture" },
  { href: "#quality", label: "Evidence" },
  { href: "#novels", label: "Novels" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [show, setShow] = useState(false);
  // 'full' ≥ 560px — all links visible | 'compact' < 560px — links in overflow
  const [navTier, setNavTier] = useState<"full" | "compact">("full");
  const [showOverflow, setShowOverflow] = useState(false);
  const overflowBtnRef = useRef<HTMLButtonElement>(null);
  const overflowMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setShow(y > 100 && y < lastY + 5);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const update = () => setNavTier(window.innerWidth >= 480 ? "full" : "compact");
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Close overflow when switching back to full
  useEffect(() => {
    if (navTier === "full") setShowOverflow(false);
  }, [navTier]);

  // Close overflow on outside click / touch
  useEffect(() => {
    if (!showOverflow) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (
        overflowMenuRef.current &&
        !overflowMenuRef.current.contains(e.target as Node) &&
        overflowBtnRef.current &&
        !overflowBtnRef.current.contains(e.target as Node)
      ) {
        setShowOverflow(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [showOverflow]);

  return (
    <div
      style={{
        position: "fixed",
        top: show ? 16 : -120,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        opacity: scrolled ? 1 : 0,
        transition: "top 0.45s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease",
        maxWidth: "calc(100vw - 32px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <nav
        className="glass-pill"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(0.5rem, 2vw, 1.5rem)",
          padding: "6px 6px 6px 16px",
        }}
      >
        <img
          src="/logo.svg"
          alt="Renderer"
          style={{ height: 16, width: "auto", filter: "var(--logo-filter, none)", transform: "translateY(-0.5px)", flexShrink: 0 }}
        />

        <div style={{ width: 1, height: 20, background: "var(--border)", flexShrink: 0 }} />

        {/* Nav links — full tier only */}
        {navTier === "full" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(0.25rem, 1vw, 0.75rem)",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{ padding: "6px 10px", borderRadius: "var(--btn-radius)", transition: "color 0.15s ease" }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* ⋯ overflow trigger — compact tier only */}
        {navTier === "compact" && (
          <button
            ref={overflowBtnRef}
            onClick={() => setShowOverflow((v) => !v)}
            aria-label="Navigation menu"
            aria-expanded={showOverflow}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "var(--btn-radius)",
              background: showOverflow ? "rgba(128,128,128,0.12)" : "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              flexShrink: 0,
              transition: "background 0.15s ease",
            }}
          >
            <MoreHorizontal size={16} />
          </button>
        )}

        <a
          href="https://github.com/Piyakorn2112/Renderer"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            fontSize: "0.8rem",
            fontWeight: 500,
            background: "var(--accent)",
            color: "#fff",
            borderRadius: "var(--btn-radius)",
            cursor: "pointer",
            textDecoration: "none",
            transition: "transform 0.15s ease",
            flexShrink: 0,
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Download size={13} />
          Download
          <ArrowRight size={12} />
        </a>
      </nav>

      {/* Overflow dropdown — compact tier only */}
      {showOverflow && navTier === "compact" && (
        <div
          ref={overflowMenuRef}
          style={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            minWidth: 160,
            borderRadius: 14,
            overflow: "hidden",
            background: "var(--bg-glass)",
            backdropFilter: "blur(16px) saturate(1.5)",
            WebkitBackdropFilter: "blur(16px) saturate(1.5)",
            border: "1px solid var(--border-glass)",
            boxShadow: "var(--shadow-glass-hover)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setShowOverflow(false)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "background 0.12s ease, color 0.12s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(128,128,128,0.08)"; e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
