Scope: Reduce the desktop font size for the three dialog/alert/overlay pop-up headers so the text sits on a single line. Mobile remains stacked (multi-line where needed).

Affected surfaces
- SettingsPanel restart confirm dialog — "Restart with new settings?" AlertDialogTitle
- ResultScreen review dialog — "Review Your Game" DialogTitle
- PauseOverlay — "PAUSED" header

Implementation
- Change each header's responsive class from `text-3xl sm:text-4xl` to `text-3xl sm:text-2xl` (desktop reduced to 24px, mobile stays at 30px and continues to stack for longer text).
- Keep the existing gradient styling, solid gold color, and layout unchanged.
- Leave full-screen overlay headers (About, How to Play, AppErrorBoundary) and the main ResultScreen "Trivia Complete!" header untouched.

Verification
- Trigger each pop-up in the preview and capture desktop and mobile screenshots.
- Confirm the header text is a single line on desktop.
- Confirm mobile still stacks or wraps for the longer "Restart with new settings?" text and that buttons remain in a stacked mobile layout.