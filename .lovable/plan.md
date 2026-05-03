## HouseTracker — App Shell

Build the mobile-first skeleton for a waiter training app, styled to match sohohouse.com exactly. No functionality yet — just navigation, header, and empty tab screens with the design system fully wired up.

### Design system setup

**Fonts** (`index.html`): Add Google Fonts links for Cormorant Garamond (400) and DM Sans (300, 400).

**Tailwind tokens** (`tailwind.config.ts`): Add custom colors under `sh.*`:
- `bg` #FAF8F5, `surface` #F0EAE0, `text` #1A1A1A, `muted` #6B6560, `border` #D6CEC3, `btn` #1A1A1A, `btn-text` #FFFFFF, `white` #FFFFFF

Add font families:
- `serif: ['Cormorant Garamond', 'serif']`
- `sans: ['DM Sans', 'sans-serif']` (override default so DM Sans is the base — no Inter/system fallback creep)

**Global styles** (`src/index.css`): Set body background `#FAF8F5`, body font DM Sans weight 300–400, base text color `#1A1A1A`. Headings default to Cormorant Garamond weight 400. Remove default rounded utilities from custom components (use `rounded-none` or `rounded-[2px]` per spec).

### Layout shell

**`src/components/AppShell.tsx`** — wraps every screen:
- Fixed top header: 56px tall, `#FAF8F5` bg, 1px bottom border `#D6CEC3`, centered "House Tracker" in Cormorant Garamond, sentence case, weight 400, ~22px.
- Main content area: scrollable, `#FAF8F5` bg, padded for header (top) and bottom nav (bottom).
- Fixed bottom navigation bar.

**`src/components/BottomNav.tsx`** — 5 tabs, equal width, ~64px tall, `#FAF8F5` bg, 1px top border `#D6CEC3`. Each tab: lucide icon (24px) + label (DM Sans, ~11px, sentence case) stacked. Active tab uses `#1A1A1A`, inactive uses `#6B6560`. No rounded corners, no shadows.

Tabs and icons (lucide-react):
1. Flashcards — `Layers`
2. Quiz — `HelpCircle`
3. Scripts — `FileText`
4. Log shift — `ClipboardList`
5. Insights — `BarChart3`

### Routing

Update `src/App.tsx` to add routes for each tab under `AppShell`:
- `/` → Flashcards
- `/quiz` → Quiz
- `/scripts` → Scripts
- `/log-shift` → Log Shift
- `/insights` → Insights
- `*` → NotFound

### Placeholder screens

`src/pages/Flashcards.tsx`, `Quiz.tsx`, `Scripts.tsx`, `LogShift.tsx`, `Insights.tsx`. Each one centers the tab name in Cormorant Garamond, weight 400, ~32px, on `#FAF8F5`. Nothing else.

### Visual rules enforced

- Warm white `#FAF8F5` everywhere, no pure white surfaces in the shell.
- All borders are 1px `#D6CEC3`.
- Sharp corners (no rounding) on nav and header.
- Flat — no shadows anywhere.
- Sentence case throughout.

### Out of scope (later)

Flashcard data, quiz logic, script library, shift logging form, insights charts, localStorage persistence.
