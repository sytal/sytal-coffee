import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import { LuCheck, LuX, LuEye, LuSearch } from 'react-icons/lu';

const STATUSES = ['All', 'Confirmed', 'Pending', 'Cancelled'];

export default function Reservations({ reservations = [] }) {
    const [status, setStatus] = useState('All');
    const [query, setQuery] = useState('');

    const rows = reservations.filter((r) => {
        const matchesStatus = status === 'All' || r.status === status;
        const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase());
        return matchesStatus && matchesQuery;
    });

    function updateStatus(reservation, newStatus) {
        router.patch(`/admin/reservations/${reservation.id}/status`, { status: newStatus }, {
            preserveScroll: true,
        });
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
                        placeholder="Search by name..."
                        className="w-64 rounded-sm border border-brand-border bg-brand-surface py-2 pl-9 pr-3 text-sm text-brand-foreground placeholder:text-brand-foregroundMuted/60 outline-none focus:border-brand-gold"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                    {STATUSES.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(s)}
                            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition ${
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

            <div className="mt-6 overflow-x-auto rounded-sm border border-brand-border bg-brand-surface">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-brand-border text-xs uppercase tracking-wider text-brand-foregroundMuted">
                            <th className="p-4 font-normal">Guest</th>
                            <th className="p-4 font-normal">Contact</th>
                            <th className="p-4 font-normal">Party</th>
                            <th className="p-4 font-normal">Date &amp; Time</th>
                            <th className="p-4 font-normal">Status</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id} className="border-b border-brand-border/60 last:border-0">
                                <td className="p-4 text-brand-foreground">{r.name}</td>
                                <td className="p-4 text-brand-foregroundMuted">
                                    <div>{r.email}</div>
                                    <div className="text-xs">{r.phone}</div>
                                </td>
                                <td className="p-4 text-brand-foregroundMuted">{r.party_size} guests</td>
                                <td className="p-4 text-brand-foregroundMuted">
                                    {r.date} &middot; {r.time}
                                </td>
                                <td className="p-4">
                                    <StatusBadge status={r.status} />
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                                            aria-label={`View ${r.name}`}
                                        >
                                            <LuEye className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateStatus(r, 'Confirmed')}
                                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-success hover:text-brand-success"
                                            aria-label={`Confirm ${r.name}`}
                                        >
                                            <LuCheck className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateStatus(r, 'Cancelled')}
                                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-danger hover:text-brand-danger"
                                            aria-label={`Cancel ${r.name}`}
                                        >
                                            <LuX className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && (
                    <p className="p-8 text-center text-sm text-brand-foregroundMuted">No reservations match this filter.</p>
                )}
            </div>
        </AdminLayout>
    );
}
