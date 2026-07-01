import { PinGalleryClient } from "@/components/pins/pin-gallery-client";
import { feedMainClassName } from "@/lib/layout";
import { fetchPinFeed } from "@/lib/pins/server";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";

export const metadata = buildPageMetadata({
  title: "Rasmlar — ilhom va vizual galereya | Maqolas",
  description:
    "Pinterest uslubidagi o'zbekcha rasm galereyasi. Rasmlarni ko'ring, yoqtiring, izoh qoldiring va o'zingizning rasmingizni joylang.",
  path: "/rasmlar",
  keywords: [
    "rasmlar",
    "rasm galereyasi",
    "vizual kontent",
    "ilhom rasmlar",
    "Maqolas rasmlar",
  ],
});

export default async function RasmlarPage() {
  const feed = await fetchPinFeed(1);

  return (
    <main className={cn(feedMainClassName, "sm:pb-10")}>
      <PinGalleryClient
        initialPins={feed?.pins}
        initialPagination={feed?.pagination}
      />
    </main>
  );
}
