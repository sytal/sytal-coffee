import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';
import SlideOver from '@/Components/Admin/SlideOver';
import StatusBadge from '@/Components/Admin/StatusBadge';
import { LuEye, LuSearch, LuRefreshCw, LuChevronRight } from 'react-icons/lu';

const FLOW = ['Pending', 'Preparing', 'Out for Delivery', 'Completed'];
const nextStatus = (s) => (FLOW.indexOf(s) >= 0 ? FLOW[FLOW.indexOf(s) + 1] : undefined);
const rs = (n) => `Rs. ${Number(n).toLocaleString('en-PK')}`;

// One click moves an order to its next step (Pending → Preparing → …).
function NextStepButton({ order, onChange }) {
    const next = nextStatus(order.status);
    if (!next) return null;
    return (
        <button
            type="button"
            onClick={() => onChange(order, next)}
            className="flex min-h-10 items-center gap-1 whitespace-nowrap rounded-sm border border-brand-gold px-3 text-xs text-brand-gold transition hover:bg-brand-gold hover:text-brand-background"
        >
            {next === 'Out for Delivery' ? 'Out' : next} <LuChevronRight className="h-4 w-4" />
        </button>
    );
}

// Total pieces (2 × fries + 1 × burger = 3), not the number of lines.
const itemCount = (o) => (o.items ?? []).reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);

