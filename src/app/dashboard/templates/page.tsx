import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { listUserOrganizations } from "@/repositories/organization.repository";
import { AUTOMATION_PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/templates/product-definitions";
import { TemplateCard } from "@/components/templates/template-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap } from "lucide-react";

export const metadata = {
  title: "Automation Products — Flowra",
  description: "Browse ready-to-deploy automation products for your business.",
};

export default async function TemplatesPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const orgs = await listUserOrganizations(session.user.id);
  if (orgs.length === 0) redirect("/dashboard");
  const orgId = orgs[0].id;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-up pb-20">
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-start gap-4">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--brand-light)] border border-[var(--brand-border)]">
          <Zap className="h-6 w-6 text-[var(--brand)]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
            Automation Products
          </h1>
          <p className="text-[var(--muted)] mt-2 text-lg max-w-3xl">
            Ready-to-deploy automations built to solve real business problems. Select a product, connect your accounts, and let Flowra do the heavy lifting.
          </p>
        </div>
      </div>

      {/* ── CATALOG ──────────────────────────────────────────────────────── */}
      <Tabs defaultValue="All" className="w-full">
        <TabsList className="flex flex-wrap h-auto p-1 bg-[var(--surface-elevated)] border border-[var(--border)] gap-1 mb-8 overflow-x-auto justify-start">
          {PRODUCT_CATEGORIES.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="px-4 py-2 text-sm data-[state=active]:bg-[var(--surface)] data-[state=active]:text-[var(--foreground)] data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-[var(--border-strong)] rounded-md transition-all whitespace-nowrap"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {PRODUCT_CATEGORIES.map(category => {
          const categoryProducts = category === "All" 
            ? AUTOMATION_PRODUCTS 
            : AUTOMATION_PRODUCTS.filter(p => p.category === category);
            
          return (
            <TabsContent key={category} value={category} className="mt-0 outline-none">
              {categoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {categoryProducts.map(product => (
                    <TemplateCard key={product.id} product={product} orgId={orgId} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center border border-dashed border-[var(--border-strong)] rounded-2xl bg-[var(--surface-elevated)]">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">No products in this category yet.</h3>
                  <p className="text-[var(--muted)] mt-1">We are constantly adding new automation products.</p>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
