Change the login modal background to the same glass blur style used by the settings panel and About screen.

1. In `src/components/AuthModal.tsx`:
   - Update the inner modal card background from the solid gradient to a semi-transparent glass surface:
     - `background: "rgba(0, 0, 0, 0.25)"`
     - `backdropFilter: "blur(24px)"` and `WebkitBackdropFilter: "blur(24px)"`
     - `border: "1.5px solid rgba(255, 255, 255, 0.18)"`
     - `boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)"`
   - Pass `overlayClassName="bg-[hsl(240_45%_10%_/_0.6)]"` to `DialogContent` so the dialog backdrop is semi-transparent like the settings panel backdrop, letting the glass blur show through.

2. Verify by opening the login modal at desktop and mobile widths and confirming the modal card has the frosted glass appearance matching the settings menu.