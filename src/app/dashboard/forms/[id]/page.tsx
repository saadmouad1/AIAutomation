import { getMockForm } from "@/lib/mock/forms";
import { notFound } from "next/navigation";
import { FormBuilder } from "@/components/forms/form-builder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") return { title: "New Form — Flowra" };
  const form = await getMockForm(id);
  return { title: form ? `${form.title} — Flowra` : "Form Not Found" };
}

export default async function FormEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const form = isNew ? null : await getMockForm(id);
  if (!isNew && !form) notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/forms">
            <Button variant="ghost" size="icon_sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">{form?.title ?? "New Form"}</h1>
            {form && (
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={form.status === "published" ? "success" : "default"}>{form.status}</Badge>
                <span className="text-xs text-[var(--muted)]">{form.submissionCount} submissions</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {form && (
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/dashboard/forms/${form.id}/submissions`}><Eye className="h-4 w-4" /> View responses</Link>
            </Button>
          )}
          <Button size="sm">Save & publish</Button>
        </div>
      </div>

      <FormBuilder initialForm={form ?? undefined} />
    </div>
  );
}
