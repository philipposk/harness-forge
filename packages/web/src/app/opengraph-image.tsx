import { ImageResponse } from "next/og";

export const alt = "AppBlueprints — multi-harness AI coding config generator";
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
          justifyContent: "center",
          padding: "80px",
          background: "#0b0b0c",
          color: "#f5f5f4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700 }}>AppBlueprints</div>
        <div style={{ fontSize: 40, marginTop: 24, color: "#d6d3d1" }}>
          A few answers about your app, setup files for your AI coding tool
        </div>
        <div style={{ fontSize: 28, marginTop: 40, color: "#a8a29e" }}>
          AGENTS.md · CLAUDE.md · .cursor/rules · skills · MCP
        </div>
      </div>
    ),
    size,
  );
}
