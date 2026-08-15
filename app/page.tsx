export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "28rem" }}>
        <p
          style={{
            margin: "0 0 0.5rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontSize: "0.75rem",
            color: "var(--muted)",
          }}
        >
          Cedar Studio
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 2.75rem)",
            fontWeight: 550,
          }}
        >
          Todos loading…
        </h1>
        <p style={{ margin: "0.75rem 0 0", color: "var(--muted)" }}>
          API and interactive list coming next.
        </p>
      </div>
    </main>
  );
}
