import { getMockLeads } from "../../../lib/mock/crm";
import { KanbanBoard } from "../../../components/crm/kanban-board";
import { TrendingUp, DollarSign } from "lucide-react";
import { LeadStatus } from "../../../types/crm";

export const metadata = {
  title: "Leads Pipeline — AURIVO",
  description: "Track and manage your leads pipeline in AURIVO.",
};

export default async function LeadsPage() {
  const leads = await getMockLeads();

  const totalValue = leads.reduce((acc, l) => acc + (l.value ?? 0), 0);
  const wonLeads = leads.filter((l) => l.status === ("WON" as LeadStatus));
  const wonValue = wonLeads.reduce((acc, l) => acc + (l.value ?? 0), 0);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-start justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-brand" />
            <h1 className="text-2xl font-bold text-text-primary">Leads Pipeline</h1>
          </div>
          <p className="text-sm text-text-muted">
            {leads.length} lead{leads.length !== 1 ? "s" : ""} tracked across all stages
          </p>
        </div>

        {/* Summary stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="text-right">
            <p className="text-text-muted text-xs mb-0.5">Total Pipeline</p>
            <div className="flex items-center gap-1 font-semibold text-text-primary">
              <DollarSign className="h-4 w-4 text-brand" />
              {totalValue.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <p className="text-text-muted text-xs mb-0.5">Won</p>
            <div className="flex items-center gap-1 font-semibold text-success">
              <DollarSign className="h-4 w-4" />
              {wonValue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard leads={leads} />
      </div>
    </div>
  );
}
