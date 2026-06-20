import { PublicProfilePageClient } from "@/components/profile/public-profile-page-client";
import { PublicProfileSeoHeader } from "@/components/profile/public-profile-seo-header";
import { fetchPublicProfile } from "@/lib/articles/server";

type PublicProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  const normalized = username.toLowerCase();
  const profile = await fetchPublicProfile(normalized);

  if (!profile) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
        <p className="text-sm text-muted-foreground">Foydalanuvchi topilmadi.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
      <PublicProfileSeoHeader profile={profile} />
      <PublicProfilePageClient
        username={profile.username}
        displayName={profile.displayName}
      />
    </main>
  );
}
