# Styles

Global styles live in `app/globals.css` because the App Router imports global CSS from the root layout.

Design tokens are split across:

- `tailwind.config.ts` for theme extension, brutal shadows, fonts, and named colors.
- `app/globals.css` for CSS variables, light/dark themes, base texture, and reusable utility classes.

This folder is kept as the project-level styles namespace for future tokens, motion presets, or design documentation.
