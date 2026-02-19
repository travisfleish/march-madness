# March Madness Moments - ChatGPT Project Context

This document is a complete context guide for AI assistants working on this codebase.
Use it as the primary source of truth for architecture, data flow, behavior, styling, and editing expectations.

## 1) Project Overview

- Project name: `march-madness-moments`
- Type: Single-page React + TypeScript marketing experience
- Build tool: Vite
- Styling: Tailwind CSS + CSS variable token layer
- Primary purpose: Present and explain the "March Madness Moments" campaign with interactive storytelling sections
- Runtime model: Fully client-side (no backend APIs in this repo)

The app emphasizes:
- Scroll-based narrative flow
- Animated visual storytelling
- Interactive fan-data comparison
- Campaign configuration education (moment, audience, creative/channel)

## 2) Tech Stack

From `package.json`:

- React `19`
- React DOM `19`
- React Router DOM `6`
- Framer Motion `12`
- TypeScript `5`
- Vite `5`
- Tailwind CSS `3`
- PostCSS + Autoprefixer

NPM scripts:
- `npm run dev` -> Start Vite dev server
- `npm run build` -> Type-check + production build
- `npm run preview` -> Preview production build

## 3) Routing and App Entry

- Entry: `src/main.tsx`
  - Wraps app in `BrowserRouter`
  - Loads global CSS (`src/index.css`)
- Routes: `src/App.tsx`
  - `/` -> `MarchMadnessMomentsPage`
  - `/march-madness-moments` -> same page
  - `*` -> redirect to `/`

This is a single-page routed app with one primary page component.

## 4) High-Level Page Composition

Primary composition file: `src/pages/MarchMadnessMomentsPage.tsx`

Render order:
1. `HeroSection`
2. Sticky `SectionNav`
3. `FanCloudComparisonSection`
4. Campaign intro text block (inline in page)
5. `ProofBand`
6. `HowItWorksSection`
7. `MomentsSection`
8. `AudiencesSection`
9. `CreativeChannelSection`

Important: there is currently **no CTA section** rendered on this page, even though the content model still contains a `cta` object.

## 5) Single Source of Content Truth

Main content file: `src/content/marchMadnessMoments.ts`

This file defines:
- Type contracts (`MarchMadnessMomentsContent`, `StepCard`, etc.)
- Exported content object `marchMadnessMomentsContent`

Most user-visible copy and list data flows from this object into sections.

### Current Content Shape (top-level keys)

- `hero`
- `fanCloudComparison`
- `campaignIntro`
- `proof`
- `howItWorks`
- `moments`
- `audiences`
- `creativeAndChannel`
- `cta` (present in content model, not rendered in page)

## 6) Section-by-Section Behavior

## Hero (`src/components/sections/HeroSection.tsx`)

- Displays campaign kicker + multi-line title (`titleLines`)
- Shows animated stat tiles and a sidebar stat
- Uses `RollingNumber` when stat value is numeric
- Re-roll animation retriggers on hover
- Uses framer-motion fade-in for load transitions
- Uses branded stripe image background and fan photo asset

Inputs:
- `kicker`
- `titleLines[]`
- `stats[]` (value/label/description/size)
- `sideBarStat`

## Sticky Navigation (`src/components/nav/SectionNav.tsx`)

- Horizontal sticky nav with section pills
- Tracks active section using `IntersectionObserver`
- Scrolls smoothly to target section IDs
- Expected section IDs:
  - `fan-cloud`
  - `proof`
  - `how-it-works`
  - `moments`
  - `audiences`
  - `creative`

If section IDs change, nav behavior will break unless updated.

## Fan Cloud Comparison (`src/components/sections/FanCloudComparisonSection.tsx`)

- Interactive before/after slider comparing two images
- Supports:
  - Pointer drag
  - Keyboard arrows on handle (`role="slider"`)
  - Snap-near positions (0 / 50 / 100)
- Includes helper hint (`Drag to compare`) that auto-fades
- Includes one-time auto "nudge" animation per session (sessionStorage-backed)
- Uses `ResizeObserver` to keep overlay image alignment correct
- Renders metric rail with rolling numeric values when visible

