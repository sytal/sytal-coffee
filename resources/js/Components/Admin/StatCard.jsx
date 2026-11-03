export default function StatCard({ icon: Icon, label, value, trend, trendUp = true }) {
    return (
        <div className="rounded-sm border border-brand-border bg-brand-surface p-3.5 sm:p-5">
            <div className="flex items-start justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-gold/40 text-brand-gold sm:h-10 sm:w-10">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
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
            <p className="mt-2.5 font-display text-2xl text-brand-foreground sm:mt-4 sm:text-3xl">{value}</p>
            <p className="mt-1 text-[10px] uppercase leading-tight tracking-wider text-brand-foregroundMuted sm:text-xs">
                {label}
            </p>
        </div>
    );
}
