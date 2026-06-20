import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  fetchPublicProfile,
  fetchPublicProfileArticles,
} from "@/lib/articles/server";
import { buildProfileDescription } from "@/lib/seo/description";
import { buildBreadcrumbJsonLd, buildPersonJsonLd } from "@/lib/seo/json-ld";
import { buildProfileKeywords } from "@/lib/seo/keywords";
import { buildPageMetadata } from "@/lib/seo/metadata";

type ProfileLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
};

export async function generateMetadata({
  params,
}: Pick<ProfileLayoutProps, "params">): Promise<Metadata> {
  const { username } = await params;
  const profile = await fetchPublicProfile(username);

  if (!profile) {
    return buildPageMetadata({
      title: "Profil topilmadi",
      path: `/profil/${username}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: profile.displayName,
    titleFormat: "profile",
    description: buildProfileDescription(
      profile.displayName,
      profile.bio,
      profile.articlesCount,
      profile.followersCount,
      profile.username,
    ),
    path: `/profil/${profile.username}`,
    image: profile.avatarUrl,
    keywords: buildProfileKeywords(
      profile.displayName,
      profile.username,
      profile.bio,
    ),
    authors: [profile.displayName],
  });
}

export default async function PublicProfileLayout({
  children,
  params,
}: ProfileLayoutProps) {
  const { username } = await params;
  const profile = await fetchPublicProfile(username);
  const articles = profile
    ? await fetchPublicProfileArticles(profile.username, 10)
    : [];

  return (
    <>
      {profile ? (
        <>
          <JsonLdScript
            data={buildPersonJsonLd({
              displayName: profile.displayName,
              username: profile.username,
              bio: profile.bio,
              avatarUrl: profile.avatarUrl,
              articlesCount: profile.articlesCount,
              followersCount: profile.followersCount,
              social: profile.social,
              articles: articles.map((article) => ({
                title: article.title,
                slug: article.slug,
              })),
            })}
          />
          <JsonLdScript
            data={buildBreadcrumbJsonLd([
              { name: "Bosh sahifa", path: "/" },
              {
                name: profile.displayName,
                path: `/profil/${profile.username}`,
              },
            ])}
          />
        </>
      ) : null}
      {children}
    </>
  );
}
