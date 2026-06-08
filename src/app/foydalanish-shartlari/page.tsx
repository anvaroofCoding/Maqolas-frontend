import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { termsPageContent } from "@/content/legal-pages";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Foydalanish shartlari",
  description: termsPageContent.description,
  path: "/foydalanish-shartlari",
});

export default function TermsPage() {
  return <LegalPageShell {...termsPageContent} />;
}
