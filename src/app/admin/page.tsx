import { Suspense } from "react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Admin panel",
  description: "Maqolas moderatsiya va boshqaruv paneli.",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminPanel />
    </Suspense>
  );
}
