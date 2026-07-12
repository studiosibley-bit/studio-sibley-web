import ConnectForm from "./ConnectForm";

export default function ConnectClient({ bgUrl }: { bgUrl?: string }) {
  return (
    <section
      style={{
        paddingTop: "var(--nav-offset)",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundImage: bgUrl ? `url(${bgUrl})` : "url(/backgrounds/connect.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mobile-content" style={{ padding: "var(--space-56) var(--space-40) var(--space-64)", position: "relative", zIndex: 1 }}>
        <div>
          <p className="section-label" style={{ marginBottom: "var(--space-20)" }}>Connect</p>
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 var(--space-32)",
            textAlign: "center",
          }}
        >
          Send me a message.
        </h1>

        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <ConnectForm />
        </div>
      </div>
    </section>
  );
}