Inputs:
- `headline`
- `leftLabel`, `rightLabel`
- `leftImageSrc`, `rightImageSrc`
- `helperText`
- `metricsEyebrow`
- `metrics[]` (`value`, `label`)

## Proof (`src/components/sections/ProofBand.tsx`)

- Headline body text with highlighted phrases
- Animated two-bar chart showing recall comparison
- Bar growth and value reveal animate when chart enters viewport
- Uses `id="proof"` for nav anchor

Inputs:
- `body`
- `chart` (`title`, `subtitle`, `bars[]`, `footnote`)

## How It Works (`src/components/sections/HowItWorksSection.tsx`)

- Header + explanatory paragraph
- 3 clickable step cards
- Cards deep-link/scroll to section anchors:
  - Step 1 -> `#moments`
  - Step 2 -> `#audiences`
  - Step 3 -> `#creative`

Inputs:
- `header`
- `paragraph`
- `steps[]`

## Moments (`src/components/sections/MomentsSection.tsx`)

- Renders selectable moment pills over image-backed panel
- Opens shared `Modal` on selection
- Modal supports:
  - Prev/Next moment navigation
  - Keyboard ArrowLeft/ArrowRight
  - Close actions
- Moment details source:
  - `momentDetailsByLabel` currently has detailed content for `"BUZZER BEATER WIN"` only
  - Other labels fall back to placeholder trigger/description text

Inputs:
- `header`
- `introParagraph1`
- `introParagraph2`
- `labels[]`

Important implementation note:
- If complete modal detail content is needed for all moments, `momentDetailsByLabel` should be expanded.

## Audiences (`src/components/sections/AudiencesSection.tsx`)

- Two-column list section:
  - Left: popular audiences
  - Right: customization options
- Uses staggered reveal animation
- Uses right-side stripe rail background

Inputs:
- `header`
- optional `subtitle`
- optional `leftHeader`
- `leftList[]`
- `rightHeader`
- `rightList[]`

## Creative & Channel (`src/components/sections/CreativeChannelSection.tsx`)

- Intro copy + advanced visualization component
- Uses section ID `creative` for nav linking

Inputs:
- `header`
- `paragraph`
- `creativeViz` object

## Step 3 Visualization (`src/components/visualizations/Step3CreativeViz.tsx`)

- Responsive branching diagram plus two message cards
- Drawn connector path on desktop; vertical line sequence on mobile
- Typed-text effect for message content while in viewport (disabled for reduced motion)
- Uses `ResizeObserver` to dynamically compute connector geometry

`creativeViz` fields include:
- trigger title + example event
- left/right audience labels
- left/right card titles and copy blocks

## 7) Shared UI and Motion Primitives

## Modal (`src/components/ui/Modal.tsx`)

- Shared dialog component with accessibility behavior:
  - `role="dialog"` + `aria-modal`
  - heading ID generated from title
  - focus trap with Tab/Shift+Tab cycling
  - Escape closes modal
  - click-backdrop closes modal
  - body scroll lock while open
- Animated open/close transitions via Framer Motion

Props:
- `isOpen`
- `title`
- `onClose`
- `children`
- optional `footer`

## Motion Primitives (`src/components/motion/MotionPrimitives.tsx`)

- `Reveal`: reusable in-view fade/translate wrapper
- `Stagger`: reusable staggered container for child animations
- `useReducedMotionSafe`: wraps `useReducedMotion` and returns boolean

These are standard building blocks used throughout sections for consistent animation behavior.

## RollingNumber (`src/components/motion/RollingNumber.tsx`)

- Slot-reel style numeric animation
- Supports initial duration + reroll duration
- Respects reduced-motion preference by rendering static text
- Used in Hero and Fan Cloud metrics

## 8) Styling System

Core files:
- `src/styles/theme.css`
- `src/index.css`
- `tailwind.config.ts`

Pattern:
- `theme.css` declares brand tokens as CSS variables and font faces
- `tailwind.config.ts` maps those variables into Tailwind theme extensions
- `index.css` defines global styles and reusable utility classes:
  - `.section-shell`
  - `.section-title`
  - `.section-copy`
  - stripe utility classes

