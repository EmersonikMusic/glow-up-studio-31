## Problem

In Kids Mode, the backend returns category names like `"Food"`, `"Economics"`, and `"Theater"` on question payloads. These aren't canonical `Category` values, so `getMascotForCategory()` computes filenames like `food.svg` / `economics.svg` / `theater.svg`, none of which exist under `src/assets/mascots/`, and falls back to the default mascot.

The excluded-category ID mapping (`CATEGORY_ALIAS_IDS`) already exists, but there's no equivalent mapping for the incoming `category_name` string on each question.

## Fix

Single-file change: `src/lib/triviaApi.ts`.

1. Add a name-level alias map next to `CATEGORY_ALIAS_IDS`:

   ```ts
   const CATEGORY_ALIAS_NAMES: Record<string, Category> = {
     Food: "Food & Drink",
     Economics: "Economy",
     Theater: "Performing Arts",
   };
   ```

2. In `adaptQuestion`, normalize the raw name before it becomes the `Category`:

   ```ts
   const rawName = raw.category_name ?? "Miscellaneous";
   const category = (CATEGORY_ALIAS_NAMES[rawName] ?? rawName) as Category;
   ```

That's the whole change. Downstream mascot lookup and footer label rendering will now receive canonical names and pick the right SVG in Kids Mode and anywhere else these aliases appear.

## Verification

- Playwright probe against Kids Mode: fetch a batch, log the mapped `category` for each question, confirm no non-canonical names remain and that `getMascotForCategory` resolves to a real filename for every one.
- Spot-check in preview: start Kids Mode, cycle through several questions, confirm Food / Economy / Performing Arts questions show their proper mascots.