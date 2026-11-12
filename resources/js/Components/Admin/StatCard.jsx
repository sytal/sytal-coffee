export default function StatCard({ icon: Icon, label, value, trend, trendUp = true }) {
    return (
        <div className="flex items-center gap-3 rounded-sm border border-brand-border bg-brand-surface p-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 text-brand-gold">
                <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                    <p className="font-display text-xl text-brand-foreground sm:text-2xl">{value}</p>
                    {trend && (
                        <span
                            className={`text-xs font-semibold ${trendUp ? 'text-brand-success' : 'text-brand-danger'}`}
                        >
                            {trendUp ? '+' : ''}
                            {trend}
                        </span>
                    )}
                </div>
                <p className="text-[10px] uppercase leading-tight tracking-wider text-brand-foregroundMuted [overflow-wrap:anywhere]">
                    {label}
                </p>
            </div>
        </div>
    );
}
