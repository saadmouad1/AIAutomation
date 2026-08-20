"use client";

import * as React from "react";
import { Contact } from "@/types/crm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export function DataTable({ data }: { data: Contact[] }) {
  const [search, setSearch] = React.useState("");
  const router = useRouter();

  const filtered = data.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search contacts..."
            className="pl-9 bg-surface border-surface-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button>Add Contact</Button>
      </div>
      <div className="rounded-md border border-surface-border overflow-hidden">
        <Table>
          <TableHeader className="bg-surface-elevated">
            <TableRow className="border-surface-border hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-text-muted">
                  No contacts found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((contact) => (
                <TableRow 
                  key={contact.id} 
                  className="border-surface-border hover:bg-surface-elevated cursor-pointer"
                  onClick={() => router.push(`/dashboard/contacts/${contact.id}`)}
                >
                  <TableCell className="font-medium text-text-primary">{contact.name}</TableCell>
                  <TableCell className="text-text-muted">{contact.email || "-"}</TableCell>
                  <TableCell className="text-text-muted">{contact.company || "-"}</TableCell>
                  <TableCell className="text-text-muted">{contact.phone || "-"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-text-primary" onClick={(e) => { e.stopPropagation(); }}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
