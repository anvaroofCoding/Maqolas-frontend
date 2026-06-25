import { TopicSuggestionsPage } from "@/components/topics/topic-suggestions-page";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { feedMainClassName } from "@/lib/layout";
import { buildMavzularPageJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Mavzular — maqola mavzulari va o'zbekcha maqolalar",
  description:
    "Maqola mavzulari: texnologiya, startaplar, AI, marketing va boshqalar. Har bir mavzu bo'yicha o'zbekcha maqolalar o'qing yoki o'zingizga mos mavzuda maqola yozing.",
  path: "/mavzular",
  keywords: [
    "maqola mavzulari",
    "maqola mavzusi",
    "mavzu bo'yicha maqolalar",
    "texnologiya maqolalari",
    "startap maqolalari",
    "maqola",
    "maqolalar",
    "o'zbekcha maqolalar",
  ],
});

export default function TopicSuggestionsRoutePage() {
  return (
    <main className={feedMainClassName}>
      <JsonLdScript data={buildMavzularPageJsonLd()} />
      <TopicSuggestionsPage />
    </main>
  );
}
