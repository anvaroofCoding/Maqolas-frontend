import { TopicSuggestionsPage } from "@/components/topics/topic-suggestions-page";
import { feedMainClassName } from "@/lib/layout";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Mavzular",
  description:
    "Maqolas platformasidagi mavzular: texnologiya, startaplar, AI, marketing va boshqalar. O'qing yoki o'zingizga mos mavzuda maqolalaringizni yozing.",
  path: "/mavzular",
  keywords: [
    "maqola mavzulari",
    "maqola mavzusi",
    "texnologiya maqolalari",
    "startap maqolalari",
    "maqola",
  ],
});

export default function TopicSuggestionsRoutePage() {
  return (
    <main className={feedMainClassName}>
      <TopicSuggestionsPage />
    </main>
  );
}
