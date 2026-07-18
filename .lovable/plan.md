## Backend patch for `triviolivia.herokuapp.com/api/questions/`

Goal: make `difficulty=<csv>` honor **every** ID in the list — including a single `0` — so the client can rely on the URL alone and drop the post-fetch filter in `src/lib/triviaApi.ts`.

I don't have the Heroku repo in this project, so I can't read the exact view code. Based on the URL shape (`/api/questions/` with a trailing slash and CSV query params) the API is almost certainly **Django + Django REST Framework**. The patch below is written for that stack. If it's Flask or Express, the same three fixes apply — the shape of the code just changes.

The bug: when the parsed exclude list contains only the value `0`, the filter is being skipped. Cause is almost always a truthy check on `0` or a `filter(Boolean)`-style step that treats `0` as "no value".

## Recommended patch (Option 1 — fix the real bug)

In the questions list view (likely `questions/views.py`, class `QuestionListView` / `QuestionViewSet`, or a `get_queryset` method), find where `request.query_params.get("difficulty")` is parsed.

You'll see something like one of these buggy shapes:

```python
# Shape A — truthy check drops the whole filter when the list is [0]
raw = request.query_params.get("difficulty")
excluded = [int(x) for x in raw.split(",")] if raw else []
if excluded and any(excluded):          # ← BUG: any([0]) is False
    qs = qs.exclude(difficulty_id__in=excluded)

# Shape B — filter(None, ...) or filter(Boolean-ish) drops the 0
excluded = list(filter(None, [int(x) for x in raw.split(",")]))  # ← BUG: drops 0
if excluded:
    qs = qs.exclude(difficulty_id__in=excluded)

# Shape C — int(x) inside a truthy comprehension
excluded = [int(x) for x in raw.split(",") if x and int(x)]      # ← BUG: `int(x)` is 0 → False
```

Replace with:

```python
raw = request.query_params.get("difficulty", "")
excluded_difficulties = [
    int(tok) for tok in raw.split(",")
    if tok.strip().lstrip("-").isdigit()
]
if excluded_difficulties:
    qs = qs.exclude(difficulty_id__in=excluded_difficulties)
```

Key points:

- Parse first, filter by "is this a valid integer token" — never by truthiness of the parsed int.
- Apply `exclude(...)` whenever the list is **non-empty**, regardless of the values inside it.
- Do the same audit on the `category=` and `era=` parsers in the same view — they were probably written from the same template, but only `difficulty` has an ID of `0`, so only `difficulty` shows the bug in production.

## Option 2 (workaround — add a dedicated param)

If touching the shared parser is risky, add a new query param that can't be misinterpreted:

```python
# In the same view, after existing difficulty parsing:
raw_excl = request.query_params.get("difficulty_exclude", "")
extra_excluded = [
    int(tok) for tok in raw_excl.split(",")
    if tok.strip().lstrip("-").isdigit()
]
if extra_excluded:
    qs = qs.exclude(difficulty_id__in=extra_excluded)
```

Client would then send `difficulty_exclude=0` on every non-Kids call, in addition to (or instead of) the existing `difficulty=` CSV.

## Option 3 (workaround — boolean flag)

```python
if request.query_params.get("kids", "").lower() in ("0", "false", "no"):
    qs = qs.exclude(difficulty_id=0)
```

Client sends `kids=false` for every non-Kids game. Simplest to consume, but hides the semantics inside a magic flag.

## Verification (after deploying whichever option)

Re-run these exact probes against the Heroku host. All must pass:

```text
GET /api/questions/?questions=50&difficulty=0
  → 50 rows, zero with difficulty_name == "Kids"

GET /api/questions/?questions=50&difficulty=0,0
  → 50 rows, zero Kids  (idempotent duplicate handling)

GET /api/questions/?questions=50&difficulty=3,4,5,0
  → 50 rows, only Casual + Easy  (regression check — must still work)

GET /api/questions/?questions=50&difficulty=1,2,3,4,5
  → 50 rows, all Kids  (regression check — must still work)
```

Run each probe 3–5 times; the current bug is deterministic, so if any run leaks Kids the fix is incomplete.

## Client cleanup once the backend is fixed

Once the probes above pass in production, one small follow-up in this repo:

- `src/lib/triviaApi.ts` — remove the `filtered = ... .filter((q) => q.difficulty_name !== "Kids")` line inside `fetchAndStartGame`. Leave the URL-level guard (`if (!excludedDiffs.includes(KIDS_DIFFICULTY_ID))`) exactly as-is; it becomes the sole enforcement point, which is what you wanted.
- `.lovable/plan.md` — delete or update; its "root cause" section will no longer describe reality.

No other client changes. Question count will match `numQuestions` exactly, in a single HTTP call, with zero client-side filtering.

## What I need from you to actually write the patch as code

The three options above are as exact as I can be without seeing the Heroku source. To hand you a literal diff instead of a shape, I need one of:

- The Heroku repo URL (or a paste of the questions list view file), **or**
- Confirmation of the stack (Django/DRF vs Flask vs Node/Express) and the file path that handles `/api/questions/`.

Give me either and I'll produce a precise, ready-to-commit patch for that repo in a follow-up plan.
