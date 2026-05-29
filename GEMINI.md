# QR Forge Engineering Standard (GEMINI.md)

This document serves as the definitive engineering manual for the QR Forge project. All future development, refactoring, and AI-assisted edits MUST adhere to these technical and aesthetic protocols.

---

## 🏗️ Core Architecture: The "Forge Pipeline"

All data operations MUST follow this four-tier execution chain:
1.  **UI Component:** Invokes a custom React Query hook.
2.  **Custom Hook (`src/api/use[Domain]/[resource].ts`):** Manages caching and invalidation using `@tanstack/react-query`.
3.  **Server Action (`src/api/actions/[domain].ts`):** Performs the secure `"use server"` execution.
4.  **Logic Engine (`src/lib/core/[manager].ts`):** Pure logic/Supabase interaction.

**Rule:** NEVER use direct `fetch()` to `/api` routes for CRUD operations. API routes are reserved strictly for public resolution (e.g., `/r/[code]`).

---

## 🔄 Case Transformation Protocol

*   **Database:** Strictly `snake_case` (PostgreSQL standard).
*   **Application:** Strictly `camelCase` (TypeScript standard).
*   **Transformation:** Use `src/lib/utils/case-transform.ts`.
    *   All Server Actions MUST return camelCase data using `transformQRRoute` or `toCamelCase`.
    *   All UI components MUST interact with camelCase properties only.
    *   **Prohibited:** `route.short_code`, `route.is_active`.
    *   **Mandatory:** `route.shortCode`, `route.isActive`.

---

## 🛡️ Security & Identity Protocols

1.  **Management Tokens:** All asset management operations (Edit, Update, Delete, Analytics) MUST use the private `managementToken` (UUID). The public `shortCode` is for resolution ONLY.
2.  **Guest Fingerprinting:** Anonymous users are identified via a SHA-256 IP-hash generated in `src/lib/utils/fingerprint.ts`.
3.  **Bypass Mitigation:** Use `createServiceRoleClient()` ONLY as a secure bridge for management-token-based operations where RLS cannot natively verify a UUID against an unauthenticated session.Standard user mutations MUST use the RLS-bound `createClient()`.

---

## 🎨 Aesthetic & UX Standards (Vibrant Forge)

*   **Foundation:** Pure White (#FFFFFF) with a `vibrant-dots` background.
*   **Accents:** Vibrant Orange (#FF5722) for primary actions and highlights.
*   **Motion:** Use `framer-motion` for bouncy transitions (Emil Kowalski style).
*   **Jargon Policy:** Eliminate technical jargon in favor of human-centric language.
    *   NO: "Modification Pipeline", "Resolution Node", "Establishing Termination".
    *   YES: "Edit QR Code", "Link", "Set Expiry Date".

---

## 🛠️ Reusable UI Primitives

Before creating a new UI element, check for these standardized components:
*   **`Button`:** CVA-based with `primary`, `secondary`, `danger`, `cobalt` variants.
*   **`StatBar`:** Precision telemetry progress bars.
*   **`TimePicker`:** Local-to-UTC precision time selection.
*   **`QRCodeForge`:** High-precision SVG/Canvas renderer.
*   **`LoadingState`:** Full-screen high-fidelity loading sequences.

---

## ⚠️ Type Safety & Error Handling

1.  **Zero "any" Policy:** Use the interfaces defined in `src/types/resources.ts`.
2.  **Server Errors:** All catch blocks MUST pass the error through `getServerError(error: unknown)` from `src/lib/supabase/client.ts`.
3.  **Feedback:** Use `toast.success()` and `toast.error()` via **Sonner** for all operation feedback.

---

**System Status: Nominal. The Forge is Protected.**
