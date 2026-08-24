# Split date and time columns for guest plays

Add two extra columns to the guest plays table so the backend table viewer shows the date and the time of day separately instead of one long timestamp.

## What changes

- `anonymous_plays` gets:
  - `played_date` — the calendar date of the completed game (e.g. `2026-08-24`)
  - `played_time` — the time of day of the completed game (e.g. `16:46:02`)
- Both are filled in automatically from the existing completion timestamp. Nothing in the app needs to change, and existing rows get backfilled.
- Sorting/filtering by the date column in the table viewer becomes straightforward (one value per day).

## Timezone

Values are derived in Toronto local time (America/Toronto), so the date matches when players actually played rather than UTC. If you'd rather keep them in UTC, say so and I'll switch it.

## Technical notes

- Timezone conversion is not immutable, so these cannot be `GENERATED ALWAYS` columns. Implementation:
  - Add `played_date date` and `played_time time` columns.
  - A `BEFORE INSERT OR UPDATE` trigger sets them from `completed_at AT TIME ZONE 'America/Toronto'`.
  - One-time `UPDATE` to backfill existing rows.
  - Index on `played_date` for date-range filtering.
- No access-rule changes: the table stays insert-only for guests, so the new columns inherit the current policies.
