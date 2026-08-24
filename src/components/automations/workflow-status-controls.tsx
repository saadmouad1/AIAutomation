"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WorkflowStatusControlsProps {
  orgId: string;
  workflowId: string;
  currentStatus: "DRAFT" | "ACTIVE" | "PAUSED";
}

export function WorkflowStatusControls({ orgId, workflowId, currentStatus }: WorkflowStatusControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const isCurrentlyActive = currentStatus === "ACTIVE";
  const targetStatus = isCurrentlyActive ? "PAUSED" : "ACTIVE";

  const handleConfirm = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/organizations/${orgId}/workflows/${workflowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Failed to update status");
      }

      toast.success(`Workflow is now ${targetStatus.toLowerCase()}`);
      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update workflow status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={() => setIsOpen(true)}
      >
        {isCurrentlyActive ? (
          <><Pause className="h-4 w-4 mr-2" /> Pause</>
        ) : (
          <><Play className="h-4 w-4 mr-2" /> Activate</>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCurrentlyActive ? "Pause Workflow?" : "Activate Workflow?"}
            </DialogTitle>
            <DialogDescription>
              {isCurrentlyActive 
                ? "New trigger executions will be blocked while this workflow is paused." 
                : "This workflow will begin accepting triggers once active."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button 
              variant={isCurrentlyActive ? "danger" : "primary"}
              onClick={handleConfirm} 
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCurrentlyActive ? "Pause Workflow" : "Activate Workflow"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