Design intent:
- Use Tailwind utilities for local layout/styling
- Keep colors/fonts aligned to token variables
- Prefer shared utility classes for section-level consistency

## 9) Static Assets and Public Folder

Key asset patterns:
- Stripe textures in `public/genius-assets/`
- Hero/fan imagery in `public/`
- Brand fonts in `public/fonts/`

Common referenced assets include:
- `/genius-assets/green-lines.png`
- `/genius-assets/blue-lines.png`
- `/fancloud-slider-new.png`
- `/fancloud-left-3x.png`
- `/fans-vertical.png`

Important:
- Components reference these with absolute public paths (`/asset-name.png`)
- Renaming/moving these files requires updating component props/content.

## 10) Accessibility and UX Conventions

- Reduced-motion behavior is supported broadly through `useReducedMotionSafe`
- Modal implements keyboard and focus management
- Slider in Fan Cloud section is keyboard accessible (`role="slider"`)
- Section anchors support smooth scrolling and sticky nav

When adding interactions:
- Preserve keyboard support
- Preserve reduced-motion fallback
- Keep ARIA semantics aligned with current patterns

## 11) Known Constraints / Gotchas

- `cta` exists in content model but is not currently used in `MarchMadnessMomentsPage`
- Moments modal has mostly placeholder details except explicit mapped cases
- Sticky nav depends on stable section IDs; changing IDs requires synchronized updates
- Some visuals depend on viewport observers and resize observers; test responsive behavior after UI edits
- Public asset names are hard-coded in several places

## 12) Safe Edit Strategy for AI Assistants

For copy/content updates:
- Edit `src/content/marchMadnessMoments.ts` first

For layout/section behavior updates:
- Edit only the target section component under `src/components/sections/`

For cross-cutting animation behavior:
- Update `MotionPrimitives.tsx` carefully and verify all sections

For modal behavior:
- Edit `src/components/ui/Modal.tsx` and regression-test both use sites

For token/style updates:
- Start in `src/styles/theme.css` + `tailwind.config.ts`, then adjust consuming classes

## 13) Quick File Map (Important Files)

```text
src/
  main.tsx
  App.tsx
  pages/
    MarchMadnessMomentsPage.tsx
  content/
    marchMadnessMoments.ts
  components/
    nav/
      SectionNav.tsx
    sections/
      HeroSection.tsx
      FanCloudComparisonSection.tsx
      ProofBand.tsx
      HowItWorksSection.tsx
      MomentsSection.tsx
      AudiencesSection.tsx
      CreativeChannelSection.tsx
    visualizations/
      Step3CreativeViz.tsx
    motion/
      MotionPrimitives.tsx
      RollingNumber.tsx
    ui/
      Modal.tsx
      GeniusStripeRail.tsx
  styles/
    theme.css
  index.css
tailwind.config.ts
vite.config.ts
package.json
```

## 14) Local Development and Verification

Typical workflow:
1. `npm install`
2. `npm run dev`
3. Validate key interactions:
   - Sticky nav scrolling + active states
   - Fan Cloud drag + keyboard slider controls
   - Proof chart animation
   - Moments modal open/close + arrow navigation
   - Creative visualization behavior on mobile + desktop
4. `npm run build` before shipping changes

## 15) If ChatGPT Is Asked "Where Should I Change X?"

- Update campaign copy/lists -> `src/content/marchMadnessMoments.ts`
- Change section order/layout -> `src/pages/MarchMadnessMomentsPage.tsx`
- Add/remove nav items -> `src/components/nav/SectionNav.tsx` plus section IDs
- Change modal UX/accessibility -> `src/components/ui/Modal.tsx`
- Change brand tokens/colors/fonts -> `src/styles/theme.css` + `tailwind.config.ts`
- Adjust animation defaults -> `src/components/motion/MotionPrimitives.tsx`

---

This project is presentation-driven and content-centric. Most requests can be solved safely by editing content first, then touching section components only when behavior/layout must change.
