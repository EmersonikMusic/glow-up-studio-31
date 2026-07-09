# About Page: Add Philosophy + FAQ Sections with Anchor Nav

Add two new content sections to the About screen using the copy provided, plus quick-jump pill buttons at the top that smooth-scroll to each section.

## Changes (single file: `src/components/AboutScreen.tsx`)

### 1. Anchor nav row (new)
Placed inside the scrollable body, directly above "Who are we?".

- Two pill buttons: **Question Writing Philosophy** and **FAQ**
- Styling matches existing glass aesthetic: rounded-full, subtle white/8% background, teal-tinted border, `font-subheading` uppercase with small tracking, gold text
- Layout: `flex flex-wrap gap-2` — sits inline on desktop, wraps naturally on mobile
- `onClick` → `ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })` on target section
- `trackClick("about_jump_philosophy")` / `trackClick("about_jump_faq")` for analytics parity with existing calls
- A small top-padding offset on each target section (`scroll-mt-4`) so the heading isn't flush against the scroll container's top edge

### 2. Question Writing Philosophy (new section)
Placed after the "What sets us apart?" block (and its divider), before "How do I contribute?".

- Teal uppercase eyebrow `h2` matching other sections
- Ordered list (1–10) with nested a/b/c and i/ii/iii sub-lists
- Rules 1, 3, 6, 8, 10 have sub-items; others render as plain list entries
- For rule 3 and rule 8's "Bad / Better" examples: **Bad** styled in a muted red-ish tone, **Better** in the existing teal accent (`hsl(185 70% 55%)`) so the contrast reads at a glance
- All ten rules and every sub-bullet from your copy included verbatim, with smart quotes preserved

### 3. Frequently Asked Questions (new section)
Placed after "Question Writing Philosophy", before "How do I contribute?".

- Teal uppercase eyebrow `h2`
- Five Q/A pairs rendered as a `<dl>`-style list:
  - **Q** in gold, bold, `font-heading`
  - **A** in body weight below, indented slightly
- All five entries (Is this AI?, Is this gambling?, Where are you guys from?, How did this project begin?, Where do the questions come from?) included with the full answer text you supplied

### 4. Order of sections after changes
```
Header
├── Anchor nav row (Philosophy • FAQ)
├── Who are we?
├── What sets us apart?
├── Question Writing Philosophy   ← new, scroll target #1
├── Frequently Asked Questions    ← new, scroll target #2
├── How do I contribute?
├── What next?
└── Sign-off
```

## Out of scope
- No routing changes, no other screens touched
- Mobile takeover animation and existing scroll container are unchanged
- No new assets

## Technical notes
- Two `useRef<HTMLDivElement>(null)` refs, one per new section
- Smooth scroll works natively inside the existing `.about-scroll-area` container — no scroll library needed
- Sub-list numbering uses Tailwind `list-decimal` / `list-[lower-alpha]` / `list-[lower-roman]` with `list-inside` and left padding; falls back cleanly on older browsers
