# Multiplayer Rooms: Play the Same Game Together

Two (or more) signed-in players join a room with a short code. The host picks the settings, starts the game, and everyone's screen advances in lockstep through the identical question set. The host scores each player after every reveal.

## Player experience

1. Host taps "Play Together" on the start screen, picks Quick Play / Custom / Kids Mode as usual.
2. A lobby appears with a 5-character code (e.g. `K7QP2`) and the list of joined players.
3. Second player taps "Play Together" > "Join", types the code, appears in the host's lobby instantly.
4. Host taps Start. Questions are fetched once by the host and stored on the room, so both screens show the exact same questions in the same order.
5. Question timer, reveal, and advance are all driven by the host — guests' screens follow automatically. Only the host sees Next/Pause controls.
6. After each reveal, the host sees a row of player names with a check / cross toggle to award the point.
7. Final screen shows a scoreboard ranked by points, plus each player's normal completion stats and badges.

## What's needed

- Sign-in required for all players (already supported: email, Google, Apple).
- Realtime sync so guest screens follow the host without refreshing.
- Reconnect handling: a player who refreshes or backgrounds their phone rejoins at the current question.
- Host leaving ends the room (with a clear message to the others).

## Technical approach

**Database (Lovable Cloud)**

- `game_rooms` — `id`, `code` (unique, 5 chars), `host_id`, `status` (`lobby` | `playing` | `finished`), `settings` jsonb, `questions` jsonb (fetched once at start), `current_index`, `phase` (`question` | `answer`), `phase_started_at`, `is_kids_mode`, timestamps. Codes expire/close after inactivity.
- `game_room_players` — `room_id`, `user_id`, `display_name`, `score`, `is_host`, `joined_at`, unique on (room_id, user_id).
- RLS: members can read their room and its players; only the host can update room state; players insert their own membership row. Explicit GRANTs for `authenticated` and `service_role`. Score updates go through a security-definer function `award_point(room_id, player_id, delta)` that verifies the caller is the room host, so guests can't edit their own score.
- Joining by code uses a security-definer RPC (`join_room(code)`) so players can look up a room they aren't a member of yet without exposing the whole table.

**Realtime**

- Enable Postgres realtime on `game_rooms` and `game_room_players`; guests subscribe to their room row. Host writes `current_index` / `phase` / `phase_started_at`; guests derive their countdown from `phase_started_at` + the room's timer settings, so timers stay aligned without per-second network traffic.

**Frontend**

- New `useGameRoom` hook owning room state, subscription, and host actions.
- Refactor `TriviaGame.tsx` so its question/phase state can be driven either locally (solo, unchanged) or from the room. Solo play keeps its current code path untouched.
- New components: `MultiplayerLobby` (code + player list + start), `JoinRoomDialog`, `HostScoringBar` (per-player check/cross during the reveal), `MultiplayerResults` (scoreboard).
- Start screen gains a "Play Together" entry point next to the existing CTAs, styled to match.
- Existing per-user stats, badges, and conversion events fire for every participant on completion, same as solo.

## Scope notes

- Questions are fetched once by the host from the existing Heroku API and cached on the room row — this is what guarantees an identical set.
- Kids Mode, Custom, and Quick Play all work as room modes.
- Room size: unlimited by default, though the scoring UI is designed for roughly 2-8 players.
- This is a substantial feature; suggested build order is (1) tables + RLS + RPCs, (2) lobby and join flow, (3) synced gameplay, (4) host scoring and scoreboard.
