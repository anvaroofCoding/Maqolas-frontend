import { SiteContainer } from "@/components/layout/site-container";
import { SiteSidebar } from "@/components/layout/site-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SiteContainer>
      <div className="flex min-h-[calc(100vh-3.5rem)] bg-background">
        <SiteSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </SiteContainer>
  );
}
