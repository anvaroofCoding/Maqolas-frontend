import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { aboutPageContent } from "@/content/legal-pages";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Dastur haqida",
  description: aboutPageContent.description,
  path: "/dastur-haqida",
  keywords: ["maqolas", "maqola platformasi", "o'zbekcha maqolalar", "dastur haqida"],
});

export default function AboutPage() {
  return <LegalPageShell {...aboutPageContent} />;
}
