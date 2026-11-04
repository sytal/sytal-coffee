/**
 * Single source of truth for Crunches Cafe's color palette, at the
 * Tailwind-config level. The *values* below are the "classic_gold"
 * fallback (used if the DB-driven theme hasn't loaded yet, e.g. during a
 * Tailwind build) — but at runtime every brand.* color resolves through a
 * CSS variable injected server-side in app.blade.php from the active theme
 * preset in the database (see App\Services\ThemeService). This is what
 * lets the owner switch themes from Admin > Appearance without touching
 * any component code.
 *
 * Each variable holds an "R G B" channel triplet (not a hex string) so
 * Tailwind's opacity-modifier syntax (bg-brand-gold/40, border-brand-border/60,
 * etc.) actually works — Tailwind can only inject an alpha value into a
 * color defined this way (rgb(var(...) / <alpha-value>)). A plain
 * var(--x, #hex) string silently fails to compile any /NN variant, which
 * is why those modifiers rendered invisible/wrong across the admin panel
 * and menu cards before this change.
 */
function withOpacity(varName, fallbackRgb) {
    return ({ opacityValue }) =>
        opacityValue === undefined
            ? `rgb(var(${varName}, ${fallbackRgb}))`
            : `rgb(var(${varName}, ${fallbackRgb}) / ${opacityValue})`;
}

export const colors = {
    background: withOpacity('--brand-background-rgb', '12 11 9'),
    surface: withOpacity('--brand-surface-rgb', '23 20 15'),
    surfaceAlt: withOpacity('--brand-surfaceAlt-rgb', '31 27 21'),
    border: withOpacity('--brand-border-rgb', '55 51 42'),

    foreground: withOpacity('--brand-foreground-rgb', '245 241 232'),
    foregroundMuted: withOpacity('--brand-foregroundMuted-rgb', '185 178 162'),

    gold: withOpacity('--brand-gold-rgb', '244 105 31'),
    goldLight: withOpacity('--brand-goldLight-rgb', '255 146 72'),
    goldDark: withOpacity('--brand-goldDark-rgb', '196 76 19'),

    success: withOpacity('--brand-success-rgb', '95 174 112'),
    danger: withOpacity('--brand-danger-rgb', '214 70 47'),
};

export default colors;
