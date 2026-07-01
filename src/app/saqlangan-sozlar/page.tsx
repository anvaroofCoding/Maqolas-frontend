import type { Metadata } from "next";
import { SavedPhrasesPageClient } from "@/components/saved-phrases/saved-phrases-page-client";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Saqlangan so'zlar",
  description:
    "Maqola o'qish paytida saqlagan ibora va jumlalaringiz ro'yxati.",
  path: "/saqlangan-sozlar",
  noIndex: true,
});

export default function SavedPhrasesPage() {
  return <SavedPhrasesPageClient />;
}
