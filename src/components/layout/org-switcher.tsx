"use client";

import * as React from "react";
import { ChevronsUpDown, Check, PlusCircle, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

// Mock data until we wire up SWR/React Query
const organizations = [
  { id: "1", name: "Acme Corp", slug: "acme" },
];

export function OrgSwitcher() {
  const [activeOrg, setActiveOrg] = React.useState(organizations[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={false}
          className="w-[200px] justify-between border-surface-border bg-surface hover:bg-surface-elevated hover:text-text-primary"
        >
          <div className="flex items-center gap-2 truncate">
            <Building2 className="h-4 w-4 shrink-0 text-text-muted" />
            <span className="truncate">{activeOrg?.name || "Select Org"}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] p-0" align="start">
        <DropdownMenuLabel className="text-xs text-text-muted font-normal uppercase tracking-wider px-3 py-2">
          Organizations
        </DropdownMenuLabel>
        <div className="max-h-[300px] overflow-y-auto p-1">
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => setActiveOrg(org)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="truncate">{org.name}</span>
              {activeOrg?.id === org.id && (
                <Check className="h-4 w-4 text-brand" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="p-1">
          <DropdownMenuItem className="cursor-pointer text-brand focus:text-brand focus:bg-brand/10">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Organization
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
