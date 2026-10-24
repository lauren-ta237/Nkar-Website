# Plan: Migrate Tailwind CSS from v3 to v4

## Context

The project is being upgraded to Tailwind CSS v4.3.3. Currently, the setup is a hybrid: dependencies are at v4, but the configuration is still in `tailwind.config.js` and `postcss.config.js` using v3 syntax. The goal is to move all configuration to `src/index.css` using the new v4 CSS-first approach, enable the Vite plugin, and clean up the legacy configuration files.

## Approach

### Phase 1: Configure Vite Plugin
- Uncomment `import tailwindcss from '@tailwindcss/vite'` and `tailwindcss()` in `apps/web/vite.config.js`.
- This enables the native v4 processing.

### Phase 2: Migrate Theme to CSS
- Update `apps/web/src/index.css`:
    - Replace `@tailwind base/components/utilities` with `@import "tailwindcss";`.
    - Replace `tailwindcss-animate` with `@import "tw-animate-css";`.
    - Create a `@theme` block and migrate custom values from `tailwind.config.js`:
        - Colors: `forest`, `gold`, `clay`, `cream`, `ivory`, `obsidian`.
        - Breakpoints: `dt: 880px`.
        - Fonts: `heading`, `body`, `display`, `mono`.
        - Keyframes and Animations: `accordion-down`, `accordion-up`.
    - Configure dark mode using `@media (prefers-color-scheme: dark)` as requested (replacing the class-based `--background` overrides).

### Phase 3: Cleanup
- Remove `apps/web/tailwind.config.js`.
- Remove `apps/web/postcss.config.js`.
- Remove `apps/web/src/index.ref.css` (the template file).
- Uninstall `tailwindcss-animate` (replaced by `tw-animate-css`).

## Critical Files

- `apps/web/vite.config.js` — Enable Vite plugin.
- `apps/web/src/index.css` — Primary configuration entry.
- `apps/web/package.json` — Remove unused dependency.

## Verification

1. Run `npm run build` — ensure the build succeeds and Tailwind classes are correctly generated in the output CSS.
2. Run `npm run dev` and perform a smoke test:
    - Verify custom colors (`text-forest-700`, `bg-gold-100`, etc.) are working.
    - Verify custom fonts are applied.
    - Verify dark mode works via system preference.
    - Verify animations (accordions) still function with `tw-animate-css`.
3. Check for any "Unknown at-rule" warnings in the IDE (expected to be gone after enabling the plugin).
