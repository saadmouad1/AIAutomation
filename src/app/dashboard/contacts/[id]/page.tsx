import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getMockContact,
  getMockContactLeads,
  getMockContactActivities,
} from "../../../../lib/mock/crm";
import { Activity, Lead, LeadStatus } from "../../../../types/crm";
import { Badge } from "../../../../components/ui/badge";
import { Card } from "../../../../components/ui/card";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  DollarSign,
  StickyNote,
  Mail as MailIcon,
  PhoneCall,
  CalendarDays,
} from "lucide-react";

const ACTIVITY_ICON: Record<string, React.ElementType> = {
  NOTE: StickyNote,
  EMAIL: MailIcon,
  CALL: PhoneCall,
  MEETING: CalendarDays,
};

const STATUS_BADGE: Record<LeadStatus, { label: string; class: string }> = {
  NEW:       { label: "New",       class: "bg-surface-border text-text-muted" },
  CONTACTED: { label: "Contacted", class: "bg-brand/10 text-brand" },
  QUALIFIED: { label: "Qualified", class: "bg-warning-bg text-warning" },
  WON:       { label: "Won",       class: "bg-success-bg text-success" },
  LOST:      { label: "Lost",      class: "bg-error-bg text-error" },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = await getMockContact(id);
  return {
    title: contact ? `${contact.name} — AURIVO` : "Contact Not Found",
  };
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [contact, leads, activities] = await Promise.all([
    getMockContact(id),
    getMockContactLeads(id),
    getMockContactActivities(id),
  ]);

  if (!contact) notFound();

  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Back link */}
      <Link
        href="/dashboard/contacts"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Contacts
      </Link>

      {/* Contact header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand text-xl font-bold border border-brand/20">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{contact.name}</h1>
          {contact.company && (
            <div className="flex items-center gap-1.5 mt-1 text-sm text-text-muted">
              <Building2 className="h-3.5 w-3.5" />
              <span>{contact.company}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Contact info + leads */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Contact details card */}
          <Card className="p-5 bg-surface border-surface-border space-y-4">
            <h2 className="text-sm font-semibold text-text-primary">Contact Details</h2>
            {contact.email && (
              <div className="flex items-center gap-2.5 text-sm text-text-muted">
                <Mail className="h-4 w-4 shrink-0 text-brand/60" />
                <span>{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2.5 text-sm text-text-muted">
                <Phone className="h-4 w-4 shrink-0 text-brand/60" />
                <span>{contact.phone}</span>
              </div>
            )}
            {contact.company && (
              <div className="flex items-center gap-2.5 text-sm text-text-muted">
                <Building2 className="h-4 w-4 shrink-0 text-brand/60" />
                <span>{contact.company}</span>
              </div>
            )}
          </Card>

          {/* Leads */}
          {leads.length > 0 && (
            <Card className="p-5 bg-surface border-surface-border space-y-3">
              <h2 className="text-sm font-semibold text-text-primary">Deals</h2>
              {leads.map((lead: Lead) => {
                const badge = STATUS_BADGE[lead.status as LeadStatus];
                return (
                  <div key={lead.id} className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm text-text-primary">{lead.title}</p>
                      {lead.value != null && (
                        <div className="flex items-center gap-0.5 text-xs text-success mt-0.5">
                          <DollarSign className="h-3 w-3" />
                          {lead.value.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <Badge className={`text-[10px] px-2 py-0.5 rounded-full border-0 shrink-0 ${badge.class}`}>
                      {badge.label}
                    </Badge>
                  </div>
                );
              })}
            </Card>
          )}
        </div>

        {/* Right: Activity feed */}
        <div className="lg:col-span-2">
          <Card className="p-5 bg-surface border-surface-border">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Activity</h2>
            {activities.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">No activity recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {activities.map((act: Activity) => {
                  const Icon = ACTIVITY_ICON[act.type] ?? StickyNote;
                  return (
                    <div key={act.id} className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated border border-surface-border text-text-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary">{act.content}</p>
                        <p className="text-xs text-text-subtle mt-0.5">
                          {act.type.charAt(0) + act.type.slice(1).toLowerCase()} ·{" "}
                          {new Date(act.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
