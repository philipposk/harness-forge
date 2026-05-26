import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AppBlueprints — Multi-Harness AI Coding Config Generator",
  description:
    "Generate AGENTS.md, CLAUDE.md, .cursor/rules, skills and MCP bundles for whichever AI coding tool you use.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
