import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Maqola yozish",
  path: "/yozish",
});

export default function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
