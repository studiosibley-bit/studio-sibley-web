import ConnectForm from "./ConnectForm";

export default function ConnectClient({ bgUrl }: { bgUrl?: string }) {
  return (
    <section
      style={{
        paddingTop: "68px",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundImage: bgUrl ? `url(${bgUrl})` : "url(/backgrounds/connect.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mobile-content" style={{ padding: "3.5rem 2.5rem 4rem", position: "relative", zIndex: 1 }}>
        <div>
          <p className="section-label" style={{ marginBottom: "1.25rem" }}>Connect</p>
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 2rem",
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
