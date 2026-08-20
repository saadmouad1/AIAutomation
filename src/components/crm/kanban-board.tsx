"use client";

import * as React from "react";
import { Lead, LeadStatus } from "@/types/crm";
import { MOCK_CONTACTS } from "@/lib/mock/crm";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DollarSign, UserCircle2 } from "lucide-react";

const COLUMNS: { status: LeadStatus; label: string; color: string }[] = [
  { status: "NEW",       label: "New",       color: "bg-surface-elevated border border-surface-border" },
  { status: "CONTACTED", label: "Contacted", color: "bg-surface-elevated border border-surface-border" },
  { status: "QUALIFIED", label: "Qualified", color: "bg-surface-elevated border border-surface-border" },
  { status: "WON",       label: "Won",       color: "bg-success-bg border border-success/20" },
  { status: "LOST",      label: "Lost",      color: "bg-error-bg border border-error/20" },
];

const STATUS_BADGE: Record<LeadStatus, { label: string; class: string }> = {
  NEW:       { label: "New",       class: "bg-surface-border text-text-muted border-surface-border" },
  CONTACTED: { label: "Contacted", class: "bg-brand/10 text-brand border-brand/20" },
  QUALIFIED: { label: "Qualified", class: "bg-warning-bg text-warning border-warning/20" },
  WON:       { label: "Won",       class: "bg-success-bg text-success border-success/20" },
  LOST:      { label: "Lost",      class: "bg-error-bg text-error border-error/20" },
};

function LeadCard({ lead }: { lead: Lead }) {
  const contact = MOCK_CONTACTS.find((c: typeof MOCK_CONTACTS[number]) => c.id === lead.contactId);
  const badge = STATUS_BADGE[lead.status as LeadStatus];

  return (
    <Card className="p-4 bg-surface border-surface-border hover:border-brand/40 transition-all cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm font-medium text-text-primary leading-snug">{lead.title}</p>
        <Badge className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${badge.class}`}>
          {badge.label}
        </Badge>
      </div>
      {contact && (
        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-3">
          <UserCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>{contact.name}</span>
          {contact.company && <span>· {contact.company}</span>}
        </div>
      )}
      {lead.value != null && (
        <div className="flex items-center gap-1 text-xs font-semibold text-success">
          <DollarSign className="h-3.5 w-3.5" />
          <span>{lead.value.toLocaleString()}</span>
        </div>
      )}
    </Card>
  );
}

export function KanbanBoard({ leads }: { leads: Lead[] }) {
  const columnTotals = (status: LeadStatus) =>
    leads.filter(l => l.status === status).reduce((acc, l) => acc + (l.value ?? 0), 0);

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 h-full">
      {COLUMNS.map(col => {
        const colLeads = leads.filter(l => l.status === col.status);
        const total = columnTotals(col.status);

        return (
          <div key={col.status} className="flex flex-col w-72 shrink-0">
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">{col.label}</span>
                <span className="text-xs bg-surface-elevated text-text-muted px-2 py-0.5 rounded-full border border-surface-border">
                  {colLeads.length}
                </span>
              </div>
              {total > 0 && (
                <span className="text-xs text-text-muted">${total.toLocaleString()}</span>
              )}
            </div>
            {/* Column body */}
            <div className={`flex-1 rounded-xl p-3 space-y-3 min-h-[200px] ${col.color}`}>
              {colLeads.map(lead => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
              {colLeads.length === 0 && (
                <div className="flex items-center justify-center h-20 text-xs text-text-subtle">
                  No leads here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
