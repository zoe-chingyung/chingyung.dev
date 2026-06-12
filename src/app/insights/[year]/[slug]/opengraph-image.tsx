import { getInsight, getInsights } from "@/lib/content/api";
import { ogCard, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Article card";

export function generateStaticParams() {
  return getInsights().map((post) => {
    const [year, slug] = post.slug.split("/");
    return { year, slug };
  });
}

export default async function Image({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}) {
  const { year, slug } = await params;
  const post = getInsight(year, slug);
  return ogCard({
    eyebrow: `cat ./insights/${year}/${slug}.mdx`,
    title: post?.title ?? "Insights",
    meta: post ? new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : undefined,
  });
}
