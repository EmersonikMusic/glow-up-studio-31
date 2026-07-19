# Add "Follow Us" section to About screen

Add a new section at the bottom of the About screen (just above the sign-off) with each social platform's actual logo as a clickable link.

## Placement

In `src/components/AboutScreen.tsx`, insert a new `<div>` between the "Question Crafting" section and the divider that precedes the "Go play. Good luck…" sign-off. Section heading styled to match the others (teal, uppercase, tracked):

> FOLLOW US

## Logos

Eight platforms, in this order — each rendered as an `<a target="_blank" rel="noopener noreferrer">` wrapping the platform's actual brand mark:

1. Instagram — https://www.instagram.com/triviolivia/ (lucide `Instagram`)
2. YouTube — https://www.youtube.com/@triviolivia (lucide `Youtube`)
3. TikTok — https://www.tiktok.com/@triviolivia (inline brand SVG)
4. Facebook — https://www.facebook.com/triviolivia (lucide `Facebook`)
5. Threads — https://www.threads.com/@triviolivia (inline brand SVG)
6. Bluesky — https://bsky.app/profile/triviolivia.bsky.social (inline brand SVG)
7. LinkedIn — https://www.linkedin.com/company/triviolivia/ (lucide `Linkedin`)
8. Reddit — https://www.reddit.com/r/triviolivia/ (inline brand SVG)

Lucide provides the correct outlined marks for Instagram, YouTube, Facebook, and LinkedIn. TikTok, Threads, Bluesky, and Reddit aren't in lucide, so I'll inline their official monochrome brand-mark SVGs (single-path, sized to match the lucide 24px icons).

## Styling

- Row of icon pill buttons, wraps on mobile, flex-wrapped gap-2.
- Each pill: 40×40 square, `rounded-full`, glassmorphism to match existing chips — `background: rgba(255,255,255,0.06)`, `border: 1px solid rgba(255,255,255,0.15)`.
- Icon color: `hsl(var(--game-gold))` at rest.
- Hover (pointer only): border becomes teal `hsl(185 70% 55%)`, icon color teal, subtle scale `1.05`. Active `scale-95`. Reuse the same transition timing as the anchor-nav chips.
- Each `<a>` has `aria-label="Follow Triviolivia on {Platform}"` and a `title` for tooltip on desktop.
- Track clicks via existing `trackClick` helper with event name like `about_social_instagram`, etc.

## Technical notes

- No new packages; lucide-react is already used across the app.
- Inline SVGs live directly in the component (small, under ~10 lines each). No new asset files.
- No changes to routing, data, or backend.

## Files changed

- `src/components/AboutScreen.tsx` — add the new section, imports for lucide icons, and inline SVG components for TikTok / Threads / Bluesky / Reddit.
