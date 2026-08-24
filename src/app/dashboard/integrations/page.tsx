import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Plug, PhoneCall, MessageSquare, Sparkles, Webhook, ShoppingBag } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Integrations — Flowra",
  description: "Connect Flowra to your favorite tools.",
};

export default async function IntegrationsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  // Read environment variables securely on the server to determine integration status
  const hasTwilio = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_SMS_FROM);
  const hasWhatsApp = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM);
  const hasGroq = !!process.env.GROQ_API_KEY;

  const integrations = [
    {
      id: "twilio",
      name: "Twilio SMS",
      description: "Send and receive SMS messages globally.",
      icon: PhoneCall,
      color: "#F22F46",
      status: hasTwilio ? "connected" : "requires_setup",
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "Automate conversations on the world's most popular messaging app.",
      icon: MessageSquare,
      color: "#25D366",
      status: hasWhatsApp ? "connected" : "requires_setup",
    },
    {
      id: "groq",
      name: "Groq AI",
      description: "Ultra-fast AI models for lead qualification, support, and content generation.",
      icon: Sparkles,
      color: "#F55036",
      status: hasGroq ? "connected" : "requires_setup",
    },
    {
      id: "webhooks",
      name: "Webhooks",
      description: "Connect to any platform that supports outgoing HTTP webhooks.",
      icon: Webhook,
      color: "#635BFF",
      status: "available", // Always available via the built-in HTTP request / webhook triggers
    },
    {
      id: "shopify",
      name: "Shopify",
      description: "Trigger automations on new orders, abandoned carts, and more.",
      icon: ShoppingBag,
      color: "#96BF48",
      status: "coming_soon",
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-up pb-20">
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-start gap-4">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-strong)]">
          <Plug className="h-6 w-6 text-[var(--foreground)]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
            Integrations
          </h1>
          <p className="text-[var(--muted)] mt-1.5 text-lg max-w-2xl">
            Connect Flowra to your favorite tools. Integrations are configured securely at the platform level.
          </p>
        </div>
      </div>

      {/* ── INTEGRATIONS GRID ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(integration => (
          <GlassCard key={integration.id} className="flex flex-col h-full overflow-hidden hover:border-[var(--brand-border)] transition-colors p-6">
            <div className="flex items-start justify-between mb-4">
              <div 
                className="h-12 w-12 rounded-xl flex items-center justify-center border border-[var(--border)] shadow-sm bg-[var(--surface-elevated)]"
              >
                <integration.icon className="h-6 w-6" style={{ color: integration.color }} />
              </div>
              
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border ${
                integration.status === 'connected' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                integration.status === 'available' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                integration.status === 'requires_setup' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]'
              }`}>
                {integration.status.replace("_", " ")}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight mb-2">
              {integration.name}
            </h3>
            <p className="text-sm text-[var(--muted)] mb-6 flex-1">
              {integration.description}
            </p>
            
            <div className="mt-auto">
              {integration.status === "connected" || integration.status === "available" ? (
                <Button variant="outline" className="w-full text-green-500 border-green-500/20 hover:bg-green-500/10 pointer-events-none">
                  Ready to Use
                </Button>
              ) : integration.status === "coming_soon" ? (
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              ) : (
                <Button variant="outline" className="w-full">
                  Configure Settings
                </Button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
