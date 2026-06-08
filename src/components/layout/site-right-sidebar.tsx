"use client";

import { PopularCommentsWidget } from "@/components/sidebar/popular-comments-widget";
import { PromoBannerCarousel } from "@/components/sidebar/promo-banner-carousel";
import { SuggestedTopicsWidget } from "@/components/sidebar/suggested-topics-widget";
import { useGetMeQuery } from "@/features/auth/api/auth-api";
import { rightSidebarWidthClass } from "@/lib/layout";
import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

export function SiteRightSidebar() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const authUser = useAppSelector((state) => state.auth.user);

  const { data: meData } = useGetMeQuery(undefined, {
    skip: !accessToken,
  });
  const currentUser = meData?.user ?? authUser;

  return (
    <aside
      className={cn(rightSidebarWidthClass, "w-full shrink-0")}
      aria-label="Qo'shimcha ma'lumotlar"
    >
      <div className="space-y-4 lg:pr-2">
        <PopularCommentsWidget currentUserId={currentUser?.id} />
        <SuggestedTopicsWidget />
        <PromoBannerCarousel />
      </div>
    </aside>
  );
}
