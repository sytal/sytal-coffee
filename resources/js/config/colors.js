/**
 * Single source of truth for Crunches Cafe's color palette.
 * Every component should reference these tokens (via Tailwind classes below
 * or by importing this file) instead of hardcoding hex/rgb values.
 *
 * Palette: dark storefront base with the vibrant orange from Crunches'
 * actual logo (black background, orange script "Crunches Cafe" wordmark).
 */
export const colors = {
    background: '#0c0b09',
    surface: '#17140f',
    surfaceAlt: '#1f1b15',
    border: '#37332a',

    foreground: '#f5f1e8',
    foregroundMuted: '#b9b2a2',

    gold: '#f4691f',
    goldLight: '#ff9248',
    goldDark: '#c44c13',

    success: '#5fae70',
    danger: '#d6462f',
};

export default colors;
