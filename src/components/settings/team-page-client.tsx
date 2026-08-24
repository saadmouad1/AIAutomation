"use client";

import { useState } from "react";
import { Users, Crown, Shield, User, Mail, MoreHorizontal, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Role = "OWNER" | "ADMIN" | "MEMBER";

type MemberUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

type Member = {
  userId: string;
  role: string;
  createdAt: Date;
  user: MemberUser;
};

type Organization = {
  id: string;
  name: string;
  slug: string;
};

interface TeamPageClientProps {
  currentUserId: string;
  currentUserRole: string;
  organization: Organization;
  members: Member[];
}

const ROLE_CONFIG: Record<Role, { label: string; icon: typeof Crown; color: string }> = {
  OWNER: { label: "Owner", icon: Crown, color: "text-amber-500" },
  ADMIN: { label: "Admin", icon: Shield, color: "text-blue-500" },
  MEMBER: { label: "Member", icon: User, color: "text-[var(--muted)]" },
};

function RoleBadge({ role }: { role: string }) {
  const config = ROLE_CONFIG[role as Role] ?? ROLE_CONFIG.MEMBER;
  const Icon = config.icon;
  return (
    <span className={cn("flex items-center gap-1 text-xs font-medium", config.color)}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function MemberAvatar({ user }: { user: MemberUser }) {
  const initials = (user.name ?? user.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="h-9 w-9 rounded-full bg-[var(--brand-light)] border border-[var(--brand)]/20 flex items-center justify-center text-xs font-semibold text-[var(--brand)] flex-shrink-0">
      {initials}
    </div>
  );
}

export function TeamPageClient({
  currentUserId,
  currentUserRole,
  organization,
  members,
}: TeamPageClientProps) {
  const canManage = currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <Users className="h-5 w-5 text-[var(--brand)]" />
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Team</h1>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Manage members of <strong>{organization.name}</strong>
        </p>
      </div>

      {/* Members List */}
      <Card className="divide-y divide-[var(--border)]">
        {/* Header row */}
        <div className="px-5 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            {members.length} member{members.length !== 1 ? "s" : ""}
          </span>
          {canManage && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
              disabled
              title="Email invitations — coming soon"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Invite member
              <span className="ml-1 text-[10px] opacity-60">(coming soon)</span>
            </Button>
          )}
        </div>

        {members.map((member) => {
          const isCurrentUser = member.userId === currentUserId;
          return (
            <div
              key={member.userId}
              className="px-5 py-4 flex items-center gap-4 hover:bg-[var(--surface-hover)] transition-colors"
            >
              <MemberAvatar user={member.user} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">
                    {member.user.name ?? "(No name)"}
                  </p>
                  {isCurrentUser && (
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                      You
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--muted)] mt-0.5">
                  <Mail className="h-3 w-3" />
                  {member.user.email}
                </div>
              </div>
              <RoleBadge role={member.role} />
            </div>
          );
        })}
      </Card>

      {/* Info notice */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm text-[var(--muted)] space-y-1">
        <p className="font-medium text-[var(--foreground)]">Member management</p>
        <p>
          Role changes and email-based invitations will be available in the next release.
          For now, members can be added programmatically via the API.
        </p>
      </div>
    </div>
  );
}
