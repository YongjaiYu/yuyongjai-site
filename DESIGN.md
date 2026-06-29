# Personal Website Design System

## 1. Atmosphere & Identity

A quiet academic workbench: dark, restrained, and data-forward. The signature is a low-glow cyan accent over slate surfaces, with dense research tools kept legible rather than decorative.

## 2. Color

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | `slate-950` | `#020617` | `#020617` | AES page background |
| Surface/secondary | `slate-900` | `#0f172a` | `#0f172a` | Inputs, tooltip, panels |
| Surface/subtle | `slate-800` | `#1e293b` | `#1e293b` | Control fills, rules |
| Text/primary | `slate-100` | `#f1f5f9` | `#f1f5f9` | Page headings |
| Text/secondary | `slate-300` | `#cbd5e1` | `#cbd5e1` | Active metrics |
| Text/muted | `slate-500` | `#64748b` | `#64748b` | Labels and captions |
| Border/default | `slate-700` | `#334155` | `#334155` | Inputs and tooltips |
| Accent/primary | `cyan-400` | `#22d3ee` | `#22d3ee` | Focus, selected controls |
| Party/Democratic | `blue-500` | `#3b82f6` | `#3b82f6` | Democratic points |
| Party/Republican | `red-500` | `#ef4444` | `#ef4444` | Republican points |

## 3. Typography

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| H1 | 30-36px | 700 | 1.2 | 0 | AES page title |
| H2 | 18-20px | 600 | 1.4 | 0 | Panel headings |
| Body | 14-16px | 400 | 1.6 | 0 | Explanatory copy |
| Caption | 12px | 500 | 1.4 | 0.08em | Uppercase labels |
| Chart label | 10-12px | 400 | 1.3 | 0 | SVG axes and legends |

Primary font follows the existing site sans stack. Chart and control text use the same sans stack for consistency.

## 4. Spacing & Layout

Base unit is 4px. Controls use 4-16px gaps, panels use 24px section spacing, and the AES page is constrained to `max-w-6xl`. Fixed-format charts keep stable SVG viewboxes with horizontal overflow on narrow screens.

## 5. Components

### Analytical Select

- Structure: label above dark select.
- States: default, hover through browser default, cyan focus border.
- Accessibility: visible label, keyboard native select.

### Segmented Control

- Structure: grouped text buttons.
- States: inactive slate, active cyan tint, hover text lift.
- Accessibility: semantic buttons with visible active state.

### Chart Panel

- Structure: heading row, optional controls, SVG or ranked rows.
- States: loading, empty, populated.
- Accessibility: text summaries accompany visual encodings.

## 6. Motion & Interaction

Micro-interactions use 75-150ms color or opacity transitions only. Charts do not animate layout. Hover states expose detail without moving surrounding content.

## 7. Depth & Surface

Depth strategy is borders plus tonal shift. Use slate borders for separation, dark elevated surfaces for tooltips and controls, and avoid decorative shadows except tooltip elevation.
