import { getMockForm, getMockSubmissions } from "@/lib/mock/forms";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ArrowLeft, Inbox } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await getMockForm(id);
  return { title: form ? `${form.title} · Submissions — Flowra` : "Not Found" };
}

export default async function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [form, submissions] = await Promise.all([getMockForm(id), getMockSubmissions(id)]);
  if (!form) notFound();

  const headers = form.fields.map(f => f.label);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/forms/${form.id}`}>
            <Button variant="ghost" size="icon_sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">{form.title} — Responses</h1>
            <p className="text-sm text-[var(--muted)]">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <Button variant="secondary" size="sm">Export CSV</Button>
      </div>

      {submissions.length === 0 ? (
        <EmptyState icon={Inbox} title="No submissions yet" description="Once people submit this form, their responses will appear here." />
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-elevated)]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">#</th>
                {headers.map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">{h}</th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {submissions.map((sub, i) => (
                <tr key={sub.id} className="hover:bg-[var(--surface-elevated)] transition-colors">
                  <td className="px-4 py-3 text-[var(--muted)]">{i + 1}</td>
                  {headers.map(h => (
                    <td key={h} className="px-4 py-3 text-[var(--foreground)] max-w-[200px] truncate">{sub.data[h] ?? "—"}</td>
                  ))}
                  <td className="px-4 py-3 text-[var(--muted)] whitespace-nowrap">{new Date(sub.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
