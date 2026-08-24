import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Platform Admin — Flowra",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  // Hardcoded super admin check as requested by the user
  if (!session?.user?.email || session.user.email !== "flowra.ai") {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center space-y-4 max-w-sm px-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <ShieldAlert className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Access Denied</h1>
          <p className="text-[var(--muted)] text-sm">You do not have permission to access the platform administration area.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* Very simple top-level admin layout */}
      <div className="w-64 border-r border-[var(--border)] bg-[var(--surface-elevated)] p-4 flex flex-col">
        <div className="mb-8 px-2 flex items-center gap-2 text-red-500">
          <ShieldAlert className="h-5 w-5" />
          <span className="font-bold">Super Admin</span>
        </div>
        
        <nav className="space-y-1">
          <Link href="/admin" className="block px-3 py-2 rounded-md bg-red-500/10 text-red-500 text-sm font-medium">
            Platform Overview
          </Link>
          <Link href="/dashboard" className="block px-3 py-2 rounded-md hover:bg-[var(--surface)] text-[var(--muted)] text-sm font-medium mt-auto">
            Exit to App
          </Link>
        </nav>
      </div>
      
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
