# QR Forge Project Standards (GEMINI.md)

This file explains how to build and update the QR Forge app. Every change must follow these simple rules.

---

## 🏗️ Core Way of Working

All data must move in this order:
1.  **UI Component:** Uses a custom hook.
2.  **Custom Hook (`src/api/use[Domain]/[resource].ts`):** Uses React Query for caching.
3.  **Server Action (`src/api/actions/[domain].ts`):** Securely talks to the database.
4.  **Logic Engine (`src/lib/core/[manager].ts`):** Pure logic and Supabase code.

**Rule:** DO NOT use `fetch()` to `/api` routes to create, read, update, or delete data. Those routes are only for the QR codes to redirect people.

---

## 🔄 Name Conversions

*   **Database:** Use `snake_case` (like `short_code`).
*   **App/Frontend:** Use `camelCase` (like `shortCode`).
*   **How to convert:** Use the tool in `src/lib/utils/case-transform.ts`.
    *   All Server Actions must return `camelCase`.
    *   The UI must only use `camelCase`.

---

## 🛡️ Security

1.  **Secret Tokens:** To edit or delete a QR code, you must use its private `managementToken`. Never use the public `shortCode` for changes.
2.  **Guest Tracking:** Guest users are identified by a secure hash of their IP address.
3.  **Permissions:** If a user is logged in, use their normal account. If it's a guest, use the private token to check if they are allowed to make changes.

---

## 🎨 Design Rules

*   **Look:** Clean white background with a dot pattern.
*   **Colors:** Use **Vibrant Orange (#FF5722)** for buttons and important stuff.
*   **Feeling:** High-energy and "bouncy" animations.
*   **Language:** Use simple, normal words.
    *   NO: "Modification Pipeline", "Resolution Node", "Establishing Termination".
    *   YES: "Edit QR Code", "Link", "Set Expiry Date".

---

## 🛠️ Reusable Parts

Look for these in `src/components/ui` before making something new:
*   **`Button`:** The standard button with orange and white styles.
*   **`StatBar`:** The progress bar for scan numbers.
*   **`TimePicker`:** The clock selector for expiry dates.
*   **`QRCodeForge`:** The actual QR code renderer.
*   **`LoadingState`:** The "bouncy" loading screen.

---

## ⚠️ Code Quality

1.  **No "any":** Always use proper TypeScript types.
2.  **Error Messages:** Use `getServerError` from `src/lib/supabase/client.ts` to show errors to users.
3.  **Popups:** Use **Sonner** toasts (`toast.success` or `toast.error`) instead of alerts.

---

**Status: App is working and clean.**
