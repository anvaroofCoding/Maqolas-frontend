import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Maqolani tahrirlash",
  description: "Admin maqola tahrirlash.",
  path: "/admin",
  noIndex: true,
});

export default function AdminEditArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
