import { getSession } from "@/lib/auth/session";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";

export const metadata = {
  title: "Dashboard — Flowra",
  description: "Manage your business automation with Flowra.",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Session check — bypassed in dev (mock session returns value always)
  await getSession();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6 bg-[var(--background)]">
          {children}
        </main>
      </div>
    </div>
  );
}
