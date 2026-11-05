# PayNest — demo web app (frontend only)

Open `index.html` directly, or host the folder on GitHub Pages. No build step, no server.

## Flow
Splash → Login (any 10-digit number starting 6–9) → OTP (any 6 digits) → create PIN → Home.
"Create account" → details → OTP → PIN. On a later visit the app asks for the PIN (any 4 digits in demo mode).
Tapping any transaction opens `status.html`, the payment status and receipt page.

## Layout
- `css/` tokens (colours, fonts), base, components, screens
- `js/core/` config, utils, store (localStorage), api (mock, simulated delay), ui, router
- `js/screens/` one file per screen
- `status.html` payment status page (original single-file build, linked via `?app=1`)

## Demo switches
`js/core/config.js`: `acceptAnyOtp`, `acceptAnyPin`, OTP/PIN length, resend timer.

## Next
Add `manifest.webmanifest`, icons and a service worker for the PWA. Port status.html into modules.
All names and merchants are fictional.
