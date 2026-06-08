import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { fetchPublicProfile } from "@/lib/articles/server";
import { buildProfileDescription } from "@/lib/seo/description";
import { buildPersonJsonLd } from "@/lib/seo/json-ld";
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
    ),
    path: `/profil/${profile.username}`,
    image: profile.avatarUrl,
    keywords: [
      profile.displayName,
      `${profile.displayName} maqolalari`,
      "muallif",
      "maqola",
      "maqolalar",
    ],
  });
}

export default async function PublicProfileLayout({
  children,
  params,
}: ProfileLayoutProps) {
  const { username } = await params;
  const profile = await fetchPublicProfile(username);

  return (
    <>
      {profile ? (
        <JsonLdScript
          data={buildPersonJsonLd({
            displayName: profile.displayName,
            username: profile.username,
            bio: profile.bio,
            avatarUrl: profile.avatarUrl,
            articlesCount: profile.articlesCount,
          })}
        />
      ) : null}
      {children}
    </>
  );
}
