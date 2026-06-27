import { PinUploadPageClient } from "@/components/pins/pin-upload-page-client";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Rasm yuklash | Maqolas",
  description:
    "Maqolas galereyasiga yangi rasm yuklang. Sarlavha va tavsif qo'shing — SEO uchun optimallashtirilgan vizual kontent yarating.",
  path: "/rasm/yuklash",
  noIndex: true,
});

export default function PinUploadPage() {
  return <PinUploadPageClient />;
}
