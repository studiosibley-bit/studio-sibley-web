import { ImageResponse } from "next/og";

export const alt = "Studio Sibley — Photo, Video & Design";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #00162A 0%, #001d38 60%, #00162A 100%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", fontSize: 104, fontWeight: 700, letterSpacing: "-0.03em" }}>
          <div style={{ display: "flex", color: "#FFFFFF" }}>studio</div>
          <div style={{ display: "flex", color: "#FF966F" }}>sibley</div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 30,
            fontWeight: 600,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Photo · Video · Design
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            width: 120,
            height: 4,
            borderRadius: 9999,
            background: "linear-gradient(90deg, #FFD694, #FF966F)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
