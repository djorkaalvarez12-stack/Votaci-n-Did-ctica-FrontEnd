# Design System Document: The Playful Strategist

## 1. Overview & Creative North Star
**Creative North Star: "The Tactile Lounge"**
This design system moves away from the aggressive, dark aesthetics typical of poker apps and instead embraces the social, inviting atmosphere of a high-end friendly game. We are building a "Digital Lounge"—a space that feels premium yet approachable, sophisticated yet soft.

To break the "standard template" look, this system utilizes **Organic Layering**. Instead of rigid boxes, we use oversized radii and shifting tonal planes to create a UI that feels like it was molded, not coded. We prioritize intentional asymmetry in layouts—using large `display-lg` type to anchor the eye while secondary elements float in spacious, breathable containers.

---

## 2. Colors & The Surface Philosophy
The palette is a curated harmony of "Vegas Green" and "Poolside Blue," grounded by warm, earthen accents.

### The "No-Line" Rule
**Strict Mandate:** Traditional 1px solid borders are prohibited for sectioning. 
Boundaries must be defined through **Background Color Shifts**. For example:
- A card (`surface-container-lowest`) should sit atop a section (`surface-container-low`), which in turn sits on the global `background`. 
- Contrast is achieved through the luminosity of the tokens, not through strokes.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, physical layers of fine cardstock.
- **Level 0 (Base):** `surface` (#ddffe2) – The foundation.
- **Level 1 (Sectioning):** `surface-container-low` (#cafdd4) – Used for broad content groupings.
- **Level 2 (Interaction):** `surface-container` (#bef5c9) – The default for interactive zones.
- **Level 3 (Prominence):** `surface-container-highest` (#acecbb) – Reserved for the most important active components.

### The "Glass & Gradient" Rule
To add "soul" to the poker theme, use subtle linear gradients for primary actions. Transition from `primary` (#006941) to `primary-container` (#7bfeb8) at a 135° angle. For floating overlays, apply a **Backdrop Blur (20px)** to a semi-transparent `surface` color to create a "Frosted Acrylic" effect, ensuring the vibrant greens bleed through softly.

---

## 3. Typography
We utilize a high-contrast pairing: **Plus Jakarta Sans** for character and **Manrope** for utility.

*   **Display & Headlines (Plus Jakarta Sans):** These are our "statement" pieces. Use `display-lg` (3.5rem) with tight letter-spacing for hero voting results. The font's geometric but soft nature mirrors the rounded UI.
*   **Body & Labels (Manrope):** Chosen for its exceptional legibility at small sizes. `body-md` (0.875rem) is the workhorse for card descriptions and player names.
*   **Visual Hierarchy Tip:** Use `on-surface-variant` (#3b6447) for secondary metadata to create a natural "receding" effect, allowing the `on-surface` (#0b361d) headlines to command attention.

---

## 4. Elevation & Depth
In this system, depth is "felt," not "seen."

*   **The Layering Principle:** Avoid shadows for static elements. Use the `surface-container` scale to create lift. An inner voting card using `surface-container-lowest` (#ffffff) on a `surface-dim` (#a0e4b1) background provides a crisp, modern "pop" without a single drop shadow.
*   **Ambient Shadows:** For floating elements (like a betting slider or a profile popover), use a "Poker-Felt Shadow": 
    *   *Blur:* 40px | *Spread:* -10px | *Color:* `on-surface` at 6% opacity.
*   **The "Ghost Border" Fallback:** If accessibility requires a boundary, use `outline-variant` (#8bb795) at **15% opacity**. It should be a whisper, not a shout.

---

## 5. Components

### Buttons
- **Primary:** Uses the `xl` (3rem) corner radius. Background is the `primary` to `primary-container` gradient. Text is `on-primary` (#caffdc).
- **Secondary:** `secondary-container` (#afd5ff) background with `on-secondary-container` (#004a79) text. No border.

### Voting Cards (The Core Component)
- **Structure:** No dividers. Use 2rem (`lg`) vertical spacing between content blocks.
- **Active State:** Instead of a border, use a subtle glow effect with `surface-tint` (#006941) at 5% opacity and a shift to `surface-container-highest`.

### Chips (Poker Chips)
- Used for categories or status. Use `full` (9999px) radius. 
- **Action Chips:** Use `tertiary-container` (#ff9473) for a warm, "Betting" feel that stands out against the green background.

### Input Fields
- Background: `surface-container-lowest`. 
- Border: `none`.
- Focus State: A soft 4px outer "aura" using `primary-fixed-dim` at 40% opacity.

### Navigation / Bottom Sheets
- Use the **Glassmorphism** rule. A `surface` background at 80% opacity with a 24px blur creates a premium, high-end feel as it scrolls over the content.

---

## 6. Do's and Don'ts

### Do:
- **Do** use the `xl` (3rem) corner radius for main containers to emphasize the "friendly" brand personality.
- **Do** use `headline-lg` for "Big Reveal" moments in voting.
- **Do** lean into white space. If a layout feels crowded, remove a container before you remove a margin.

### Don't:
- **Don't** use 1px solid black or dark grey borders. This instantly kills the "High-End" feel.
- **Don't** use pure black (#000000) for text. Always use `on-surface` (#0b361d) to maintain the organic, tonal harmony.
- **Don't** use standard Material Design shadows. They are too "software-like." Stick to Tonal Layering.
- **Don't** use dividers. If you need to separate items in a list, use a 4px background color shift between `surface-container-low` and `surface-container-lowest`.

---

## 7. Signature Interactions
- **The "Soft Press":** When a user interacts with a card, it should scale down slightly (0.98x) and increase its "Ambient Shadow" spread.
- **The Tonal Reveal:** When a vote is cast, the background of the card should "flood" with the `primary-fixed` (#7bfeb8) color using a soft radial expansion.