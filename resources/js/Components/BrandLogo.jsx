/**
 * KAVO logo: a coffee cup whose steam is a lightning bolt ("Coffee Brings
 * Energy") next to the KAVO wordmark. The mark uses currentColor via the
 * brand accent, so it follows every Admin > Appearance theme.
 */
export function BrandMark({ className = 'h-7 w-7' }) {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
            <path d="M35 1 L21.5 20.5 H30 L26 32 L42 12 H33.5 L38 1 Z" fill="currentColor" />
            <path d="M11 31 H45 V39.5 C45 47.5 38.5 54 30.5 54 H25.5 C17.5 54 11 47.5 11 39.5 Z" fill="currentColor" />
            <path d="M45 34 H48.5 A6 6 0 0 1 48.5 46 H44" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M7 59 H49" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

export default function BrandLogo({ suffix = null, size = 'md', tagline = false }) {
    const sizes = {
        sm: { mark: 'h-6 w-6', word: 'text-lg' },
        md: { mark: 'h-7 w-7', word: 'text-xl' },
        lg: { mark: 'h-9 w-9', word: 'text-2xl' },
    }[size];

    return (
        <span className="inline-flex flex-col">
            <span className="inline-flex items-center gap-2">
                <BrandMark className={`${sizes.mark} -mt-1 text-brand-gold`} />
                <span className={`font-display font-semibold tracking-[0.12em] text-brand-foreground ${sizes.word}`}>
                    KAVO
                    {suffix && <span className="ml-2 font-normal tracking-wide text-brand-gold">{suffix}</span>}
                </span>
            </span>
            {tagline && (
                <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-brand-gold">Coffee Brings Energy</span>
            )}
        </span>
    );
}
