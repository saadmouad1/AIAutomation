"use client";

import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MOCK_CONTACTS = [
  { id: 1, name: "Sarah Jenkins", company: "TechFlow Inc.", email: "sarah@techflow.com", status: "Active", lastContact: "2 hours ago" },
  { id: 2, name: "Michael Chen", company: "Global Systems", email: "m.chen@globalsys.net", status: "Lead", lastContact: "1 day ago" },
  { id: 3, name: "Emma Watson", company: "Design Studio", email: "emma@designstudio.co", status: "Inactive", lastContact: "1 week ago" },
  { id: 4, name: "David Miller", company: "Nexus Corp", email: "david.m@nexus.com", status: "Active", lastContact: "3 hours ago" },
];

export default function ContactsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[var(--foreground)] mb-1">Contacts</h1>
          <p className="text-[var(--muted)] text-sm">Manage your leads, customers, and partners.</p>
        </div>
        <Button className="shadow-[var(--shadow-brand)]">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
          <Input placeholder="Search contacts..." className="pl-9 bg-[var(--surface-elevated)] border-[var(--border)] focus-visible:border-[var(--brand)]" />
        </div>
        <Button variant="secondary" className="border-[var(--border-strong)] bg-[var(--surface-elevated)]">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="bg-[var(--surface-elevated)] border border-[var(--border-strong)] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-strong)] bg-[var(--surface)]/50">
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Last Contact</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {MOCK_CONTACTS.map((contact, idx) => (
              <motion.tr 
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group hover:bg-[var(--surface)] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[var(--brand-light)] flex items-center justify-center text-[var(--brand)] font-bold text-sm">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-[var(--foreground)]">{contact.name}</div>
                      <div className="text-xs text-[var(--muted)] flex items-center gap-1 mt-0.5"><Mail className="h-3 w-3" /> {contact.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-[var(--subtle)]">
                    <Building className="h-3.5 w-3.5" /> {contact.company}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    contact.status === 'Active' ? 'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20' : 
                    contact.status === 'Lead' ? 'bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20' : 
                    'bg-[var(--muted)]/10 text-[var(--muted)] border border-[var(--muted)]/20'
                  }`}>
                    {contact.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--subtle)]">{contact.lastContact}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[var(--muted)] hover:text-[var(--foreground)]">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
