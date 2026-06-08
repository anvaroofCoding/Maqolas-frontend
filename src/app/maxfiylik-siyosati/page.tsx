import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { privacyPageContent } from "@/content/legal-pages";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Maxfiylik siyosati",
  description: privacyPageContent.description,
  path: "/maxfiylik-siyosati",
});

export default function PrivacyPage() {
  return <LegalPageShell {...privacyPageContent} />;
}
