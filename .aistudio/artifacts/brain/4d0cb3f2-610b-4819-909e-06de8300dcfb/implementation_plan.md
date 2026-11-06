# Mobile UI Ergonomics & 2060 Header Modernization Plan

A targeted user interface and mobile responsiveness overhaul addressing the layout cramping, horizontal overflow, and styling inconsistencies identified in the mobile device screenshot.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed during the Phase 1 clarification:
> - **Header Navigation**: Implement a clean, responsive header where primary studio tabs glide in a touch-friendly smooth horizontal scroll strip, while auxiliary utility buttons (Plans, Android APK, PWA Install) collapse into a sleek quick-action drawer on mobile screens.
> - **Mobile Card Density**: Refactor the engine selector cards and parameter controls into a single-column vertical stack with optimized touch padding and 44px+ hitboxes.
> - **2060 Modernization & Anti-Slop**: Remove the legacy "2026 Edition" label and green pulsing dot from the footer, replacing them with a quiet, unboxed 2060 timestamp standard conforming to the universal design constitution.

---

## 1. Overview & Core Concept

### What It Does
Resolves mobile viewport constraints by transforming the header into a responsive two-tier or unified scrollable navigation bar, eliminating horizontal clipping of studio tabs (`Quantum DiT`, `Holo 3D`, `AI Directors`, `Epoch 2060`, `Enterprise`, `Meme 2D`, `Cinema VFX`, `Market`, `LEO 8K`, `YouTube`, `Team`). Adapts the Quantum Engine Hub and form controls into high-legibility single-column stacks on mobile devices ($\le 640\text{px}$) while preserving wide multi-column presence on desktop screens ($\ge 1024\text{px}$).

### Target Audience / Persona
- **Mobile Smartphone Users**: Content creators and studio directors navigating the app on handheld Android and iOS touch screens.
- **Desktop Production Crews**: Users running the 2060 workstation on 1440px+ cinema monitors with full multi-column grid layouts.

### Key Value
- **Zero Horizontal Squeeze**: Full access to all 11 studio tabs via smooth touch scrolling without breaking the header layout.
- **Ergonomic Touch Targets**: All buttons, dropdowns, and sliders meet WCAG and mobile thumb-zone requirements ($\ge 44\text{px}$).
- **Anti-Slop Cleanliness**: Eliminates fake pulsing status dots and updates all legacy 2026 strings to universal 2060 standards.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Mobile Header & Tab Selection**:
   - The user opens the app on a mobile device.
   - The top bar displays `MemeForge 2060` with a clean `2060.01.01` indicator on the left.
   - On the right, action buttons are streamlined: a compact "Plans" badge and an overflow menu trigger `···` or quick actions button that opens the APK/Install/Docs menu.
   - Below or beside the brand wordmark, the studio navigation tabs glide horizontally with active scroll snapping, generous touch padding ($44\text{px}$ tap height), and clear active states.
2. **Quantum DiT Studio Viewport (`QuantumEngineHubTab.tsx`)**:
   - Mobile Viewport: The 4 engine cards stack in a clean, legible single column with compact metric rows.
   - Prompt and parameter controls (Resolution, Temporal Flow, ODE Solver, Duration) stack vertically with native-styled touch dropdowns.
   - "Execute Quantum Neural Synthesis" button spans the full width of the mobile screen for effortless thumb activation.
   - Telemetry card and output preview seamlessly stack without empty blank gap containers.
3. **Footer Cleanliness**:
   - Replaced legacy `● MemeForge AI Studio · 2026 Edition` with clean, unboxed text:
     `MemeForge 2060 Studio · 2060.01.01 Architecture · 64-Bit Resilient`
   - Removed decorative pulsing dot.

### Visual Identity & Theme
- **Color Discipline**: Deep Obsidian (`#080C14`) canvas, subtle slate borders (`border-slate-800`), and Quantum Cyan (`#00F2FE`) accents.
- **Typography**: Tabular monospace numbers for tokens and timestamps, paired with clean geometric sans.
- **Touch Ergonomics**: All interactive click targets $\ge 44 \times 44\text{px}$ with active touch-feedback states (`active:scale-[0.98]`).

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Mobile Header Layering (Two-Row Mobile, Single-Row Desktop)
- **Chosen Approach**: On mobile (`< md`), display Brand and Quick Actions in Row 1, with a dedicated full-width horizontal scrollable tab strip in Row 2. On desktop (`>= md`), unify into a single row.
- **Why**: Prevents the 11 tabs from fighting for space with the logo and 3 action buttons on a 390px mobile screen, completely eliminating clipping.
- **Alternatives Considered**: Hiding tabs in a hamburger menu (rejected because direct 1-tap switching between studio modes is critical for creator workflows).

### Decision 2: Single-Column Vertical Stack for Engine Cards on Mobile
- **Chosen Approach**: Use `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3` with compact row padding on mobile screens.
- **Why**: Allows users to read engine specifications, qubit counts, and descriptions comfortably without horizontal compression.

### Decision 3: Streamlining Utility Actions in Header
- **Chosen Approach**: Keep the essential "Plans" badge compact, and combine "Install App", "Export APK", and "Legal Docs" into a sleek quick-action drawer/dropdown on mobile, while displaying them inline on desktop.
- **Why**: Respects the 15% sticky surface height cap and prevents header buttons from pushing tabs off screen.

---

## 4. Technical Architecture & Component Layout

### Mobile vs Desktop Header Architecture

```
Desktop Layout (>= 1024px):
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [MemeForge 2060] · [Quantum DiT] [Holo 3D] [Directors] ... [Team] · [Plans] [APK]│
└──────────────────────────────────────────────────────────────────────────────────┘

Mobile Responsive Layout (< 768px):
┌──────────────────────────────────────────────────────────────────────────────────┐
│ Row 1: [MemeForge 2060]                              [Plans] [Actions ▾]        │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Row 2: ‹ [Quantum DiT]   [Holo 3D]   [AI Directors]   [Epoch 2060] ... › (Scroll)│
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Components to Update
1. **`src/App.tsx`**:
   - Restructure `<header>` into mobile-adaptive two-row structure (Row 1: Brand & Actions; Row 2: Touch-scrollable tabs strip with `no-scrollbar` and smooth momentum).
   - Add mobile action dropdown modal for secondary utilities (Android APK, PWA Install, Legal Docs).
   - Update footer: remove green pulsing dot, change 2026 string to `MemeForge 2060 Studio · 2060.01.01 Architecture · 64-Bit Resilient`.
2. **`src/components/QuantumEngineHubTab.tsx`**:
   - Update engine card grid to `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` with mobile-optimized spacing.
   - Ensure all form inputs and select elements have minimum height of $44\text{px}$ on touch devices.
   - Refactor banner tokens indicator to stack gracefully beneath title on mobile.
   - Streamline empty preview state so it doesn't take up excessive vertical space.
3. **`src/components/HoloSpatialCanvasTab.tsx` & `src/components/Epoch2060DiagnosticTab.tsx`**:
   - Ensure consistent mobile padding and responsive grid collapses.

---

## 5. Verification Plan

1. **Compilation & Tests**:
   - Run `npm run test` to verify all 84 unit tests pass.
   - Run `compile_applet` and `lint_applet` together to verify clean build with zero TypeScript errors.
2. **Mobile Layout Checks**:
   - Verify mobile viewport behavior at 375px–430px width.
   - Confirm all 11 tabs can be scrolled and tapped with $\ge 44\text{px}$ touch targets.
   - Confirm header actions do not overlap or wrap destructively.
   - Confirm footer displays clean 2060 metadata without pulsing dots.
