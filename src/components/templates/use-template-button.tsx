"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductImplementationStatus } from "@/lib/templates/product-definitions";

interface UseTemplateButtonProps {
  templateSlug: string;
  status: ProductImplementationStatus;
  orgId: string;
}

export function UseTemplateButton({ templateSlug, status, orgId }: UseTemplateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (status === "COMING_SOON") {
    return (
      <Button variant="outline" className="w-full" disabled>
        Coming Soon
      </Button>
    );
  }

  const handleUseTemplate = async () => {
    try {
      setIsLoading(true);
      
      const res = await fetch(`/api/organizations/${orgId}/workflows/from-template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateSlug }),
      });

      if (!res.ok) {
        throw new Error("Failed to create workflow");
      }

      const { data } = await res.json();
      
      // Redirect to the builder
      router.push(`/dashboard/automations/${data.id}`);
      
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Button 
      className="w-full bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]" 
      onClick={handleUseTemplate}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
      Use Automation <ArrowRight className="h-4 w-4 ml-2" />
    </Button>
  );
}
