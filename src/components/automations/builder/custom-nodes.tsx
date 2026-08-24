"use client";

import { Handle, Position } from "@xyflow/react";
import { Play, CheckSquare, Terminal, Variable, Type, Split, Globe, Sparkles, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type NodeExecutionStatus = "SUCCESS" | "FAILED" | "RUNNING" | "PENDING";

interface BaseNodeProps {
  data: {
    title?: string;
    description?: string;
    executionStatus?: NodeExecutionStatus;
    executionError?: string;
    [key: string]: any;
  };
  type: string;
  icon: React.ElementType;
  colorClass: string;
  hasSource?: boolean;
  hasTarget?: boolean;
  isCondition?: boolean;
}

function BaseNode({ data, type, icon: Icon, colorClass, hasSource = true, hasTarget = true, isCondition = false }: BaseNodeProps) {
  const status = data.executionStatus;

  return (
    <div className={cn(
      "relative min-w-[260px] rounded-2xl border bg-surface/90 backdrop-blur-xl p-4 shadow-xl transition-all",
      status === "SUCCESS" ? "border-green-500/50 shadow-green-500/10" :
      status === "FAILED" ? "border-red-500/50 shadow-red-500/10" :
      status === "RUNNING" ? "border-blue-500/50 shadow-blue-500/10 animate-pulse" :
      "border-surface-border hover:border-text-muted",
      "group"
    )}>
      {hasTarget && (
        <Handle 
          type="target" 
          position={Position.Top} 
          className="w-3 h-3 bg-text-muted border-2 border-surface" 
        />
      )}
      
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-opacity-20",
          colorClass
        )}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{type}</p>
          <h3 className="text-sm font-semibold text-text-primary truncate">{data.title || type}</h3>
        </div>
        
        {/* Execution Status Icon */}
        {status === "SUCCESS" && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />}
        {status === "FAILED" && <XCircle className="h-5 w-5 text-red-500 shrink-0" />}
        {status === "RUNNING" && <Loader2 className="h-5 w-5 text-blue-500 animate-spin shrink-0" />}
      </div>
      
      {data.description && (
        <p className="mt-2 text-xs text-text-muted line-clamp-2">
          {data.description}
        </p>
      )}

      {/* Logic for standard vs condition handles */}
      {hasSource && !isCondition && (
        <Handle 
          type="source" 
          position={Position.Bottom} 
          className="w-3 h-3 bg-brand border-2 border-surface" 
        />
      )}

      {isCondition && (
        <>
          <Handle 
            type="source" 
            position={Position.Bottom} 
            id="true"
            className="w-3 h-3 bg-green-500 border-2 border-surface -ml-6" 
          />
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 -ml-6 text-[10px] text-green-500 font-medium pointer-events-none">TRUE</div>
          
          <Handle 
            type="source" 
            position={Position.Bottom} 
            id="false"
            className="w-3 h-3 bg-red-500 border-2 border-surface ml-6" 
          />
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 ml-6 text-[10px] text-red-500 font-medium pointer-events-none">FALSE</div>
        </>
      )}
    </div>
  );
}

export function StartNode({ data }: { data: any }) {
  return <BaseNode data={data} type="START" icon={Play} colorClass="bg-emerald-500/20 text-emerald-500 border-emerald-500/30" hasTarget={false} />;
}

export function EndNode({ data }: { data: any }) {
  return <BaseNode data={data} type="END" icon={CheckSquare} colorClass="bg-slate-500/20 text-slate-400 border-slate-500/30" hasSource={false} />;
}

export function LogNode({ data }: { data: any }) {
  return <BaseNode data={data} type="LOG" icon={Terminal} colorClass="bg-zinc-500/20 text-zinc-400 border-zinc-500/30" />;
}

export function SetValueNode({ data }: { data: any }) {
  return <BaseNode data={data} type="SET_VALUE" icon={Variable} colorClass="bg-blue-500/20 text-blue-500 border-blue-500/30" />;
}

export function TransformNode({ data }: { data: any }) {
  return <BaseNode data={data} type="TRANSFORM" icon={Type} colorClass="bg-indigo-500/20 text-indigo-500 border-indigo-500/30" />;
}

export function ConditionNode({ data }: { data: any }) {
  return <BaseNode data={data} type="CONDITION" icon={Split} colorClass="bg-purple-500/20 text-purple-500 border-purple-500/30" isCondition={true} />;
}

export function HttpRequestNode({ data }: { data: any }) {
  return <BaseNode data={data} type="HTTP_REQUEST" icon={Globe} colorClass="bg-cyan-500/20 text-cyan-500 border-cyan-500/30" />;
}

export function AiGenerateNode({ data }: { data: any }) {
  return <BaseNode data={data} type="AI_GENERATE" icon={Sparkles} colorClass="bg-amber-500/20 text-amber-500 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]" />;
}
