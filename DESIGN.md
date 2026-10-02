# Design System: Duolingo Style

This document outlines the visual language and components for the `battle-mobile` (Battle Study) project, inspired by Duolingo's gamified and playful UI. 
Whenever you generate or modify UI, strictly adhere to these principles.

## 1. Core Principles
*   **Playful & Gamified:** The UI should feel like a game, not a boring test. Use rounded corners, bold typography, and bright colors.
*   **Tactile (3D) Buttons:** Buttons should feel "pressable." We achieve this using a solid background color and a darker border on the bottom (`border-b-4`).
*   **Clear Contrast:** Use high contrast text (mostly white on colored backgrounds, or dark gray on light backgrounds).
*   **Card-based Layouts:** Wrap content sections in cards with soft borders and drop shadows or slight 3D effects.

## 2. Colors
Use these primary brand colors. In Tailwind v4, these are defined in `globals.css` under `@theme`.

*   **Primary (Green) - Correct / Next / Go:**
    *   Background: `#58CC02` (`bg-duo-green`)
    *   Bottom Border: `#58A700` (`border-duo-green-dark`)
*   **Danger (Red) - Incorrect / Stop:**
    *   Background: `#FF4B4B` (`bg-duo-red`)
    *   Bottom Border: `#EA2B2B` (`border-duo-red-dark`)
*   **Info (Blue) - Secondary Action:**
    *   Background: `#1CB0F6` (`bg-duo-blue`)
    *   Bottom Border: `#1899D6` (`border-duo-blue-dark`)
*   **Warning (Yellow) - Gold / Stars / Premium:**
    *   Background: `#FFC800` (`bg-duo-yellow`)
    *   Bottom Border: `#D7A700` (`border-duo-yellow-dark`)
*   **Neutral (Gray) - Inactive / Secondary / Background:**
    *   Background: `#E5E5E5` (`bg-duo-gray`)
    *   Bottom Border: `#CECECE` (`border-duo-gray-dark`)
    *   Text: `#AFAFAF`
*   **Text Colors:**
    *   Dark: `#4B4B4B` (`text-duo-dark`)
    *   Light: `#FFFFFF` (`text-white`)

## 3. Typography
*   **Font:** Use a rounded, friendly Sans-Serif font (like `Nunito`, `Varela Round`, or `Quicksand`). If unavailable, use system `sans-serif` but with heavy font weights (`font-bold`, `font-extrabold`).
*   **Headings:** Large, bold, and center-aligned when appropriate.

## 4. Components

### 4.1. The "Duo Button"
All primary call-to-action buttons MUST look like this:
```html
<button class="w-full rounded-2xl bg-duo-green border-b-4 border-duo-green-dark px-4 py-3 text-lg font-bold text-white uppercase active:border-b-0 active:translate-y-1 transition-all">
  계속하기
</button>
```
*Modifiers:* Change `bg-duo-green` and `border-duo-green-dark` to the respective blue, red, or gray variants for different states.

### 4.2. Cards
Used for questions, profiles, or options.
```html
<div class="rounded-2xl border-2 border-duo-gray bg-white p-4">
  <!-- Content -->
</div>
```

### 4.3. Progress Bar
```html
<div class="h-4 w-full rounded-full bg-duo-gray overflow-hidden">
  <div class="h-full bg-duo-green rounded-full transition-all duration-300" style="width: 50%"></div>
</div>
```

## 5. Layout & Spacing
*   **Mobile-First:** The layout is constrained to mobile dimensions (e.g. `max-w-md mx-auto`).
*   **Spacing:** Use generous padding (e.g., `p-4`, `p-6`, `gap-4`). Avoid cluttered UI.
*   **Bottom Navigation / Fixed CTA:** Often, the main CTA ("계속하기") is fixed at the bottom of the screen with a white background and top border.
