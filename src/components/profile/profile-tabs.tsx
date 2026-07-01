"use client";

import { useSearchParams } from "next/navigation";
import { AiArticleArchiveList } from "@/components/ai-article/ai-article-archive-list";
import { FollowersList } from "@/components/profile/followers-list";
import { MyArticlesList } from "@/components/profile/my-articles-list";
import { RequestedArticlesList } from "@/components/profile/requested-articles-list";
import { UserArticlesList } from "@/components/profile/user-articles-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ArticleFeedResponse, ArticleSummary } from "@/features/articles/types";

type ProfileTabsProps = {
  username: string;
  displayName?: string;
  isOwnProfile?: boolean;
  initialArticles?: ArticleSummary[];
  initialPagination?: ArticleFeedResponse["pagination"];
};

function resolveDefaultTab(
  tab: string | null,
  isOwnProfile: boolean,
): string {
  if (tab === "followers" || tab === "obunachilar") return "followers";
  if (tab === "requested" || tab === "soralgan") return "requested";
  if (tab === "ai-arxiv" || tab === "arxiv") return "ai-arxiv";
  return isOwnProfile ? "maqolalarim" : "articles";
}

export function ProfileTabs({
  username,
  displayName = "Foydalanuvchi",
  isOwnProfile = false,
  initialArticles,
  initialPagination,
}: ProfileTabsProps) {
  const searchParams = useSearchParams();
  const defaultTab = resolveDefaultTab(searchParams.get("tab"), isOwnProfile);

  return (
    <Tabs key={defaultTab} defaultValue={defaultTab} className="gap-2">
      <div className="-mx-4 overflow-x-auto px-4 scrollbar-hidden touch-pan-x sm:mx-0 sm:overflow-visible sm:px-0">
        <TabsList className="w-max max-w-none flex-nowrap sm:max-w-full sm:w-fit">
          <TabsTrigger value={isOwnProfile ? "maqolalarim" : "articles"}>
            <span className="sm:hidden">
              {isOwnProfile ? "Mening" : "Maqolalar"}
            </span>
            <span className="hidden sm:inline">
              {isOwnProfile ? "Maqolalarim" : "Maqolalar"}
            </span>
          </TabsTrigger>
          <TabsTrigger value="requested">
            <span className="sm:hidden">So&apos;ralgan</span>
            <span className="hidden sm:inline">So&apos;ralgan maqolalar</span>
          </TabsTrigger>
          {isOwnProfile ? (
            <TabsTrigger value="ai-arxiv">
              <span className="sm:hidden">AI</span>
              <span className="hidden sm:inline">AI arxiv</span>
            </TabsTrigger>
          ) : null}
          <TabsTrigger value="followers">
            <span className="sm:hidden">Obuna</span>
            <span className="hidden sm:inline">Obunachilar</span>
          </TabsTrigger>
        </TabsList>
      </div>

      {isOwnProfile ? (
        <TabsContent value="maqolalarim" className="pt-1">
          <MyArticlesList />
        </TabsContent>
      ) : (
        <TabsContent value="articles" className="pt-1">
          <UserArticlesList
            username={username}
            displayName={displayName}
            initialArticles={initialArticles}
            initialPagination={initialPagination}
          />
        </TabsContent>
      )}

      <TabsContent value="requested" className="pt-1">
        <RequestedArticlesList
          authorUsername={username}
          isOwnProfile={isOwnProfile}
        />
      </TabsContent>

      {isOwnProfile ? (
        <TabsContent value="ai-arxiv" className="pt-1">
          <AiArticleArchiveList />
        </TabsContent>
      ) : null}

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
