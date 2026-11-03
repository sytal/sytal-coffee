/**
 * Single source of truth for Crunches Cafe's color palette, at the
 * Tailwind-config level. The *values* below are the "classic_gold"
 * fallback (used if the DB-driven theme hasn't loaded yet, e.g. during a
 * Tailwind build) — but at runtime every brand.* color resolves through a
 * CSS variable (--brand-*) injected server-side in app.blade.php from the
 * active theme preset in the database (see App\Services\ThemeService).
 * This is what lets the owner switch themes from Admin > Appearance
 * without touching any component code.
 */
export const colors = {
    background: 'var(--brand-background, #0c0b09)',
    surface: 'var(--brand-surface, #17140f)',
    surfaceAlt: 'var(--brand-surfaceAlt, #1f1b15)',
    border: 'var(--brand-border, #37332a)',

    foreground: 'var(--brand-foreground, #f5f1e8)',
    foregroundMuted: 'var(--brand-foregroundMuted, #b9b2a2)',

    gold: 'var(--brand-gold, #f4691f)',
    goldLight: 'var(--brand-goldLight, #ff9248)',
    goldDark: 'var(--brand-goldDark, #c44c13)',

    success: 'var(--brand-success, #5fae70)',
    danger: 'var(--brand-danger, #d6462f)',
};

export default colors;
