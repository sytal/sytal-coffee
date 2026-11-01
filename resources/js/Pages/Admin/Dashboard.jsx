import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/Admin/StatCard';
import StatusBadge from '@/Components/Admin/StatusBadge';
import { LuUtensils, LuCalendarCheck, LuMessageSquare, LuUsers } from 'react-icons/lu';

const RECENT_RESERVATIONS = [
    { name: 'Ahmed Raza', guests: 4, date: 'Today, 8:30 PM', status: 'Confirmed' },
    { name: 'Fatima Noor', guests: 2, date: 'Today, 9:00 PM', status: 'Pending' },
    { name: 'Bilal Khan', guests: 6, date: 'Tomorrow, 7:00 PM', status: 'Confirmed' },
    { name: 'Ayesha Malik', guests: 3, date: 'Tomorrow, 8:00 PM', status: 'Cancelled' },
];

const RECENT_MESSAGES = [
    { name: 'Hassan Ali', preview: 'Do you have a private party booking option for 20 people?', time: '12m ago' },
    { name: 'Sara Ahmed', preview: 'Loved the loaded fries! Any chance you deliver outside Faisalabad?', time: '1h ago' },
    { name: 'Usman Tariq', preview: 'What time do you close on Fridays?', time: '3h ago' },
];

export default function Dashboard() {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin — Dashboard" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={LuUtensils} label="Menu Items" value="88" trend="4%" />
                <StatCard icon={LuCalendarCheck} label="Reservations Today" value="14" trend="12%" />
                <StatCard icon={LuMessageSquare} label="Unread Messages" value="6" trend="2" trendUp={false} />
                <StatCard icon={LuUsers} label="Monthly Visitors" value="3.2K" trend="18%" />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
                <div className="rounded-sm border border-brand-border bg-brand-surface p-6 lg:col-span-3">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-display text-lg text-brand-foreground">Recent Reservations</h2>
                        <a href="/admin/reservations" className="text-xs uppercase tracking-wider text-brand-gold">
                            View all
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-brand-border text-xs uppercase tracking-wider text-brand-foregroundMuted">
                                    <th className="pb-3 pr-4 font-normal">Name</th>
                                    <th className="pb-3 pr-4 font-normal">Guests</th>
                                    <th className="pb-3 pr-4 font-normal">Date</th>
                                    <th className="pb-3 font-normal">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RECENT_RESERVATIONS.map((r) => (
                                    <tr key={r.name} className="border-b border-brand-border/60 last:border-0">
                                        <td className="py-3 pr-4 text-brand-foreground">{r.name}</td>
                                        <td className="py-3 pr-4 text-brand-foregroundMuted">{r.guests}</td>
                                        <td className="py-3 pr-4 text-brand-foregroundMuted">{r.date}</td>
                                        <td className="py-3">
                                            <StatusBadge status={r.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-sm border border-brand-border bg-brand-surface p-6 lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-display text-lg text-brand-foreground">Recent Messages</h2>
                        <a href="/admin/messages" className="text-xs uppercase tracking-wider text-brand-gold">
                            View all
                        </a>
                    </div>
                    <div className="space-y-4">
                        {RECENT_MESSAGES.map((m) => (
                            <div key={m.name} className="border-b border-brand-border/60 pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-brand-foreground">{m.name}</p>
                                    <span className="text-xs text-brand-foregroundMuted">{m.time}</span>
                                </div>
                                <p className="mt-1 truncate text-sm text-brand-foregroundMuted">{m.preview}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
