# FLOWRA Design System
Version: 1.0 | Status: Production

## Overview
Flowra uses a single coherent design language built on CSS Custom Properties (semantic tokens). All components consume tokens — no hardcoded colors.

---

## Color Tokens

| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| `--background` | `#080A0F` | `#F6F7FB` | Page background |
| `--surface` | `#11141B` | `#FFFFFF` | Cards, panels |
| `--surface-elevated` | `#171B24` | `#F9FAFC` | Raised elements |
| `--surface-overlay` | `#1E2330` | `#EFF1F5` | Hover states, overlays |
| `--border` | `rgba(255,255,255,0.07)` | `rgba(0,0,0,0.07)` | Subtle dividers |
| `--border-strong` | `rgba(255,255,255,0.13)` | `rgba(0,0,0,0.13)` | Visible borders |
| `--foreground` | `#F5F7FA` | `#111827` | Primary text |
| `--muted` | `#9299A8` | `#667085` | Secondary text |
| `--subtle` | `#555F72` | `#9CA3AF` | Tertiary / placeholder |

### Brand (Accent — overrideable)
| Token | Default (Purple) | Usage |
|-------|-----------------|-------|
| `--brand` | `#635BFF` | Primary CTA, active state, links |
| `--brand-hover` | `#5148E8` | Hover state for brand elements |
| `--brand-light` | `rgba(99,91,255,0.12)` | Brand tinted backgrounds |
| `--brand-border` | `rgba(99,91,255,0.30)` | Brand tinted borders |

### Semantic
| Token | Value | Usage |
|-------|-------|-------|
| `--success` | `#22C55E` | Positive states |
| `--warning` | `#F59E0B` | Caution states |
| `--error` | `#EF4444` | Destructive/error states |
| `--info` | `#3B82F6` | Informational |

---

## Accent Color Customization

Apply `data-accent` attribute to `<html>`:

```html
<!-- Options: blue | cyan | green | orange | rose | (default: none = purple) -->
<html data-accent="cyan">
```

Overrides `--brand`, `--brand-hover`, `--brand-light`, `--brand-border`.

**Does NOT override semantic colors** (success, warning, error, info).

---

## Theme System

| Class | Appearance |
|-------|------------|
| `.dark` | Dark mode (default for root) |
| `.light` | Light mode |

Managed via `next-themes` with `attribute="class"`. Provider: `src/components/providers/theme-provider.tsx`.

---

## Typography

Font: **Inter** (Google Fonts, loaded via `next/font`)

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| Page title | `text-2xl` (24px) | 700 | H1 headings |
| Section | `text-xl` (20px) | 700 | H2 headings |
| Card title | `text-sm` (14px) | 600 | Card headers |
| Body | `text-sm` (14px) | 400 | General content |
| Caption | `text-xs` (12px) | 400–500 | Labels, metadata |
| Micro | `text-[10px]` | 500–600 | Badges, status |

---

## Spacing & Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `8px` | Buttons (sm), tags, inner elements |
| `--radius-md` | `12px` | Buttons, inputs, chips |
| `--radius-lg` | `16px` | Cards, panels |
| `--radius-xl` | `20px` | Modals, large panels, glass cards |
| `--radius-full` | `9999px` | Pill shapes, avatars |

---

## Shadows

| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.4)` | `0 1px 3px rgba(0,0,0,0.06)` | Buttons, small cards |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.5)` | `0 4px 12px rgba(0,0,0,0.08)` | Dropdown menus |
| `--shadow-lg` | `0 8px 30px rgba(0,0,0,0.6)` | `0 8px 30px rgba(0,0,0,0.10)` | Command palette, modals |
| `--shadow-brand` | `0 0 0 3px rgba(99,91,255,0.25)` | same | Focus rings |
| `--shadow-glass` | complex | complex | Glass surfaces |

---

## Glassmorphism System

Use `.glass` and `.glass-strong` utility classes.

### Hierarchy
```
Page background (--background)
  └─ Large glass surface (.glass)        ← GlassCard, hero panels
       └─ Solid content card (Card)       ← Tables, forms, lists  
            └─ Small glass controls       ← Buttons, inputs (no blur)
```

### Glass properties
```css
/* .glass */
background: rgba(17, 20, 27, 0.72);      /* dark */
border: 1px solid rgba(255,255,255,0.08);
backdrop-filter: blur(16px);
box-shadow: 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);

/* .glass-strong */
background: rgba(23, 27, 36, 0.85);
backdrop-filter: blur(24px);
```

**Rule:** Never use glass for content that needs high readability (tables, form labels). Reserve for hero cards and overlays.

---

## Components

### Button
Variants: `primary` | `secondary` | `ghost` | `danger` | `outline` | `brand_outline`
Sizes: `sm` | `md` | `lg` | `xl` | `icon` | `icon_sm`

### Input / Textarea
- Focus: `--brand` border + `--brand-border` ring (2px)
- Error state: `--error` border

### Card / GlassCard
- `Card`: Solid surface, `--surface` bg
- `GlassCard`: Glass surface with blur

### Badge
Variants: `default` | `brand` | `success` | `warning` | `error` | `info` | `outline`

### StatCard
Dashboard metric card with optional trend indicator.

### StatusIndicator
Dot + label. Statuses: `active` (pulse) | `paused` | `error` | `pending` | `draft`

### EmptyState
Standardized empty state with icon, title, description, and optional CTA.

### CommandMenu (Ctrl+K)
Full-screen command palette. Navigates pages and sets theme.

---

## Navigation

### Sidebar (256px)
- Logo mark + wordmark
- Search trigger (opens CommandMenu)
- Main nav: Overview, Automations, Leads, Forms, Contacts, Tasks, Integrations
- Bottom: Settings, Help
- User profile stub

### TopNav (60px)
- Breadcrumbs (auto-generated from route)
- Notifications icon
- Theme toggle
- User avatar

---

## Workflow Components

### WorkflowStep
Visual card for a single step. Types:
- `trigger` — Brand accent
- `action` — Surface elevated
- `condition` — Warning accent

### WorkflowCanvas
Vertical stack of WorkflowStepCards with arrow connectors.

### AutomationCard
Row-style card for the automations list. Shows name, status, run count, steps.

---

## Animation Principles

| Effect | Duration | Use |
|--------|----------|-----|
| `fade-in` | 200ms | Appear |
| `fade-up` | 250ms | Page/section load |
| `scale-in` | 180ms | Menus, modals |
| `shimmer` | 1.5s infinite | Skeleton loading |

Utility classes: `.animate-fade-in`, `.animate-fade-up`, `.animate-scale-in`, `.skeleton`

Respect `prefers-reduced-motion` — all animations collapse to 0.01ms.

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, stacked nav |
| Tablet | 640–1024px | Collapsed sidebar (future) |
| Desktop | > 1024px | Full sidebar + content |
| Large | > 1280px | Max-width 5xl content |

---

## Accessibility

- All interactive elements have `:focus-visible` with `--brand` outline
- Glass effects never reduce text contrast below WCAG AA
- Semantic HTML5 elements throughout
- `aria-label` on icon-only buttons
- `suppressHydrationWarning` on `<html>` to prevent theme flicker

---

## Brand Language

| Use | Don't use |
|-----|-----------|
| "Create workflow" | "Build AI workflow" |
| "Describe what you need" | "AI-powered..." |
| "Automate" | "Use AI to..." |
| "Smart workflow" | "Artificial intelligence" |
| "Flowra handles it" | "AI agent" |
| "Active" / "Paused" | "Running AI model" |
