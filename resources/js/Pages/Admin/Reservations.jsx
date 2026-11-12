import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import { confirmDialog } from '@/Components/Admin/ConfirmHost';
import { LuCheck, LuX, LuSearch, LuRotateCcw, LuTrash2, LuChevronDown } from 'react-icons/lu';

const STATUSES = ['All', 'Pending', 'Confirmed', 'Cancelled'];

// Only the actions that make sense for the booking's current status.
const ACTIONS = {
    Pending: [
        { to: 'Confirmed', label: 'Confirm', Icon: LuCheck, tone: 'success' },
        { to: 'Cancelled', label: 'Cancel', Icon: LuX, tone: 'danger' },
    ],
    Confirmed: [
        { to: 'Cancelled', label: 'Cancel', Icon: LuX, tone: 'danger' },
        { to: 'Pending', label: 'Mark pending', Icon: LuRotateCcw, tone: 'gold' },
    ],
    Cancelled: [{ to: 'Pending', label: 'Restore', Icon: LuRotateCcw, tone: 'gold' }],
};

const TONE = {
    success: 'hover:border-brand-success hover:text-brand-success',
    danger: 'hover:border-brand-danger hover:text-brand-danger',
    gold: 'hover:border-brand-gold hover:text-brand-gold',
};

const params = () => new URLSearchParams(window.location.search);

function formatTime(t) {
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export default function Reservations({ reservations = [] }) {
    const [status, setStatus] = useState(() => params().get('status') || 'All');
    const [query, setQuery] = useState('');
    const [openId, setOpenId] = useState(() => Number(params().get('open')) || null);

    useEffect(() => {
        if (openId) document.getElementById(`res-${openId}`)?.scrollIntoView({ block: 'center' });
    }, []);

    const q = query.toLowerCase();
    const rows = reservations.filter(
        (r) =>
            (status === 'All' || r.status === status) &&
            (r.name.toLowerCase().includes(q) || (r.phone ?? '').includes(q) || (r.email ?? '').toLowerCase().includes(q)),
    );

    function updateStatus(r, to) {
        router.patch(`/admin/reservations/${r.id}/status`, { status: to }, { preserveScroll: true });
    }

    async function remove(r) {
        if (!(await confirmDialog(`Delete the booking for ${r.name}? This can't be undone.`))) return;
        router.delete(`/admin/reservations/${r.id}`, { preserveScroll: true });
    }

    return (
        <AdminLayout title="Reservations">
            <Head title="Admin — Reservations" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative">
                    <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-foregroundMuted" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search name or phone..."
                        className="w-full rounded-sm border border-brand-border bg-brand-surface py-2 pl-9 pr-3 text-sm text-brand-foreground outline-none placeholder:text-brand-foregroundMuted/60 focus:border-brand-gold sm:w-64"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                    {STATUSES.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(s)}
                            className={`shrink-0 rounded-full border px-4 py-2 text-xs uppercase tracking-wider transition ${
                                status === s
                                    ? 'border-brand-gold bg-brand-gold text-brand-background'
                                    : 'border-brand-border text-brand-foregroundMuted hover:border-brand-gold hover:text-brand-gold'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* One card layout at every width: no squeezed table columns. */}
            <div className="mt-6 grid grid-cols-1 gap-3 xl:grid-cols-2">
                {rows.map((r) => {
                    const open = openId === r.id;
                    return (
                        <div
                            key={r.id}
                            id={`res-${r.id}`}
                            className={`rounded-sm border bg-brand-surface p-4 ${open ? 'border-brand-gold' : 'border-brand-border'}`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate text-brand-foreground">{r.name}</p>
                                    <p className="whitespace-nowrap text-sm text-brand-foregroundMuted">
                                        {r.party_size} {r.party_size === 1 ? 'guest' : 'guests'} · {r.date} · {formatTime(r.time)}
                                    </p>
                                </div>
                                <StatusBadge status={r.status} />
                            </div>

                            {open && (
                                <dl className="mt-3 space-y-1 border-t border-brand-border/60 pt-3 text-sm">
                                    <div className="flex gap-2">
                                        <dt className="w-16 shrink-0 text-brand-foregroundMuted">Phone</dt>
                                        <dd><a href={`tel:${r.phone}`} className="text-brand-gold">{r.phone}</a></dd>
                                    </div>
                                    {r.email && (
                                        <div className="flex gap-2">
                                            <dt className="w-16 shrink-0 text-brand-foregroundMuted">Email</dt>
                                            <dd className="min-w-0 break-all text-brand-foreground">{r.email}</dd>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <dt className="w-16 shrink-0 text-brand-foregroundMuted">Notes</dt>
                                        <dd className="min-w-0 whitespace-pre-wrap text-brand-foreground">{r.requests || '—'}</dd>
                                    </div>
                                </dl>
                            )}

                            <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setOpenId(open ? null : r.id)}
                                    className="mr-auto flex min-h-10 items-center gap-1 text-xs uppercase tracking-wider text-brand-foregroundMuted hover:text-brand-gold"
                                >
                                    Details <LuChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
                                </button>
                                {ACTIONS[r.status]?.map(({ to, label, Icon, tone }) => (
                                    <button
                                        key={to}
                                        type="button"
                                        onClick={() => updateStatus(r, to)}
                                        className={`flex min-h-10 items-center gap-1.5 rounded-sm border border-brand-border px-3 text-xs text-brand-foregroundMuted transition ${TONE[tone]}`}
                                    >
                                        <Icon className="h-4 w-4" /> {label}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => remove(r)}
                                    aria-label={`Delete booking for ${r.name}`}
                                    className={`flex h-10 w-10 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition ${TONE.danger}`}
                                >
                                    <LuTrash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {rows.length === 0 && (
                <p className="mt-6 rounded-sm border border-brand-border bg-brand-surface p-8 text-center text-sm text-brand-foregroundMuted">
                    No reservations match this filter.
                </p>
            )}
        </AdminLayout>
    );
}
