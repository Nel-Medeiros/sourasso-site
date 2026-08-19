# Instagram Strip — Design Spec

**Date:** 2026-08-19
**Status:** Approved

## Overview

Add a full-width Instagram link strip between the hero banner and the category tabs on the Home page. The strip gives customers a direct tap-to-follow path to Sourasso's Instagram profile, styled to match the brand's color palette.

## Visual Design

- **Style:** Terracotta accent strip (full-width `<a>` element)
- **Background:** `bg-terracotta` (`#9B5E42`)
- **Foreground:** `text-cream` (`#F5EDE3`) for both icon and text
- **Layout:** horizontally centered, flex row, `gap-2`, `py-2.5`
- **Content:** inline Instagram SVG icon + `@sourassopizzaria` text at `text-sm font-medium`
- **Hover:** `hover:opacity-90` — subtle opacity dip, appropriate for a touch-first UI
- **No animation or transition needed**

## Component

**File:** `src/components/InstagramStrip.jsx`

A single default export — a self-contained `<a>` tag with:
- `href="https://www.instagram.com/sourassopizzaria"`
- `target="_blank" rel="noopener noreferrer"` (opens in new tab, safe external link)
- Inline SVG for the Instagram icon (rounded square + inner circle + dot), no external icon library
- The SVG uses `currentColor` so it inherits `text-cream`

## Placement

**File:** `src/pages/Home.jsx`

The strip is inserted immediately after `<HeroBanner />` and before `<CategoryTabs />`, inside the existing `<div id="menu">` wrapper:

```
<HeroBanner />
<div id="menu">
  <InstagramStrip />          ← new
  <CategoryTabs ... />
  ...
</div>
```

## Out of Scope

- No analytics tracking on the link click
- No A/B testing
- No unit test required (it's a static link with no logic)
