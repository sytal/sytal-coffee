export default function StatCard({ icon: Icon, label, value, trend, trendUp = true }) {
    return (
        <div className="rounded-sm border border-brand-border bg-brand-surface p-5">
            <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/40 text-brand-gold">
                    <Icon className="h-5 w-5" />
                </span>
                {trend && (
                    <span
                        className={`text-xs font-semibold ${trendUp ? 'text-brand-success' : 'text-brand-danger'}`}
                    >
                        {trendUp ? '+' : ''}
                        {trend}
                    </span>
                )}
            </div>
            <p className="mt-4 font-display text-3xl text-brand-foreground">{value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-brand-foregroundMuted">{label}</p>
        </div>
    );
}
