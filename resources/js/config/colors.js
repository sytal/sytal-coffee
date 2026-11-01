/**
 * Single source of truth for Crunches Cafe's color palette.
 * Every component should reference these tokens (via Tailwind classes below
 * or by importing this file) instead of hardcoding hex/rgb values.
 *
 * Palette: dark storefront base with a neon pink-red accent, matching
 * Crunches' real signage (Gulberg Thana Rd, Faisalabad).
 */
export const colors = {
    background: '#0c0b0d',
    surface: '#18141a',
    surfaceAlt: '#211a24',
    border: '#3a2e3d',

    foreground: '#f7f1f4',
    foregroundMuted: '#bdadb5',

    gold: '#ff3d68',
    goldLight: '#ff7196',
    goldDark: '#c41f49',

    success: '#5fae70',
    danger: '#e23b5a',
};

export default colors;
