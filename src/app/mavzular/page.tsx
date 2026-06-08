import { TopicSuggestionsPage } from "@/components/topics/topic-suggestions-page";
import { feedMainClassName } from "@/lib/layout";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Ko'p so'ralgan mavzular",
  description:
    "Qiziq mavzularni taklif qiling yoki mavjudlariga ovoz bering.",
  path: "/mavzular",
});

export default function TopicSuggestionsRoutePage() {
  return (
    <main className={feedMainClassName}>
      <TopicSuggestionsPage />
    </main>
  );
}
