import { AUTOMATION_PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/templates/product-definitions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automation Products Catalog — Flowra",
  description: "Browse our catalog of ready-to-use business automation products.",
};

export default function MarketingAutomationsCatalog() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--brand-light),transparent_70%)] opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand-light)] text-[var(--brand)] text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Ready-to-Deploy Automations
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--foreground)] tracking-tight mb-6 max-w-4xl mx-auto">
            Stop building. Start automating.
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] mb-10 max-w-2xl mx-auto">
            Choose from our catalog of pre-built business automations. Connect your accounts and go live in minutes, not weeks.
          </p>
        </div>
      </section>

      {/* ── CATALOG ──────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          {PRODUCT_CATEGORIES.map(category => {
            if (category === "All") return null;
            
            const categoryProducts = AUTOMATION_PRODUCTS.filter(p => p.category === category);
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category} className="space-y-8">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <h2 className="text-2xl font-bold text-[var(--foreground)]">{category}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryProducts.map(product => (
                    <div 
                      key={product.id} 
                      className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] overflow-hidden hover:border-[var(--brand-border)] hover:shadow-xl hover:shadow-[var(--brand-light)] transition-all duration-300"
                    >
                      <div className="p-8 pb-6 relative overflow-hidden">
                        <div 
                          className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[60px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                          style={{ backgroundColor: product.color }}
                        />
                        <div 
                          className="h-14 w-14 rounded-2xl flex items-center justify-center border border-[var(--border)] shadow-sm bg-[var(--surface)] mb-6"
                        >
                          <Zap className="h-7 w-7" style={{ color: product.color }} />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--brand)] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-[var(--muted)] line-clamp-2">
                          {product.shortDescription}
                        </p>
                      </div>
                      
                      <div className="p-8 pt-0 flex-1 flex flex-col justify-between">
                        <ul className="space-y-3 mb-8">
                          {product.requiredIntegrations.slice(0, 2).map(integ => (
                            <li key={integ.id} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                              <CheckCircle2 className="h-4 w-4 text-[var(--brand)]" />
                              Works with {integ.name}
                            </li>
                          ))}
                        </ul>
                        
                        <Button className="w-full group/btn" variant="outline" asChild>
                          <Link href={`/automations/${product.slug}`}>
                            View Product Details
                            <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-32 bg-[var(--surface-elevated)] border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--foreground)]">
            Don&apos;t see what you need?
          </h2>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            Flowra also includes a powerful visual workflow builder. You can customize any product or build your own from scratch.
          </p>
          <div className="pt-4">
            <Button size="lg" asChild className="bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground)]/90 h-14 px-8 text-base">
              <Link href="/register">
                Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
