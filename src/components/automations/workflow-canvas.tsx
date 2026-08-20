import { WorkflowStep } from "@/types/automations";
import { WorkflowStepCard } from "./workflow-step";

export function WorkflowCanvas({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="flex flex-col items-center py-6 px-4">
      {steps.map((step, i) => (
        <WorkflowStepCard key={step.id} step={step} isLast={i === steps.length - 1} />
      ))}
    </div>
  );
}
