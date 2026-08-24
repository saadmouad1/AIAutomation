import { AutomationProduct } from "@/lib/templates/product-definitions";
import { GlassCard } from "@/components/ui/glass-card";
import { Zap, CheckCircle, Clock } from "lucide-react";
import { UseTemplateButton } from "./use-template-button";

export function TemplateCard({ product, orgId }: { product: AutomationProduct; orgId: string }) {
  return (
    <GlassCard className="flex flex-col h-full overflow-hidden hover:border-[var(--brand-border)] transition-colors p-0">
      
      {/* Header Area */}
      <div className="p-6 pb-4 border-b border-[var(--border)] relative overflow-hidden">
        {/* Subtle background glow based on category color */}
        <div 
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 pointer-events-none"
          style={{ backgroundColor: product.color }}
        />
        
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div 
            className="h-12 w-12 rounded-xl flex items-center justify-center border border-[var(--border)] shadow-sm bg-[var(--surface-elevated)]"
          >
            {/* Using a generic icon for now, since dynamic Lucide icon rendering requires an icon map or dynamic imports */}
            <Zap className="h-6 w-6" style={{ color: product.color }} />
          </div>
          
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border ${
            product.implementationStatus === 'IMPLEMENTED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
            product.implementationStatus === 'PARTIAL' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
            'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]'
          }`}>
            {product.implementationStatus === 'IMPLEMENTED' ? 'Live' : product.implementationStatus === 'PARTIAL' ? 'Beta' : 'Coming Soon'}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-[var(--foreground)] tracking-tight leading-tight mb-2 relative z-10">
          {product.name}
        </h3>
        <p className="text-sm text-[var(--muted)] line-clamp-2 relative z-10 min-h-[40px]">
          {product.shortDescription}
        </p>
      </div>

      {/* Content Area */}
      <div className="p-6 pt-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4 mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-[var(--subtle)] tracking-wider">The Problem</span>
            <p className="text-sm text-[var(--foreground)] mt-1">{product.problem}</p>
          </div>
          
          <div>
            <span className="text-[10px] uppercase font-bold text-[var(--subtle)] tracking-wider">Required Integrations</span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {product.requiredIntegrations.map(integ => (
                <span key={integ.id} className="text-xs bg-[var(--surface-elevated)] border border-[var(--border)] px-2 py-1 rounded-md text-[var(--muted)]">
                  {integ.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <UseTemplateButton templateSlug={product.slug} status={product.implementationStatus} orgId={orgId} />
        </div>
      </div>
    </GlassCard>
  );
}
