import { useEffect, useRef, useState } from "react";
import { BookOpen, ArrowRight, Download } from "lucide-react";

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "6rem clamp(1.25rem, 4vw, 3rem)",
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition:
          "opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
          fontWeight: 200,
          color: "var(--text)",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          marginBottom: "0.75rem",
        }}
      >
        Use the framework. Build what you mean.
      </h2>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
          color: "var(--text-secondary)",
          maxWidth: 480,
          margin: "0 auto 2.5rem",
          lineHeight: 1.65,
        }}
      >
        The full pipeline is open. Every document, every pass protocol, every
        evaluation dimension — ready to drop into your own project.
      </p>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap" as const,
        }}
      >
        <a
          href="https://github.com/Piyakorn2112/Renderer"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-pill"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.75rem",
            fontSize: "0.9rem",
            fontWeight: 500,
            background: "var(--accent)",
            color: "#fff",
            textDecoration: "none",
            transition: "transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Download size={16} />
          Download
          <ArrowRight size={14} />
        </a>

        <a
          href="/renderer-skill.zip"
          download="renderer-skill.zip"
          className="glass-pill"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.75rem",
            fontSize: "0.9rem",
            fontWeight: 500,
            textDecoration: "none",
            color: "var(--text)",
            transition: "transform 0.15s ease, box-shadow 0.2s ease",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Download size={16} />
          Claude Skill
          <span style={{
            fontSize: "0.7rem",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "2px 6px",
            borderRadius: "9999px",
            background: "rgba(255,156,0,0.12)",
            color: "var(--accent)",
          }}>/renderer</span>
        </a>

        <a
          href="https://vivid-novel-reader.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-pill"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.75rem",
            fontSize: "0.9rem",
            fontWeight: 500,
            textDecoration: "none",
            color: "var(--text)",
            transition: "transform 0.15s ease, box-shadow 0.2s ease",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <BookOpen size={16} />
          Read novels
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}
