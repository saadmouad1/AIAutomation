import { AUTOMATION_PRODUCTS, getProductBySlug } from "@/lib/templates/product-definitions";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, CheckCircle2, ChevronRight, Activity, Plug, Clock } from "lucide-react";

export async function generateStaticParams() {
  return AUTOMATION_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} — Flowra Automations`,
    description: product.shortDescription,
  };
}

export default async function AutomationProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      {/* ── BREADCRUMBS & HERO ─────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-24 overflow-hidden border-b border-[var(--border)]">
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundColor: product.color }}
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-12">
            <Link href="/automations" className="hover:text-[var(--foreground)] transition-colors">Automations</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[var(--foreground)]">{product.category}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div 
                className="h-16 w-16 rounded-2xl flex items-center justify-center border border-[var(--border)] shadow-sm bg-[var(--surface)]"
              >
                <Zap className="h-8 w-8" style={{ color: product.color }} />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <p className="text-xl text-[var(--muted)] leading-relaxed">
                {product.shortDescription}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" asChild className="bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] h-14 px-8 text-base shadow-lg shadow-[var(--brand-light)]">
                  <Link href={`/register?product=${product.slug}`}>
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              {/* Abstract Visual Representation of the Workflow */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand)]/10 blur-[100px] rounded-full" />
                
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[var(--brand)]" />
                  How it works
                </h3>
                
                <div className="space-y-4 relative">
                  {/* Visual Timeline Line */}
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[var(--border)]" />
                  
                  {/* Step 1: Trigger */}
                  <div className="relative flex gap-4 items-start z-10">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shadow-sm">
                      <Zap className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="pt-2">
                      <p className="font-semibold text-[var(--foreground)]">{product.triggerType === "WEBHOOK_TRIGGER" ? "When an event occurs" : "On a scheduled interval"}</p>
                      <p className="text-sm text-[var(--muted)]">The automation is triggered automatically.</p>
                    </div>
                  </div>
                  
                  {/* Nodes Simulation */}
                  {product.templateNodes.filter(n => n.type !== "START").map((node, i) => (
                    <div key={node.nodeId} className="relative flex gap-4 items-start z-10">
                      <div className="h-12 w-12 shrink-0 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="h-5 w-5 text-[var(--brand)]" />
                      </div>
                      <div className="pt-2">
                        <p className="font-semibold text-[var(--foreground)]">{String(node.data?.label || node.type)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DETAILS ──────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="md:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">The Problem</h2>
              <p className="text-lg text-[var(--muted)] leading-relaxed">
                {product.problem}
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">The Solution</h2>
              <div className="prose prose-invert prose-lg max-w-none text-[var(--muted)]">
                <p>
                  Deploy this automation product in minutes to resolve the issue permanently. Once activated, Flowra handles the execution, scaling, and error reporting, so your team can focus on what matters most.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-8">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                <Plug className="h-5 w-5" />
                Required Integrations
              </h3>
              <ul className="space-y-4">
                {product.requiredIntegrations.map(integ => (
                  <li key={integ.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-[var(--foreground)]" />
                    </div>
                    <span className="font-medium text-[var(--foreground)]">{integ.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-8">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Setup Time
              </h3>
              <p className="text-[var(--muted)]">
                Typically takes <strong className="text-[var(--foreground)]">less than 5 minutes</strong>. Just authenticate your accounts and map your custom fields.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-32 bg-[var(--brand)] text-white text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Ready to automate your {product.name.toLowerCase()}?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join hundreds of businesses saving hours every week with Flowra.
          </p>
          <div className="pt-6">
            <Button size="lg" asChild className="bg-white text-[var(--brand)] hover:bg-gray-50 h-14 px-8 text-base shadow-xl">
              <Link href={`/register?product=${product.slug}`}>
                Start Automating Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
