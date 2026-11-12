import { useEffect, useState } from 'react';
import { getOpenStatus } from '@/lib/timeOfDay';
import { useBusiness } from '@/lib/business';

export default function LiveStatusBadge({ className = '' }) {
    const { open_time: open, close_time: close } = useBusiness();
    const [status, setStatus] = useState(() => getOpenStatus(new Date(), open, close));

    useEffect(() => {
        const tick = () => setStatus(getOpenStatus(new Date(), open, close));
        tick();
        const id = setInterval(tick, 60_000);
        return () => clearInterval(id);
    }, [open, close]);

    return (
        <div
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-brand-border/60 bg-brand-surface/60 px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] ${className}`}
        >
            <span className="relative flex h-2 w-2">
                <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${
                        status.isOpen ? 'bg-brand-success' : 'bg-brand-danger'
                    }`}
                />
                <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${
                        status.isOpen ? 'bg-brand-success' : 'bg-brand-danger'
                    }`}
                />
            </span>
            <span className="text-brand-foregroundMuted">{status.label}</span>
        </div>
    );
}
