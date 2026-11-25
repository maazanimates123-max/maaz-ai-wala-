import { ImageResponse } from "next/og";

export const alt = "Maaz AI Wala — AI Automation Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#050505", padding: 72, color: "white", fontFamily: "sans-serif", backgroundImage: "radial-gradient(circle at 80% 30%, rgba(167,139,250,.28), transparent 45%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, letterSpacing: 6, color: "#a78bfa" }}>MAAZ AI WALA</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>Transform Your Business With AI Automation</div>
          <div style={{ fontSize: 30, color: "#a3a3ad", marginTop: 24 }}>n8n Workflows · AI Agents · AI Chatbots · Business Automation</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#a78bfa" }}>Automate. Create. Grow.</div>
      </div>
    ),
    size,
  );
}
