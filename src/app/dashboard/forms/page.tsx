import { getMockForms } from "@/lib/mock/forms";
import { Form, FormStatus } from "@/types/forms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { FileText, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Forms — Flowra" };

const STATUS_MAP: Record<FormStatus, Parameters<typeof Badge>[0]["variant"]> = {
  published: "success",
  draft:     "default",
  archived:  "outline",
};

export default async function FormsPage() {
  const forms = await getMockForms();

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <FileText className="h-5 w-5 text-[var(--brand)]" />
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Forms</h1>
          </div>
          <p className="text-sm text-[var(--muted)]">{forms.length} form{forms.length !== 1 ? "s" : ""} in your workspace</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/forms/new"><Plus className="h-4 w-4" /> New form</Link>
        </Button>
      </div>

      {/* List */}
      {forms.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No forms yet"
          description="Create your first form to start collecting submissions from your audience."
          action={{ label: "Create form", href: "/dashboard/forms/new" }}
        />
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden divide-y divide-[var(--border)]">
          {forms.map((form: Form) => (
            <div key={form.id} className="flex items-center gap-5 px-5 py-4 hover:bg-[var(--surface-elevated)] transition-colors duration-100">
              {/* Icon */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-light)]">
                <FileText className="h-4 w-4 text-[var(--brand)]" />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Link href={`/dashboard/forms/${form.id}`} className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--brand)] transition-colors truncate">
                    {form.title}
                  </Link>
                  <Badge variant={STATUS_MAP[form.status]}>{form.status}</Badge>
                </div>
                <p className="text-xs text-[var(--muted)] truncate">{form.description || "No description"}</p>
              </div>
              {/* Stats */}
              <div className="hidden sm:flex items-center gap-6 text-xs text-[var(--muted)] shrink-0">
                <div className="text-right">
                  <p className="font-semibold text-[var(--foreground)]">{form.submissionCount}</p>
                  <p>submissions</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--foreground)]">{form.fields.length}</p>
                  <p>fields</p>
                </div>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="icon_sm" asChild>
                  <Link href={`/dashboard/forms/${form.id}/submissions`}><ExternalLink className="h-3.5 w-3.5" /></Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/dashboard/forms/${form.id}`}>Edit</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
