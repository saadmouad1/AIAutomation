"use client";

import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreHorizontal, LayoutTemplate, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MOCK_FORMS = [
  { id: 1, name: "Contact Sales", status: "Active", submissions: 124, conversion: "12%", lastEdited: "2 days ago" },
  { id: 2, name: "Newsletter Signup", status: "Active", submissions: 892, conversion: "45%", lastEdited: "1 week ago" },
  { id: 3, name: "Support Ticket", status: "Draft", submissions: 0, conversion: "0%", lastEdited: "4 hours ago" },
];

export default function FormsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[var(--foreground)] mb-1">Forms & Documents</h1>
          <p className="text-[var(--muted)] text-sm">Create beautiful forms to capture data and trigger automations.</p>
        </div>
        <Button className="shadow-[var(--shadow-brand)]">
          <Plus className="h-4 w-4 mr-2" />
          Create Form
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--surface-elevated)] border border-[var(--border-strong)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--muted)] text-sm">Total Submissions</h3>
            <Activity className="h-4 w-4 text-[var(--brand)]" />
          </div>
          <p className="text-3xl font-bold font-heading text-[var(--foreground)]">1,016</p>
          <p className="text-xs text-[var(--success)] mt-2">+14% from last month</p>
        </div>
        {/* Add more stat cards as needed */}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
          <Input placeholder="Search forms..." className="pl-9 bg-[var(--surface-elevated)] border-[var(--border)] focus-visible:border-[var(--brand)]" />
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
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Form Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Submissions</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Conversion</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Last Edited</th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {MOCK_FORMS.map((form, idx) => (
              <motion.tr 
                key={form.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group hover:bg-[var(--surface)] transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[var(--surface)] border border-[var(--border-strong)] flex items-center justify-center text-[var(--muted)] group-hover:border-[var(--brand-border)] group-hover:text-[var(--brand)] transition-colors">
                      <LayoutTemplate className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-[var(--foreground)]">{form.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    form.status === 'Active' ? 'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20' : 
                    'bg-[var(--muted)]/10 text-[var(--muted)] border border-[var(--muted)]/20'
                  }`}>
                    {form.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-[var(--foreground)]">{form.submissions}</td>
                <td className="px-6 py-4 text-sm text-[var(--subtle)]">{form.conversion}</td>
                <td className="px-6 py-4 text-sm text-[var(--subtle)]">{form.lastEdited}</td>
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
