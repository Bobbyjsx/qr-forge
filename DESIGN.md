# Design System: QR Forge (Vibrant Edition)

## 1. Visual Theme & Atmosphere
A playful, high-energy interface that balances professional utility with a fun, approachable vibe. The atmosphere is light and "bouncy," utilizing a clean white foundation with vibrant orange accents. It uses a repeated dot pattern to add texture and depth without feeling rigid.

## 2. Color Palette & Roles
- **Pure Canvas** (`#FFFFFF`) — Primary background surface.
- **Vibrant Orange** (`#FF5722`) — The soul of the app. Used for primary CTAs, active states, and highlights.
- **Soft Cloud** (`#F8F9FA`) — Secondary surfaces, input backgrounds, and card fills.
- **Deep Slate** (`#1A1A1B`) — Primary text and high-contrast icons.
- **Muted Pebble** (`#9CA3AF`) — Secondary text and decorative elements.
- **Tangerine Mist** (`rgba(255, 87, 34, 0.08)`) — Hover states and subtle backgrounds.

## 3. Typography Rules
- **Display:** `Outfit` (or `Geist Sans` if unavailable) — Bold, rounded, and friendly. Tracking: normal.
- **Body:** `Geist Sans` — Clean and highly readable.
- **Mono:** `JetBrains Mono` — For technical data, ensuring precision is still felt.

## 4. Component Stylings
- **Buttons:** Rounded (`1rem`). Soft-press effect (`scale(0.96)`). Vibrant Orange for primary, white with orange borders for secondary.
- **Cards:** Generously rounded (`1.25rem`). Subtle border (`1px solid #E5E7EB`). No harsh shadows; use light "lift" effects.
- **Inputs:** Rounded corners. Background `#F3F4F6`. Focus ring in Vibrant Orange.
- **Patterns:** A repeated dot grid (`radial-gradient(#E5E7EB 1px, transparent 1px)`) at 24px intervals across the canvas.

## 5. Layout Principles
- **Airy & Open:** Generous white space. No tight grid-locking.
- **Functional Floating:** Panels should feel like they are floating on the dot-grid canvas.
- **Responsive:** Fluid transitions between desktop and mobile.

## 6. Motion & Interaction
- **Bouncy Transitions:** Use `cubic-bezier(0.34, 1.56, 0.64, 1)` for a playful "pop" effect on entry.
- **Hover Delight:** Interactive elements should lift or expand slightly when hovered.
- **Functional Feedback:** Every action (copy, download, forge) must show a clear, animated success state.

## 7. Anti-Patterns (Banned)
- No dark mode by default.
- No rigid 90-degree corners on primary UI.
- No muted, "boring" grays.
- No generic SaaS "linear" look.
