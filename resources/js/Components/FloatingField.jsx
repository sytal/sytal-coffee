import { LuCircleCheck } from 'react-icons/lu';

/**
 * Labeled field: a small uppercase caption sits above the input, with the
 * optional icon inside the field on the left and a validity check on the
 * right. Previously the label floated *inside* the field and was truncated
 * with `truncate` once focused/filled — on anything longer than a couple of
 * words ("Where should we send confirmation?") that just clipped the label
 * mid-word, which read as a half-broken field. A persistent label above the
 * input never needs to be cut off, wraps cleanly on narrow screens, and
 * keeps every field the same height regardless of input type.
 */
export default function FloatingField({
    label,
    icon: Icon,
    error,
    valid,
    as: Tag = 'input',
    className = '',
    children,
    id,
    // Fixed, non-editable text shown inside the field before the input
    // (e.g. "+92" on a phone field) — not part of the editable value.
    prefix,
    // Retained for backward compatibility with existing callers — the new
    // always-above label makes this distinction unnecessary, but we don't
    // want it leaking through ...props onto the underlying DOM element.
    alwaysFloated: _alwaysFloated,
    ...props
}) {
    const fieldId = id ?? `field-${label?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const leftPad = prefix ? 'pl-[4.5rem]' : Icon ? 'pl-11' : 'pl-4';

    return (
        <div>
            <label
                htmlFor={fieldId}
                className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-brand-foregroundMuted"
            >
                {label}
            </label>
            <div className="relative">
                {Icon && !prefix && (
                    <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-foregroundMuted" />
                )}
                {prefix && (
                    <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-brand-foreground">
                        {Icon && <Icon className="h-4 w-4 text-brand-foregroundMuted" />}
                        <span className="border-r border-brand-border pr-2 text-sm">{prefix}</span>
                    </span>
                )}
                <Tag
                    id={fieldId}
                    className={`peer w-full rounded-sm border border-brand-border bg-brand-surface py-3 pr-10 text-brand-foreground outline-none transition placeholder:text-brand-foregroundMuted/50 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/40 ${
                        error ? 'border-brand-danger' : ''
                    } ${leftPad} ${className}`}
                    {...props}
                >
                    {children}
                </Tag>
                {valid && !error && (
                    <LuCircleCheck className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-success" />
                )}
            </div>
            {error && <span className="mt-1.5 block text-xs text-brand-danger">{error}</span>}
        </div>
    );
}
