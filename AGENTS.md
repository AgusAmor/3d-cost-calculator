# Guidelines for AI Coding Agents

This document defines the methodology, coding standards, and best practices that must be strictly followed by all AI agents working on this project.

> [!IMPORTANT]
> This file is a living document and must be continuously updated by AI agents whenever a new recurring action, coding standard, or project parameter is defined.


## 📋 General Rules

1. **Comment Language**: All comments in the code (inline, block, JSDoc) **must be in English** and must be descriptive. Explain *why* something is done, not just *what* the code does.
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

## ⚙️ Project Architecture & Data Models

When implementing features, keep the state modular and centralized. Save configuration values (filament prices, electricity cost, margins) in `localStorage` so they persist between sessions.

### Default Variables (Reference)
- **Electricity cost**: Calculate based on power consumption (Watts) and regional kWh price.
- **Filament cost**: Calculate cost per gram (e.g., Price / Spool Weight).
- **Other consumables**: Flat rate per print hour or fixed setup cost.
