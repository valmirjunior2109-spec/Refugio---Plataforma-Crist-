import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name}: ${SITE.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F5EF",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="84" height="84" viewBox="0 0 48 48">
            <path d="M9 22.5 24 10l15 12.5" fill="none" stroke="#668773" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="29.2" r="3.7" fill="#34463B" />
            <path d="M14 30.2c1.1 5.9 4.9 9.6 10 9.6s8.9-3.7 10-9.6" fill="none" stroke="#668773" strokeWidth="3.6" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 56, color: "#34463B", display: "flex" }}>
            refúgio<span style={{ color: "#668773" }}>.</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, lineHeight: 1.08, color: "#2C362F", maxWidth: 900 }}>{SITE.slogan}</div>
          <div style={{ fontSize: 30, color: "#5F675F", maxWidth: 920, fontFamily: "sans-serif" }}>
            Palavra do dia, Bíblia, diário de oração e planos de leitura. Gratuito, sempre.
          </div>
        </div>
        <div style={{ height: 10, width: 160, background: "#668773", borderRadius: 999 }} />
      </div>
    ),
    size,
  );
}
