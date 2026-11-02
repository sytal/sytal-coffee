const STYLES = {
    confirmed: 'border-brand-success/40 text-brand-success',
    pending: 'border-brand-gold/40 text-brand-gold',
    cancelled: 'border-brand-danger/40 text-brand-danger',
    new: 'border-brand-gold/40 text-brand-gold',
    read: 'border-brand-border text-brand-foregroundMuted',
    active: 'border-brand-success/40 text-brand-success',
    draft: 'border-brand-border text-brand-foregroundMuted',
    preparing: 'border-brand-gold/40 text-brand-gold',
    'out for delivery': 'border-brand-gold/40 text-brand-gold',
    completed: 'border-brand-success/40 text-brand-success',
};

export default function StatusBadge({ status }) {
    const key = status?.toLowerCase();
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-wider ${
                STYLES[key] ?? 'border-brand-border text-brand-foregroundMuted'
            }`}
        >
            {status}
        </span>
    );
}