const STATUSES = ['All', 'Pending', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled'];

// No websocket broadcasting driver is configured for this app (no
// Reverb/Pusher/Echo wired up), so "real-time" here means a cheap interval
// poll against a lightweight count-only endpoint rather than a live socket.
const POLL_INTERVAL_MS = 12000;

export default function Orders({ orders = [] }) {
    const [status, setStatus] = useState('All');
    const [query, setQuery] = useState(() =>
        typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('search') ?? ''
    );
    const [viewing, setViewing] = useState(() => {
        const id = typeof window === 'undefined' ? null : Number(new URLSearchParams(window.location.search).get('open'));
        return orders.find((o) => o.id === id) ?? null;
    });
    const [newCount, setNewCount] = useState(0);
    const latestIdRef = useRef(orders.reduce((max, o) => Math.max(max, o.id), 0));

    useEffect(() => {
        let cancelled = false;

        const poll = async () => {
            try {
                const { data } = await axios.get('/admin/orders/latest-check', {
                    params: { since: latestIdRef.current },
                });
                if (!cancelled && data?.new_count > 0) {
                    setNewCount((n) => n + data.new_count);
                }
            } catch {
                // Silently ignore — polling is a nice-to-have, not critical.
            }
        };

        const timer = setInterval(poll, POLL_INTERVAL_MS);
        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, []);

    // Keep the "seen" marker in sync whenever the orders list itself
    // changes (full page load, status update, or the reload below).
    useEffect(() => {
        latestIdRef.current = orders.reduce((max, o) => Math.max(max, o.id), latestIdRef.current);
    }, [orders]);

    function refreshForNewOrders() {
        setNewCount(0);
        router.reload({ only: ['orders'] });
    }

    const rows = orders.filter((o) => {
        const matchesStatus = status === 'All' || o.status === status;
        // "#4", "4", a customer name, email or phone all work.
        const q = query.trim().toLowerCase().replace(/^#/, '');
        const haystack = [o.user?.name, o.user?.email, o.phone].filter(Boolean).join(' ').toLowerCase();
        const matchesQuery = !q || haystack.includes(q) || String(o.id) === q;
        return matchesStatus && matchesQuery;
    });

    function updateStatus(order, newStatus) {
        router.patch(`/admin/orders/${order.id}/status`, { status: newStatus }, { preserveScroll: true });
        if (viewing?.id === order.id) {
            setViewing({ ...viewing, status: newStatus });
        }
    }

    return (
        <AdminLayout title="Orders">
            <Head title="Admin — Orders" />

            <AnimatePresence>
                {newCount > 0 && (
                    <motion.button
                        type="button"
                        onClick={refreshForNewOrders}
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="mb-4 flex w-full items-center justify-center gap-2 rounded-sm border border-brand-gold bg-brand-gold/10 px-4 py-2.5 text-sm text-brand-gold transition hover:bg-brand-gold/20"
                    >
                        <LuRefreshCw className="h-4 w-4" />
                        {newCount} new order{newCount === 1 ? '' : 's'} — click to refresh
                    </motion.button>
                )}
            </AnimatePresence>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative">
                    <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-foregroundMuted" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by customer or order #..."
                        className="w-64 rounded-sm border border-brand-border bg-brand-surface py-2 pl-9 pr-3 text-sm text-brand-foreground placeholder:text-brand-foregroundMuted/60 outline-none focus:border-brand-gold"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
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

            {/* Phones/tablets: cards (the table only fits from 1280px) */}
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:hidden">
                {rows.map((o) => (
                    <div key={o.id} className="rounded-sm border border-brand-border bg-brand-surface p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate text-brand-foreground">
                                    #{o.id} &middot; {o.user?.name ?? 'Guest'}
                                </p>
                                <p className="truncate text-xs text-brand-foregroundMuted">{o.user?.email}</p>
                                <p className="truncate text-xs text-brand-foregroundMuted">{o.delivery_address}</p>
                            </div>
                            <StatusBadge status={o.status} />
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm text-brand-foregroundMuted">
                            <span>{itemCount(o)} items</span>
                            <span className="whitespace-nowrap text-brand-gold">{rs(o.total)}</span>
                        </div>
                        <div className="mt-3 flex justify-end gap-2">
                            <NextStepButton order={o} onChange={updateStatus} />
                            <button
                                type="button"
                                onClick={() => setViewing(o)}
                                className="flex h-10 w-10 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                                aria-label={`View order ${o.id}`}
                            >
                                <LuEye className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
                {rows.length === 0 && (
                    <p className="rounded-sm border border-brand-border bg-brand-surface p-8 text-center text-sm text-brand-foregroundMuted">
                        No orders match this filter.
                    </p>
                )}
            </div>

            {/* Desktop: table */}
            <div className="mt-6 hidden overflow-x-auto rounded-sm border border-brand-border bg-brand-surface xl:block">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-brand-border text-xs uppercase tracking-wider text-brand-foregroundMuted">
                            <th className="p-4 font-normal">Order</th>
                            <th className="p-4 font-normal">Customer</th>
                            <th className="p-4 font-normal">Address</th>
                            <th className="p-4 font-normal">Items</th>
                            <th className="p-4 font-normal">Total</th>
                            <th className="p-4 font-normal">Status</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((o) => (
                            <tr key={o.id} className="border-b border-brand-border/60 last:border-0">
                                <td className="p-4 text-brand-foreground">#{o.id}</td>
                                <td className="p-4 text-brand-foregroundMuted">
                                    <div>{o.user?.name ?? 'Guest'}</div>
                                    <div className="text-xs">{o.user?.email}</div>
                                </td>
                                <td className="min-w-[160px] max-w-[260px] truncate p-4 text-brand-foregroundMuted" title={o.delivery_address}>
                                    {o.delivery_address}
                                </td>
                                <td className="p-4 text-brand-foregroundMuted">{itemCount(o)}</td>
                                <td className="whitespace-nowrap p-4 text-brand-gold">{rs(o.total)}</td>
                                <td className="p-4">
                                    <select
                                        value={o.status}
                                        onChange={(e) => updateStatus(o, e.target.value)}
                                        className="rounded-sm border border-brand-border bg-brand-background px-2 py-1 text-xs text-brand-foreground outline-none focus:border-brand-gold"
                                    >
                                        {STATUSES.filter((s) => s !== 'All').map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-end gap-2">
                                        <NextStepButton order={o} onChange={updateStatus} />
                                        <button
                                            type="button"
                                            onClick={() => setViewing(o)}
                                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                                            aria-label={`View order ${o.id}`}
                                        >
                                            <LuEye className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && (
                    <p className="p-8 text-center text-sm text-brand-foregroundMuted">No orders match this filter.</p>
                )}
            </div>

            <SlideOver open={Boolean(viewing)} onClose={() => setViewing(null)} title={`Order #${viewing?.id ?? ''}`}>
                {viewing && (
                    <div className="flex flex-col gap-5 text-sm">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-brand-foregroundMuted">Customer</p>
                            <p className="mt-1 text-brand-foreground">{viewing.user?.name ?? 'Guest'}</p>
                            <p className="text-brand-foregroundMuted">{viewing.user?.email}</p>
                            <p className="text-brand-foregroundMuted">{viewing.phone}</p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wider text-brand-foregroundMuted">
                                Delivery Address
                            </p>
                            <p className="mt-1 text-brand-foreground">{viewing.delivery_address}</p>
                        </div>

                        {viewing.notes && (
                            <div>
                                <p className="text-xs uppercase tracking-wider text-brand-foregroundMuted">Notes</p>
                                <p className="mt-1 text-brand-foreground">{viewing.notes}</p>
                            </div>
                        )}

                        <div>
                            <p className="mb-2 text-xs uppercase tracking-wider text-brand-foregroundMuted">Items</p>
                            <ul className="flex flex-col gap-2">
                                {(viewing.items ?? []).map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center justify-between rounded-sm border border-brand-border p-3"
                                    >
                                        <span className="text-brand-foreground">
                                            {item.quantity} &times; {item.name}
                                        </span>
                                        <span className="text-brand-foregroundMuted">
                                            Rs. {(item.price * item.quantity).toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col gap-1 border-t border-brand-border pt-4 text-brand-foregroundMuted">
                            <div className="flex justify-between"><span>Subtotal</span><span>{rs(viewing.subtotal ?? viewing.total)}</span></div>
                            <div className="flex justify-between"><span>Delivery fee</span><span>{Number(viewing.delivery_fee) ? rs(viewing.delivery_fee) : 'Free'}</span></div>
                            <div className="flex justify-between"><span>Payment</span><span>{viewing.payment_method ?? 'Cash on Delivery'}</span></div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-brand-foregroundMuted">Total to collect</span>
                            <span className="font-display text-lg text-brand-gold">
                                Rs. {Number(viewing.total).toLocaleString()}
                            </span>
                        </div>

                        <div>
                            <p className="mb-2 text-xs uppercase tracking-wider text-brand-foregroundMuted">Status</p>
                            <select
                                value={viewing.status}
                                onChange={(e) => updateStatus(viewing, e.target.value)}
                                className="w-full rounded-sm border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand-gold"
                            >
                                {STATUSES.filter((s) => s !== 'All').map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </SlideOver>
        </AdminLayout>
    );
}
