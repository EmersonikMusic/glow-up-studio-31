# Update 404 page copy — trivia-themed "Bonus Level"

## Problem
The 404 page uses generic placeholder copy ("Well, this is awkward…", "This page wandered off the trivia trail."). The user wants it reframed as a trivia-style "Bonus Level" prompt while keeping the large gradient "404" treatment and the Back to Game CTA.

## Changes
File: `src/pages/NotFound.tsx` (lines 87–119)

1. **Eyebrow** — change text from `Well, this is awkward…` to `Bonus Level` (same teal uppercase styling).

2. **Body copy** — replace the existing `<h2>` block ("This page wandered off / the trivia trail.") with the trivia question text:
   > Which server-speak status code indicates a client error, a general syntax error, and 'not found' with a three-digit, palindromic number?

   Style it to read as a question prompt — keep the `font-heading` white text but size it down from the current `text-2xl sm:text-3xl` to something readable as body/question copy (e.g. `text-lg sm:text-xl`), centered, with comfortable line wrapping within the existing `max-w-lg` container.

3. **Keep the "404" big gradient number** unchanged (the existing `<h1>` gradient treatment stays as the "answer" to the prompt).

4. **Add a smaller line above the CTA** — directly above the Back to Game button, add:
   > (But seriously, this is a 404 error)

   Render it in small, muted body copy (e.g. `text-sm text-white/70`), no heading semantics.

5. CTA (`Back to Game`) unchanged.

## Resulting order (top → bottom)
1. Mascot (unchanged)
2. Eyebrow: "Bonus Level"
3. Question body copy (new)
4. Big gradient "404" (unchanged)
5. Small muted line: "(But seriously, this is a 404 error)"
6. Back to Game CTA (unchanged)

## Verification
- Visually confirm the new copy reads as a trivia prompt and the 404 number sits between the question and the CTA line.
- Confirm the page still routes to `/` on CTA click and Helmet meta is unchanged.
