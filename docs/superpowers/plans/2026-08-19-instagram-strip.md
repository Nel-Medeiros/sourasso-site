# Instagram Strip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-width terracotta Instagram link strip between the hero banner and the category tabs on the Home page.

**Architecture:** A new `InstagramStrip` component renders a self-contained `<a>` tag with an inline SVG Instagram icon and the handle text. It is imported into `Home.jsx` and placed as the first child of the `<div id="menu">` wrapper, immediately after `<HeroBanner />`.

**Tech Stack:** React, Tailwind CSS, Vitest + Testing Library

---

## File Map

| Action | Path |
|--------|------|
| Create | `src/components/InstagramStrip.jsx` |
| Create | `src/components/__tests__/InstagramStrip.test.jsx` |
| Modify | `src/pages/Home.jsx` |

---

### Task 1: InstagramStrip component + test

**Files:**
- Create: `src/components/__tests__/InstagramStrip.test.jsx`
- Create: `src/components/InstagramStrip.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/InstagramStrip.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import InstagramStrip from '../InstagramStrip'

describe('InstagramStrip', () => {
  it('renders a link to the Instagram profile', () => {
    render(<InstagramStrip />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://www.instagram.com/sourassopizzaria')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('displays the handle text', () => {
    render(<InstagramStrip />)
    expect(screen.getByText('@sourassopizzaria')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/components/__tests__/InstagramStrip.test.jsx
```

Expected: FAIL — `Cannot find module '../InstagramStrip'`

- [ ] **Step 3: Implement the component**

Create `src/components/InstagramStrip.jsx`:

```jsx
export default function InstagramStrip() {
  return (
    <a
      href="https://www.instagram.com/sourassopizzaria"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 py-2.5 bg-terracotta text-cream text-sm font-medium hover:opacity-90 transition-opacity"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 shrink-0"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
      @sourassopizzaria
    </a>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/components/__tests__/InstagramStrip.test.jsx
```

Expected: PASS — 2 tests

- [ ] **Step 5: Commit**

```bash
git add src/components/InstagramStrip.jsx src/components/__tests__/InstagramStrip.test.jsx
git commit -m "feat: add InstagramStrip component"
```

---

### Task 2: Wire InstagramStrip into Home

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Add the import**

In `src/pages/Home.jsx`, add this import after the existing component imports (after the `HeroBanner` import line):

```jsx
import InstagramStrip from '../components/InstagramStrip'
```

- [ ] **Step 2: Insert the strip in JSX**

In `src/pages/Home.jsx`, find the `<div id="menu">` block and insert `<InstagramStrip />` as its first child:

```jsx
      <div id="menu">
        <InstagramStrip />
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
```

- [ ] **Step 3: Run the full test suite**

```bash
npm test -- --run
```

Expected: all unit tests pass (the two pre-existing Playwright suite errors are unrelated and expected)

- [ ] **Step 4: Verify visually**

Open `http://localhost:5175` (or whichever port the dev server is on). Confirm:
- A terracotta strip appears between the hero and the category tabs
- It shows the Instagram icon + `@sourassopizzaria`
- Tapping/clicking opens `https://www.instagram.com/sourassopizzaria` in a new tab

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: wire InstagramStrip into Home page"
```
