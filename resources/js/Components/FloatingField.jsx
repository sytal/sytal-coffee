import { useId, useState } from 'react';
import { LuCircleCheck, LuImageUp } from 'react-icons/lu';

/**
 * Styled file picker: a dashed drop zone instead of the browser's plain
 * "Choose File / No file chosen" control. The real <input type="file"> sits
 * invisibly on top, so click, keyboard and drag-and-drop all still work and
 * forms that read the input by name are unaffected.
 */
function FileDrop({ id, error, onChange, multiple, accept, hint, ...props }) {
    const [names, setNames] = useState([]);
    const [dragging, setDragging] = useState(false);

    return (
        <div
            className={`group relative flex items-center gap-4 rounded-sm border-2 border-dashed px-4 py-5 transition ${
                error
                    ? 'border-brand-danger/70'
                    : dragging
                      ? 'border-brand-gold bg-brand-gold/10'
                      : 'border-brand-border hover:border-brand-gold/70 hover:bg-brand-surfaceAlt'
            } focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold/40`}
        >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                <LuImageUp className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1 text-sm">
                {names.length ? (
                    <>
                        <span className="block truncate font-medium text-brand-foreground">
                            {names.length === 1 ? names[0] : `${names.length} images selected`}
                        </span>
                        <span className="text-xs text-brand-gold">Click to change</span>
                    </>
                ) : (
                    <>
                        <span className="block font-medium text-brand-foreground">
                            <span className="text-brand-gold">Click to choose</span> or drag &amp; drop
                        </span>
                        <span className="block text-xs text-brand-foregroundMuted">
                            {hint ?? `JPG, PNG or WebP · up to 4 MB${multiple ? ' each · several at once' : ''}`}
                        </span>
                    </>
                )}
            </span>
            <input
                id={id}
                type="file"
                multiple={multiple}
                accept={accept}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onDragEnter={() => setDragging(true)}
                onDragLeave={() => setDragging(false)}
                onDrop={() => setDragging(false)}
                onChange={(e) => {
                    setNames(Array.from(e.target.files ?? []).map((f) => f.name));
                    onChange?.(e);
                }}
                {...props}
            />
        </div>
    );
}

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
    // useId() keeps ids unique when two forms on one page share a label
    // (e.g. "Best number to reach you" in Reservations and Contact).
    const autoId = useId().replace(/:/g, '');
    const fieldId = id ?? `field-${label?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${autoId}`;
    const leftPad = prefix ? 'pl-[4.5rem]' : Icon ? 'pl-11' : 'pl-4';

    if (props.type === 'file') {
        const { type: _type, ...fileProps } = props;
        return (
            <div>
                <label htmlFor={fieldId} className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-brand-foregroundMuted">
                    {label}
                </label>
                <FileDrop id={fieldId} error={error} {...fileProps} />
                {error && <span className="mt-1.5 block text-xs text-brand-danger">{error}</span>}
            </div>
        );
    }

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
