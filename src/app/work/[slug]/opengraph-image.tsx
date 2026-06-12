import { getWorkItem, getWorkItems } from "@/lib/content/api";
import { ogCard, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Work item card";

export function generateStaticParams() {
  return getWorkItems().map((item) => ({ slug: item.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getWorkItem(slug);
  return ogCard({
    eyebrow: `cat ./work/${slug}.mdx`,
    title: item?.title ?? "Work",
    meta: item?.kind === "case-study" ? "Case study" : "Project",
  });
}
