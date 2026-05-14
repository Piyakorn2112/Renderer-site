import { useEffect, useRef, useState } from "react";

export function DistanceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "6rem clamp(1.25rem, 4vw, 3rem)",
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition:
          "opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div
        style={{
          width: "3rem",
          height: 1,
          background:
            "linear-gradient(to right, transparent, var(--text-tertiary), transparent)",
          margin: "0 auto 2rem",
        }}
      />
      <blockquote
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(1rem, 2vw, 1.2rem)",
          lineHeight: 1.85,
          color: "var(--text-secondary)",
          fontStyle: "italic",
          margin: 0,
        }}
      >
        The distance problem arrives somewhere around chapter 30–50 for most
        writers — human or AI-assisted. The voice that was precise in chapter 8
        has quietly shifted by chapter 45. The character who had a specific
        quality early has become someone else through accumulated small
        decisions. The image planted in chapter 12 was forgotten before it could
        pay off in chapter 89.
      </blockquote>
      <p
        style={{
          marginTop: "1.5rem",
          fontFamily: "var(--font-ui)",
          fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
          fontWeight: 500,
          color: "var(--text)",
          letterSpacing: "-0.01em",
        }}
      >
        Renderer is for the novel that has more distance than any single session
        can hold.
      </p>
      <div
        style={{
          width: "3rem",
          height: 1,
          background:
            "linear-gradient(to right, transparent, var(--text-tertiary), transparent)",
          margin: "2rem auto 0",
        }}
      />
    </section>
  );
}
