export function Footer() {
  return (
    <footer
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "3rem clamp(1.25rem, 4vw, 3rem)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap" as const,
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <img
          src="/logo.svg"
          alt="Renderer"
          style={{
            height: 14,
            width: "auto",
            opacity: 0.4,
            filter: "var(--logo-filter, none)",
          }}
        />
        <span
          style={{
            fontSize: "0.8rem",
            color: "var(--text-tertiary)",
          }}
        >
          A production pipeline for long-form literary fiction.
        </span>
      </div>

      <p
        style={{
          fontSize: "0.75rem",
          color: "var(--text-tertiary)",
        }}
      >
        Built by K. Pie
      </p>
    </footer>
  );
}
