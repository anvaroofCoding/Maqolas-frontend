import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Maqola yozish",
  description: "Yangi o'zbekcha maqola yozish va nashr etish.",
  path: "/yozish",
  noIndex: true,
});

export default function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
