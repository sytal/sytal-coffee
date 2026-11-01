import { LuCircleCheck } from 'react-icons/lu';

/**
 * Floating-label field: the label itself IS the placeholder-style hint —
 * it sits inline until focus/content pushes it up into a small caption.
 * Works for input/textarea (anything supporting :placeholder-shown).
 */
export default function FloatingField({
    label,
    icon: Icon,
    error,
    valid,
    as: Tag = 'input',
    className = '',
    children,
    // For fields that are never "empty" in a meaningful sense (select, date,
    // time) — the label just sits pinned in its compact state permanently,
    // instead of floating on focus/fill, so every field shares the same box
    // height/alignment regardless of input type.
    alwaysFloated = false,
    ...props
}) {
    const floatedClasses =
        'top-3 translate-y-0 text-[11px] uppercase tracking-wider text-brand-foregroundMuted';
    const dynamicFloatClasses =
        'peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-brand-gold peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:tracking-wider';

    return (
        <div>
            <div className="relative">
                {Icon && (
                    <Icon className="pointer-events-none absolute left-4 top-5 h-4 w-4 -translate-y-1/2 text-brand-foregroundMuted peer-focus:text-brand-gold" />
                )}
                <Tag
                    placeholder={alwaysFloated ? undefined : ' '}
                    className={`peer w-full rounded-sm border border-brand-border bg-brand-surface pb-2 pr-10 text-brand-foreground outline-none transition placeholder:text-transparent focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/40 ${
                        alwaysFloated ? 'pt-6' : 'pt-5'
                    } ${Icon ? 'pl-11' : 'pl-4'} ${className}`}
                    {...props}
                >
                    {children}
                </Tag>
                <label
                    className={`pointer-events-none absolute right-3 truncate text-sm text-brand-foregroundMuted/80 transition-all duration-200 ${
                        alwaysFloated
                            ? floatedClasses
                            : `top-5 -translate-y-1/2 ${dynamicFloatClasses}`
                    } ${Icon ? 'left-11' : 'left-4'}`}
                >
                    {label}
                </label>
                {valid && (
                    <LuCircleCheck className="pointer-events-none absolute right-3 top-5 h-4 w-4 -translate-y-1/2 text-brand-success" />
                )}
            </div>
            {error && <span className="mt-1 block text-xs text-brand-danger">{error}</span>}
        </div>
    );
}
