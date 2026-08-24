"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = TeamSettingsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const navigation_1 = require("next/navigation");
const session_1 = require("@/lib/auth/session");
const client_1 = require("@/lib/db/client");
const team_page_client_1 = require("@/components/settings/team-page-client");
exports.metadata = {
    title: "Team — Settings | Flowra",
    description: "Manage your organization members and roles",
};
async function getTeamData(userId) {
    // Get the user's first organization membership (OWNER or ADMIN required to see full list)
    const membership = await client_1.db.organizationMember.findFirst({
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
async function TeamSettingsPage() {
    const session = await (0, session_1.getSession)();
    if (!session?.user?.id) {
        (0, navigation_1.redirect)("/login");
    }
    const membership = await getTeamData(session.user.id);
    if (!membership) {
        // User has no organization — redirect to create one
        (0, navigation_1.redirect)("/dashboard");
    }
    return ((0, jsx_runtime_1.jsx)(team_page_client_1.TeamPageClient, { currentUserId: session.user.id, currentUserRole: membership.role, organization: membership.organization, members: membership.organization.members }));
}
