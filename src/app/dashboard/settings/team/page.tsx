import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { TeamPageClient } from "@/components/settings/team-page-client";

export const metadata = {
  title: "Team — Settings | Flowra",
  description: "Manage your organization members and roles",
};

async function getTeamData(userId: string) {
  // Get the user's first organization membership (OWNER or ADMIN required to see full list)
  const membership = await db.organizationMember.findFirst({
    where: { userId },
    include: {
      organization: {
        include: {
          members: {
            include: {
              user: {
                select: { id: true, name: true, email: true, image: true },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return membership;
}

export default async function TeamSettingsPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const membership = await getTeamData(session.user.id);

  if (!membership) {
    // User has no organization — redirect to create one
    redirect("/dashboard");
  }

  return (
    <TeamPageClient
      currentUserId={session.user.id}
      currentUserRole={membership.role}
      organization={membership.organization}
      members={membership.organization.members}
    />
  );
}
