# Guidelines for AI Coding Agents

This document defines the methodology, coding standards, and best practices that must be strictly followed by all AI agents working on this project.

> [!IMPORTANT]
> This file is a living document and must be continuously updated by AI agents whenever a new recurring action, coding standard, or project parameter is defined.

## 📋 General Rules

1. **Comment Language**: All comments in the code (inline, block, JSDoc) **must be in English** and must be descriptive. Explain _why_ something is done, not just _what_ the code does.
2. **Component Declarations**: Always use named exports as default for React components:
   ```javascript
   export default function ComponentName() {
     // ...
   }
   ```
   Do not use arrow functions for default component exports (e.g., `const Component = () => {}` or `export default () => {}`).
3. **Styling Approach**: We use **Tailwind CSS v4** for all styling. Rely on modern CSS v4 directives and class structures. Ensure designs feel premium, responsive, clean (e.g. glassmorphism or sleek dark mode), and use harmonious colors.
4. **File Naming Conventions**:
   - React Components: PascalCase (e.g., `CostCalculator.jsx`, `SettingsPanel.jsx`).
   - Hooks and utilities: camelCase (e.g., `useLocalStorage.js`, `calculations.js`).
5. **Git Commit Messages**: Commit messages must be written in Spanish, following the Conventional Commits format (e.g., `feat:`, `fix:`, `docs:`).
6. **Documentation Updates on Commit Suggestion**: Every time the user asks for a commit name/suggestion, the active agent must analyze the current status of the repository and update the project documentation (`AGENTS.md`, `README.md`, etc.) to match the current progress and state before providing the commit name.
7. **Implementation Plans**: Always present a detailed implementation plan to the user when the changes or new features are large or complex.

## ⚙️ Project Architecture & Data Models

When implementing features, keep the state modular and centralized. Save configuration values (filament prices, electricity cost, margins) in `localStorage` so they persist between sessions. The project state follows a multi-plate model, meaning a single project can have an array of `plates`, each with its own filament selection, weight, and print time.

### Default Variables (Reference)

- **Electricity cost**: Calculate based on power consumption (default 120 W) and regional kWh price (default $120/kWh).
- **Filament cost**: Calculate cost per gram based on catalog price (default PLA Standard: $22,500 per 1000g).
- **Printer wear**: Amortization rate of $150/hr direct printer wear.
- **Scrap**: Multiplier of 1.1 (10% scrap) on both time and material costs.
- **Profit**: Direct multiplier (default x6) over total base production costs.

## ⌨️ Input Handling Standards

1. **Numeric Inputs**: To fully support decimal commas across all OS locales and prevent negative numbers, do NOT use `<input type="number">`. Instead, use `<input type="text" inputMode="decimal">` and sanitize the value using the `parseDecimalInput` utility from `src/utils/formatters.js`.
2. **State Updates**: Always ensure numeric properties that are stored as strings (to preserve trailing dots/commas during typing) are explicitly cast to `Number()` before performing mathematical operations (e.g., during `.reduce()` aggregations).

## 🖼️ UI Patterns & Components

1. **Modals**: All modal dialogs (Quotes, Filaments) must use the base `Modal` component (`src/components/ui/Modal.jsx`), which utilizes React Portals (`createPortal`) to escape CSS boundaries and support sticky footers.
2. **Confirmations**: Never use native `window.confirm()`. Always use the `useConfirm` hook provided by `ConfirmContext` to trigger the custom `ConfirmModal` for destructive actions.
3. **Animations & Transitions**:
   - **Mode Switches**: Avoid abrupt conditional rendering (mounting/unmounting) for view-to-edit transitions. Keep elements in the DOM and use CSS transitions (`max-w-0`, `max-h-0`, `opacity-0`, `scale`) to achieve fluid, symmetrical expanding/collapsing animations. Use the `.btn-secondary` class for consistent action button animations.
   - **Lists**: List additions and removals (e.g., plates, filaments) must use `@formkit/auto-animate`. Apply the `useAutoAnimate` hook to the parent container. **Important**: Ensure the direct children of the auto-animate container do *not* have manual CSS `transition` properties (like `transition-all`) to avoid conflicting FLIP calculations.
   - **Modal Exiting**: To allow CSS exit animations to play fully, modals must not be unmounted instantly by parent components. Use an "active item" cache pattern (e.g., `activeQuote` or `activeFilament`) so the modal remains mounted with its data while `isOpen` evaluates to false.
