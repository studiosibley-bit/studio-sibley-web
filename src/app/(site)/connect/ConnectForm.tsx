"use client";

import { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";

const fieldStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--color-surface)",
  border: "1px solid rgba(51,65,85,0.7)",
  borderRadius: "10px",
  padding: "0.85rem 1.1rem",
  color: "rgba(255,255,255,0.5)",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: "0.88rem",
  fontWeight: 400,
  outline: "none",
  transition: "border-color 0.2s, color 0.2s",
  display: "block",
};

const errorStyle: React.CSSProperties = {
  fontSize: "0.72rem",
  color: "var(--color-coral)",
  marginTop: "0.3rem",
  paddingLeft: "0.25rem",
};

function Field({
  as = "input",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  as?: "input" | "textarea";
}) {
  const [focused, setFocused] = useState(false);
  const style = {
    ...fieldStyle,
    borderColor: focused ? "var(--color-coral)" : "rgba(51,65,85,0.7)",
    color: focused ? "var(--color-white)" : "rgba(255,255,255,0.45)",
  };

  if (as === "textarea") {
    return (
      <textarea
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        style={{ ...style, resize: "vertical", minHeight: 130 }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    );
  }
  return (
    <input
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      style={style}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export default function ConnectForm() {
  const [state, handleSubmit] = useForm("mykqkvbn");

  if (state.succeeded) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem 1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <p style={{ fontSize: "1.5rem" }}>✓</p>
        <p style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" }}>
          Message sent!
        </p>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", maxWidth: 320 }}>
          Thanks for reaching out. I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <Field name="name" type="text" placeholder="First & Last Name" required />
          <ValidationError field="name" prefix="Name" errors={state.errors} style={errorStyle} />
        </div>
        <div>
          <Field name="email" type="email" placeholder="Email Address" required />
          <ValidationError field="email" prefix="Email" errors={state.errors} style={errorStyle} />
        </div>
      </div>

      <Field name="subject" type="text" placeholder="Subject" required />

      <div>
        <Field
          as="textarea"
          name="message"
          placeholder="Tell me about your idea. Describe your project, timeline, and goals."
          required
        />
        <ValidationError field="message" prefix="Message" errors={state.errors} style={errorStyle} />
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <button
          type="submit"
          disabled={state.submitting}
          className="btn-gold"
          style={{
            padding: "0.85rem 2.5rem",
            fontSize: "0.9rem",
            fontWeight: 700,
            opacity: state.submitting ? 0.7 : 1,
            cursor: state.submitting ? "not-allowed" : "pointer",
          }}
        >
          {state.submitting ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
