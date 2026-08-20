"use client";

import * as React from "react";
import { Form, FormField, FormFieldType } from "@/types/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical, Type, Mail, AlignLeft, List, Hash, Phone, ToggleLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const FIELD_TYPES: { type: FormFieldType; label: string; icon: React.ElementType }[] = [
  { type: "text",     label: "Short text", icon: Type },
  { type: "email",    label: "Email",      icon: Mail },
  { type: "textarea", label: "Long text",  icon: AlignLeft },
  { type: "select",   label: "Dropdown",   icon: List },
  { type: "number",   label: "Number",     icon: Hash },
  { type: "phone",    label: "Phone",      icon: Phone },
  { type: "checkbox", label: "Checkbox",   icon: ToggleLeft },
];

function FieldRow({
  field,
  onRemove,
}: {
  field: FormField;
  onRemove: () => void;
}) {
  const typeInfo = FIELD_TYPES.find(t => t.type === field.type);
  const Icon = typeInfo?.icon ?? Type;
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3 group hover:border-[var(--border-strong)] transition-all">
      <GripVertical className="h-4 w-4 text-[var(--subtle)] cursor-grab" />
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-elevated)]">
        <Icon className="h-3.5 w-3.5 text-[var(--muted)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--foreground)] truncate">{field.label}</p>
        <p className="text-xs text-[var(--muted)]">{typeInfo?.label}{field.required ? " · Required" : ""}</p>
      </div>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-[var(--radius-sm)] text-[var(--muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)]"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface FormBuilderProps {
  initialForm?: Form;
}

export function FormBuilder({ initialForm }: FormBuilderProps) {
  const [title, setTitle] = React.useState(initialForm?.title ?? "Untitled Form");
  const [fields, setFields] = React.useState<FormField[]>(initialForm?.fields ?? []);
  const [addingType, setAddingType] = React.useState(false);

  function addField(type: FormFieldType) {
    const typeInfo = FIELD_TYPES.find(t => t.type === type);
    setFields(f => [...f, {
      id: `f-${Date.now()}`,
      type,
      label: typeInfo?.label ?? "New field",
      required: false,
    }]);
    setAddingType(false);
  }

  function removeField(id: string) {
    setFields(f => f.filter(field => field.id !== id));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Builder canvas */}
      <div className="lg:col-span-3 space-y-4">
        {/* Title */}
        <div className="rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--brand-border)] bg-[var(--brand-light)]/20 p-4">
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-transparent border-none text-lg font-bold text-[var(--foreground)] focus:ring-0 p-0 h-auto"
          />
          <p className="text-xs text-[var(--muted)] mt-1">Click to edit form title</p>
        </div>

        {/* Fields */}
        <div className="space-y-2">
          {fields.map(field => (
            <FieldRow key={field.id} field={field} onRemove={() => removeField(field.id)} />
          ))}
        </div>

        {/* Add field */}
        {!addingType ? (
          <Button variant="outline" className="w-full border-dashed" onClick={() => setAddingType(true)}>
            <Plus className="h-4 w-4" /> Add field
          </Button>
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs font-semibold text-[var(--muted)] mb-3 uppercase tracking-wide">Choose field type</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FIELD_TYPES.map(t => (
                <button
                  key={t.type}
                  onClick={() => addField(t.type)}
                  className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] p-3 text-xs text-[var(--muted)] hover:border-[var(--brand-border)] hover:text-[var(--brand)] hover:bg-[var(--brand-light)] transition-all duration-150"
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => setAddingType(false)}>Cancel</Button>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="lg:col-span-2">
        <div className="sticky top-6 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--foreground)]">Preview</p>
            <Badge variant="outline">Live preview</Badge>
          </div>
          <div className="p-5 space-y-4">
            <h2 className="text-base font-bold text-[var(--foreground)]">{title}</h2>
            {fields.map(field => (
              <div key={field.id}>
                <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                  {field.label}{field.required && <span className="text-[var(--error)] ml-0.5">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <Textarea placeholder={`Enter ${field.label.toLowerCase()}...`} disabled className="text-xs" />
                ) : (
                  <Input type={field.type === "email" ? "email" : "text"} placeholder={`Enter ${field.label.toLowerCase()}...`} disabled className="text-xs h-8" />
                )}
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-xs text-[var(--muted)] text-center py-6">Add fields to see a preview</p>
            )}
            {fields.length > 0 && (
              <Button className="w-full" size="sm" disabled>Submit</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
