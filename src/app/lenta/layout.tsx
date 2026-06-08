import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Mening maqolam",
  description: "Saqlangan va sevimli maqolalaringiz.",
  path: "/lenta",
});

export default function SavedFeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
