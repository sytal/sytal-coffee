import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/Admin/StatCard';
import StatusBadge from '@/Components/Admin/StatusBadge';
import { LuUtensils, LuCalendarCheck, LuMessageSquare, LuReceipt } from 'react-icons/lu';

const rs = (n) => `Rs. ${Number(n).toLocaleString('en-PK')}`;

function Card({ title, href, children, className = '' }) {
    return (
        <div className={`rounded-sm border border-brand-border bg-brand-surface p-5 ${className}`}>
            <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg text-brand-foreground">{title}</h2>
                <Link href={href} className="py-2 text-xs uppercase tracking-wider text-brand-gold">
                    View all
                </Link>
            </div>
            {children}
        </div>
    );
}

function Row({ href, children }) {
    return (
        <button
            type="button"
            onClick={() => router.visit(href)}
            className="flex w-full items-center gap-3 border-b border-brand-border/60 py-3 text-left text-sm transition last:border-0 hover:bg-brand-surfaceAlt"
        >
            {children}
        </button>
    );
}

const Empty = ({ children }) => <p className="py-6 text-center text-sm text-brand-foregroundMuted">{children}</p>;

export default function Dashboard({ stats = {}, recentOrders = [], recentReservations = [], recentMessages = [] }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin — Dashboard" />

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard href="/admin/orders" icon={LuReceipt} label={`Orders Today · ${stats.activeOrders ?? 0} active`} value={stats.ordersToday ?? 0} />
                <StatCard href="/admin/reservations?status=Pending" icon={LuCalendarCheck} label={`Bookings Today · ${stats.pendingReservations ?? 0} pending`} value={stats.reservationsToday ?? 0} />
                <StatCard href="/admin/messages" icon={LuMessageSquare} label="Unread Messages" value={stats.unreadMessages ?? 0} />
                <StatCard href="/admin/menu" icon={LuUtensils} label={`Menu Items · ${stats.soldOut ?? 0} sold out`} value={stats.menuItems ?? 0} />
            </div>

            <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
                <Card title="Latest Orders" href="/admin/orders">
                    {recentOrders.map((o) => (
                        <Row key={o.id} href={`/admin/orders?open=${o.id}`}>
                            <span className="whitespace-nowrap font-mono text-brand-gold">#{o.id}</span>
                            <span className="min-w-0 flex-1 truncate text-brand-foreground">{o.user?.name ?? 'Guest'}</span>
                            <span className="whitespace-nowrap text-brand-foregroundMuted">{rs(o.total)}</span>
                            <StatusBadge status={o.status} />
                        </Row>
                    ))}
                    {recentOrders.length === 0 && <Empty>No orders yet.</Empty>}
                </Card>

                <Card title="New Bookings" href="/admin/reservations">
                    {recentReservations.map((r) => (
                        <Row key={r.id} href={`/admin/reservations?open=${r.id}`}>
                            <span className="min-w-0 flex-1 truncate text-brand-foreground">{r.name}</span>
                            <span className="whitespace-nowrap text-brand-foregroundMuted">
                                {r.party_size} · {r.date} {r.time}
                            </span>
                            <StatusBadge status={r.status} />
                        </Row>
                    ))}
                    {recentReservations.length === 0 && <Empty>No reservations yet.</Empty>}
                </Card>

                <Card title="Recent Messages" href="/admin/messages" className="lg:col-span-2">
                    {recentMessages.map((m) => (
                        <Row key={m.id} href={`/admin/messages?open=${m.id}`}>
                            <span className="w-32 shrink-0 truncate text-brand-foreground">{m.name}</span>
                            <span className="min-w-0 flex-1 truncate text-brand-foregroundMuted">{m.message}</span>
                            <span className="hidden whitespace-nowrap text-xs text-brand-foregroundMuted sm:inline">
                                {new Date(m.created_at).toLocaleString()}
                            </span>
                        </Row>
                    ))}
                    {recentMessages.length === 0 && <Empty>No messages yet.</Empty>}
                </Card>
            </div>
        </AdminLayout>
    );
}
