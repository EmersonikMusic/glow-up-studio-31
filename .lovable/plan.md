
## Plan: Verify filter exclusion works end-to-end

### Goal
Confirm that when the user toggles OFF a category, difficulty, or era in Settings, the API never returns questions tagged with those values during gameplay.

### How verification will work
This is a **runtime behavior check**, not a code change. I need to drive the live preview and inspect network traffic.

**Steps I'll run (after approval, in default mode):**

1. **Static audit first** (free, no browser):
   - Re-read `SettingsPanel.tsx` to confirm toggling a chip removes its name from `selectedCategories` / `selectedDifficulties` / `selectedEras` and that "Apply" pushes the new state up via `onApply`.
   - Re-read `triviaApi.ts` `buildUrl` to confirm the "narrowed selection" rule: param is sent **only when** `0 < selected.length < ALL_*_COUNT`. Confirm the ID maps cover every label the panel can emit (catch typos like a label "Pre 1500" vs key `"Pre-1500"`).

2. **Live test in browser** (3 scenarios via `browser--navigate_to_sandbox` + `browser--act` + `browser--list_network_requests`):
   - **A. Single category kept**: toggle off all categories except "Science", Apply, Start. Inspect outgoing `GET /api/questions?...` URL → expect `category=18` only. Fetch response, confirm every returned `category_name === "Science"`.
   - **B. Single difficulty kept**: leave categories full, toggle off all difficulties except "Easy", Start. Expect `difficulty=2` only; every response item `difficulty_name === "Easy"`.
   - **C. Era exclusion**: toggle off "2020s" only (keep other 11 eras), Start. Expect `era=1,2,3,4,5,6,7,8,9,10,11` (no `12`). Era isn't returned per question by the API, so this leg can only be verified by URL inspection — I'll call that out in the report.

3. **Edge cases to also confirm**:
   - All toggled OFF → "Apply" disabled OR Start blocked (current code: empty array would send no param, which means "no filter" = unintended. Worth flagging.)
   - All toggled ON → no `category`/`difficulty`/`era` param sent (default behavior).

4. **CORS caveat**: Last session showed `TypeError: Failed to fetch` from missing `Access-Control-Allow-Origin`. If CORS is still blocking, the browser test will surface the error toast and I won't be able to inspect response bodies — only the request URL. I'll report exactly that and the URL-level verification will still tell us whether the filter logic is correct on the client side.

### Deliverable
A short report covering, per scenario:
- Outgoing URL (proves client filter logic),
- Sample of returned `category_name` / `difficulty_name` values (proves backend honors filter),
- Any mismatch or bug found.

If a bug surfaces (e.g. an "all off" foot-gun, or a label/ID mismatch), I'll list the fix and ask whether to apply it.

### Out of scope
- No code changes in this pass unless verification finds a defect.
- Era response-body verification (API doesn't return era).
