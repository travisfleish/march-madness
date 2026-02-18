# March Madness Moments Site

This project is a single-page React + TypeScript marketing site for the "March Madness Moments" campaign. It is built with Vite and styled with Tailwind CSS plus a small theme token layer in CSS variables.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router (`BrowserRouter`)
- Tailwind CSS + custom theme tokens

## What This Site Is

The site presents a linear campaign narrative:

1. Introduce the value proposition (moment-based activation).
2. Reinforce proof/credibility.
3. Explain how activation works.
4. Let users explore March Madness moments.
5. Show audience options.
6. Explain creative/channel customization.
7. End with a conversion CTA.

## High-Level App Structure

Entry and routing flow:

- `src/main.tsx` boots React and wraps the app with `BrowserRouter`.
- `src/App.tsx` defines routes:
  - `/` -> `MarchMadnessMomentsPage`
  - `/march-madness-moments` -> same page
  - fallback (`*`) redirects to `/`
- `src/pages/MarchMadnessMomentsPage.tsx` composes all visible sections in order.

## Page Composition (Section Order)

The page (`MarchMadnessMomentsPage`) renders these section components in sequence:

1. `HeroSection`
2. `ProofBand`
3. `HowItWorksSection`
4. `MomentsSection`
5. `AudiencesSection`
6. `CreativeChannelSection`
7. `CTASection`

All section content is provided from a single content source:

- `src/content/marchMadnessMoments.ts`

This gives the project a content-driven structure where text and list data can be edited centrally without changing component logic.

## Sections and Components

### 1) Hero Section

**File:** `src/components/sections/HeroSection.tsx`

**Purpose:**
- Introduces the campaign with eyebrow text, title, and body copy.
- Displays a branded visual card on the right for design emphasis.

**Props:**
- `eyebrow`
- `optionalTopLine`
- `title`
- `body`

### 2) Proof Band

**File:** `src/components/sections/ProofBand.tsx`

**Purpose:**
- Presents a single high-impact proof statement in a dark band.
- Works as a trust/authority bridge between hero and explainer content.

**Props:**
- `statement`

### 3) How It Works Section

**File:** `src/components/sections/HowItWorksSection.tsx`

**Purpose:**
- Explains the activation process.
- Renders a paragraph plus a grid of step cards.

**Props:**
- `header`
- `paragraph`
- `steps` (`StepCard[]` with `title` and `body`)

### 4) Moments Section

**File:** `src/components/sections/MomentsSection.tsx`

**Purpose:**
- Lists many clickable "moment" labels.
- Opens a modal when a moment is selected.

**Behavior:**
- Maintains `activeMoment` state.
- Uses `useMemo` for static background style.
- Renders reusable `Modal` with selected moment as modal title.
- Displays `modalBullets` inside the modal body.

**Props:**
- `header`
- `labels` (`string[]`)
- `modalBullets` (`string[]`)

### 5) Audiences Section

**File:** `src/components/sections/AudiencesSection.tsx`

**Purpose:**
- Shows audience options as a two-column layout:
  - Left: popular audience list.
  - Right: customization dimensions.

**Props:**
- `header`
- `leftList`
- `rightHeader`
- `rightList`

### 6) Creative & Channel Section

**File:** `src/components/sections/CreativeChannelSection.tsx`

**Purpose:**
- Explains dynamic creative/channel execution capability.
- Lightweight informational block with heading and paragraph.

**Props:**
- `header`
- `paragraph`

### 7) CTA Section

**File:** `src/components/sections/CTASection.tsx`

**Purpose:**
- Primary conversion action at page bottom.
- Opens a modal with request confirmation copy and contact email.

**Behavior:**
- Maintains `isModalOpen` state.
- Uses `Modal` with a custom footer button.

**Props:**
- `primaryButtonText`
- `modalTitle`
- `modalBody`
- `email`
- `closeButtonText`

### Reusable UI: Modal

**File:** `src/components/ui/Modal.tsx`

**Purpose:**
- Shared dialog used by `MomentsSection` and `CTASection`.

**Accessibility + UX details:**
- Focus trapping within dialog (Tab/Shift+Tab cycling).
- Escape key closes dialog.
- Click outside dialog closes it.
- Body scroll lock while open.
- `aria-modal`, `role="dialog"`, and labeled heading id.

**Props:**
- `isOpen`
- `title`
- `onClose`
- `children`
- `footer` (optional)

## Content Architecture

**File:** `src/content/marchMadnessMoments.ts`

This file defines both:

1. Type contracts:
   - `StepCard`
   - `DualListSection`
   - `MomentModalTemplate`
   - `MarchMadnessMomentsContent`
2. The exported content object:
   - `marchMadnessMomentsContent`

All page sections read from this object. If you need to update messaging, labels, CTA copy, or list items, this is the primary file to edit.

## Styling System

Core style files:

- `src/index.css`
- `src/styles/theme.css`
- `tailwind.config.ts`

How styling is organized:

- `theme.css` defines brand tokens (colors, font stacks).
- `index.css` defines global rules and reusable utility classes:
  - `.section-shell`
  - `.section-title`
  - `.section-copy`
- `tailwind.config.ts` maps CSS variables into Tailwind theme extensions.

Result: components can stay clean while still using consistent design tokens.

## Project File Map

```text
March_Madness/
  src/
    main.tsx
    App.tsx
    pages/
      MarchMadnessMomentsPage.tsx
    content/
      marchMadnessMoments.ts
    components/
      sections/
        HeroSection.tsx
        ProofBand.tsx
        HowItWorksSection.tsx
        MomentsSection.tsx
        AudiencesSection.tsx
        CreativeChannelSection.tsx
        CTASection.tsx
      ui/
        Modal.tsx
    styles/
      theme.css
    index.css
  public/
    fonts/
  dist/ (build output)
```

## How To Run

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Maintenance Notes

- For copy/content updates, edit `src/content/marchMadnessMoments.ts`.
- For layout/interaction changes, edit components under `src/components/sections`.
- For modal behavior/accessibility updates, edit `src/components/ui/Modal.tsx`.
- For brand styling/tokens, update `src/styles/theme.css` and `tailwind.config.ts`.
