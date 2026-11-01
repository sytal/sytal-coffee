import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import { LuTrash2, LuReply, LuMail } from 'react-icons/lu';

const MESSAGES = [
    {
        id: 1,
        name: 'Hassan Ali',
        email: 'hassan.ali@example.com',
        phone: '0322-3344556',
        message: 'Do you have a private party booking option for 20 people? Looking to celebrate a birthday next weekend.',
        time: '12m ago',
        status: 'New',
    },
    {
        id: 2,
        name: 'Sara Ahmed',
        email: 'sara.ahmed@example.com',
        phone: '0300-9988776',
        message: 'Loved the loaded fries! Any chance you deliver outside Faisalabad city limits?',
        time: '1h ago',
        status: 'New',
    },
    {
        id: 3,
        name: 'Usman Tariq',
        email: 'usman.t@example.com',
        phone: '0345-1122334',
        message: 'What time do you close on Fridays? Planning to stop by after Jummah.',
        time: '3h ago',
        status: 'Read',
    },
    {
        id: 4,
        name: 'Mariam Baig',
        email: 'mariam.b@example.com',
        phone: '0311-6677889',
        message: 'The Nutella waffle was amazing. Can you share the Instagram handle so I can tag you?',
        time: 'Yesterday',
        status: 'Read',
    },
];

export default function Messages() {
    const [activeId, setActiveId] = useState(MESSAGES[0].id);
    const active = MESSAGES.find((m) => m.id === activeId);

    return (
        <AdminLayout title="Messages">
            <Head title="Admin — Messages" />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <div className="overflow-hidden rounded-sm border border-brand-border bg-brand-surface lg:col-span-2">
                    {MESSAGES.map((m) => (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => setActiveId(m.id)}
                            className={`block w-full border-b border-brand-border/60 p-4 text-left transition last:border-0 ${
                                activeId === m.id ? 'bg-brand-surfaceAlt' : 'hover:bg-brand-surfaceAlt/50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-brand-foreground">{m.name}</span>
                                <span className="text-xs text-brand-foregroundMuted">{m.time}</span>
                            </div>
                            <p className="mt-1 truncate text-sm text-brand-foregroundMuted">{m.message}</p>
                            <div className="mt-2">
                                <StatusBadge status={m.status} />
                            </div>
                        </button>
                    ))}
                </div>

                <div className="rounded-sm border border-brand-border bg-brand-surface p-6 lg:col-span-3">
                    {active && (
                        <>
                            <div className="flex items-start justify-between border-b border-brand-border pb-4">
                                <div>
                                    <h2 className="font-display text-xl text-brand-foreground">{active.name}</h2>
                                    <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-foregroundMuted">
                                        <LuMail className="h-3.5 w-3.5" />
                                        {active.email}
                                    </p>
                                    <p className="mt-0.5 text-sm text-brand-foregroundMuted">{active.phone}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                                        aria-label="Reply"
                                    >
                                        <LuReply className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-danger hover:text-brand-danger"
                                        aria-label="Delete"
                                    >
                                        <LuTrash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="mt-6 leading-relaxed text-brand-foreground">{active.message}</p>

                            <div className="mt-8 border-t border-brand-border pt-6">
                                <textarea
                                    rows={4}
                                    placeholder="Type a reply..."
                                    className="w-full resize-none rounded-sm border border-brand-border bg-brand-background p-4 text-sm text-brand-foreground placeholder:text-brand-foregroundMuted/60 outline-none focus:border-brand-gold"
                                />
                                <button
                                    type="button"
                                    className="mt-3 rounded-sm bg-brand-gold px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight"
                                >
                                    Send Reply
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
