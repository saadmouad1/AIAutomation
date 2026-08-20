import { getMockContacts } from "../../../lib/mock/crm";
import { DataTable } from "../../../components/crm/data-table";
import { Users } from "lucide-react";

export const metadata = {
  title: "Contacts — AURIVO",
  description: "Manage your contacts and leads in AURIVO.",
};

export default async function ContactsPage() {
  const contacts = await getMockContacts();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-5 w-5 text-brand" />
            <h1 className="text-2xl font-bold text-text-primary">Contacts</h1>
          </div>
          <p className="text-sm text-text-muted">
            {contacts.length} contact{contacts.length !== 1 ? "s" : ""} in your workspace
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable data={contacts} />
    </div>
  );
}
