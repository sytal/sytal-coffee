import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import SiteLayout from '@/Layouts/SiteLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';

// This app has no websocket/broadcasting driver configured (no
// Reverb/Pusher/Echo), so there is no live push when staff change an
// order's status. Instead we poll in the background for a status update —
// a one-directional refresh, not a chat/notification channel — and
// silently refresh the order list via an Inertia partial reload so a
// "Preparing" -> "Out for Delivery" change shows up without the customer
// having to hit refresh themselves.
const POLL_INTERVAL_MS = 18000;

export default function Mine({ orders = [] }) {
    useEffect(() => {
        const timer = setInterval(() => {
            router.reload({ only: ['orders'] });
        }, POLL_INTERVAL_MS);

        return () => clearInterval(timer);
    }, []);

    return (
        <SiteLayout>
            <Head title="My Orders — KAVO" />
            <div className="mx-auto max-w-4xl px-6 py-28 sm:py-36">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-brand-gold">
                    Order History
                </p>
                <h1 className="font-display text-4xl text-brand-foreground sm:text-5xl">My Orders</h1>

                {orders.length === 0 ? (
                    <p className="mt-10 rounded-sm border border-brand-border bg-brand-surface p-8 text-center text-brand-foregroundMuted">
                        You haven&rsquo;t placed any orders yet. Head to the menu to order something good.
                    </p>
                ) : (
                    <div className="mt-10 flex flex-col gap-5">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-sm border border-brand-border bg-brand-surface p-6"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-brand-foreground">Order #{order.id}</p>
                                        <p className="text-xs text-brand-foregroundMuted">
                                            {new Date(order.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>

                                <ul className="mt-4 flex flex-col gap-1.5 border-t border-brand-border pt-4 text-sm text-brand-foregroundMuted">
                                    {(order.items ?? []).map((item) => (
                                        <li key={item.id} className="flex items-center justify-between">
                                            <span>
                                                {item.quantity} &times; {item.name}
                                            </span>
                                            <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-4 flex items-center justify-between border-t border-brand-border pt-4">
                                    <span className="text-xs text-brand-foregroundMuted">
                                        Delivering to {order.delivery_address}
                                    </span>
                                    <span className="font-display text-brand-gold">
                                        Rs. {Number(order.total).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SiteLayout>
    );
}
