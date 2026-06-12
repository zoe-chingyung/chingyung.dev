import { ogCard, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "chingyung.dev — Cloud · Platform · Security Engineer";

export default function Image() {
  return ogCard({
    eyebrow: "whoami",
    title: "Cloud · Platform · Security Engineer",
  });
}
