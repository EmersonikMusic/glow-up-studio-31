Three targeted fixes in `src/components/AboutScreen.tsx` (+ small CSS helper in `src/index.css`).

## 1. Fix anchor offset when jumping to a section

The anchor nav sits outside `scrollAreaRef`, so subtracting `navHeight` in `scrollTo` under-scrolls by the nav's height and leaves the previous section's tail visible. Remove the `navHeight` term:

```ts
const top =
  target.getBoundingClientRect().top -
  scroller.getBoundingClientRect().top +
  scroller.scrollTop -
  8;
```

Drop `navHeight` from the `useCallback` deps. Scroll-spy `triggerY` is unaffected.

## 2. Replace mobile dropdown with a horizontal scroll strip

Remove `menuOpen` state, the outside-click/Escape effect, the "Jump to…" trigger button and its popover menu.

On mobile, render the same chip list as desktop but in one horizontally-scrollable row so every section is a single-tap target:

- Container: `flex gap-2 overflow-x-auto -mx-6 px-6 about-nav-scroll` (no wrap).
- Each chip: `shrink-0 whitespace-nowrap` with the existing pill styling (teal border + gold text, active = teal fill + teal text + focus ring).
- Store each chip's DOM node in a `chipRefs` map keyed by `SectionKey`.
- `useEffect` on `activeSection` (mobile only) calls `chipRefs.current[activeSection]?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" })` so the active chip stays visible as the page scrolls.

Add to `src/index.css` (near `.about-scroll-area`):

```css
.about-nav-scroll { scrollbar-width: none; }
.about-nav-scroll::-webkit-scrollbar { display: none; }
```

Desktop nav (`flex flex-wrap gap-2`) is untouched.

## 3. Fit "Endless Trivia World!" on one mobile line

In the header `<h1>`:
- Remove the `isMobile ? <br/> : " "` split; always render `Endless Trivia World!` as a single string.
- Change class from `text-4xl sm:text-3xl md:text-4xl … sm:whitespace-nowrap` to `text-2xl sm:text-3xl md:text-4xl … whitespace-nowrap` so the gradient renders across one line at all widths.

## Cleanup

Remove the now-unused `ChevronDown` import from the nav area (still used inside FAQ `<summary>`, so keep the import overall).

## Out of scope

No changes to section content, header/footer chrome, colours, or desktop nav behavior.