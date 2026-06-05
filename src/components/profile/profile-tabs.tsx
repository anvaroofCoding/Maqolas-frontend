"use client";

import { useSearchParams } from "next/navigation";
import { FollowersList } from "@/components/profile/followers-list";
import { MyArticlesList } from "@/components/profile/my-articles-list";
import { RequestedArticlesList } from "@/components/profile/requested-articles-list";
import { UserArticlesList } from "@/components/profile/user-articles-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProfileTabsProps = {
  username: string;
  displayName?: string;
  isOwnProfile?: boolean;
};

function resolveDefaultTab(
  tab: string | null,
  isOwnProfile: boolean,
): string {
  if (tab === "followers" || tab === "obunachilar") return "followers";
  if (tab === "requested" || tab === "soralgan") return "requested";
  return isOwnProfile ? "maqolalarim" : "articles";
}

export function ProfileTabs({
  username,
  displayName = "Foydalanuvchi",
  isOwnProfile = false,
}: ProfileTabsProps) {
  const searchParams = useSearchParams();
  const defaultTab = resolveDefaultTab(searchParams.get("tab"), isOwnProfile);

  return (
    <Tabs key={defaultTab} defaultValue={defaultTab} className="gap-2">
      <TabsList>
        <TabsTrigger value={isOwnProfile ? "maqolalarim" : "articles"}>
          {isOwnProfile ? "Maqolalarim" : "Maqolalar"}
        </TabsTrigger>
        <TabsTrigger value="requested">So&apos;ralgan maqolalar</TabsTrigger>
        <TabsTrigger value="followers">Obunachilar</TabsTrigger>
      </TabsList>

      {isOwnProfile ? (
        <TabsContent value="maqolalarim" className="pt-1">
          <MyArticlesList />
        </TabsContent>
      ) : (
        <TabsContent value="articles" className="pt-1">
          <UserArticlesList username={username} displayName={displayName} />
        </TabsContent>
      )}

      <TabsContent value="requested" className="pt-1">
        <RequestedArticlesList
          authorUsername={username}
          isOwnProfile={isOwnProfile}
        />
      </TabsContent>

      <TabsContent value="followers" className="pt-1">
        <FollowersList
          username={username}
          emptyMessage={
            isOwnProfile
              ? "Sizda hozircha obunachilar yo'q."
              : `${displayName}da hozircha obunachilar yo'q.`
          }
        />
      </TabsContent>
    </Tabs>
  );
}
