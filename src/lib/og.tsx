import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const bold = readFileSync(join(process.cwd(), "src/assets/JetBrainsMono-Bold.ttf"));
const regular = readFileSync(join(process.cwd(), "src/assets/JetBrainsMono-Regular.ttf"));

export const ogSize = { width: 1200, height: 630 };

/** Brand OG card: dark terminal aesthetic matching the site's status-line motif. */
export function ogCard(opts: { eyebrow: string; title: string; meta?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0e1116",
          color: "#e6e9ef",
          fontFamily: "JetBrains Mono",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#8b95a3" }}>
          <span style={{ color: "#2dd4bf", marginRight: 16 }}>$</span>
          {opts.eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: opts.title.length > 60 ? 52 : 64,
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        >
          {opts.title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#8b95a3",
            borderTop: "2px solid #232a33",
            paddingTop: 32,
          }}
        >
          <span style={{ color: "#2dd4bf" }}>chingyung.dev</span>
          <span>{opts.meta ?? "Cloud · Platform · Security"}</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "JetBrains Mono", data: bold, weight: 700 },
        { name: "JetBrains Mono", data: regular, weight: 400 },
      ],
    },
  );
}
