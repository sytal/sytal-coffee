import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import { LuTrash2, LuReply, LuMail } from 'react-icons/lu';

export default function Messages({ messages = [] }) {
    const [activeId, setActiveId] = useState(messages[0]?.id ?? null);
    const active = messages.find((m) => m.id === activeId) ?? messages[0];
    const [reply, setReply] = useState('');

    // There's no outgoing mail server wired up, so replies open the admin's
    // own email app, pre-addressed to the customer with the typed text.
    function mailtoFor(message, body = '') {
        const subject = encodeURIComponent('Re: your message to Crunches Cafe');
        return `mailto:${message.email}?subject=${subject}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
    }

    function selectMessage(message) {
        setActiveId(message.id);
        if (message.status === 'New') {
            router.patch(`/admin/messages/${message.id}/read`, {}, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    }

    function handleDelete(message) {
        if (!window.confirm(`Delete the message from ${message.name}?`)) return;
        router.delete(`/admin/messages/${message.id}`, { preserveScroll: true });
    }

    return (
        <AdminLayout title="Messages">
            <Head title="Admin — Messages" />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <div className="overflow-hidden rounded-sm border border-brand-border bg-brand-surface lg:col-span-2">
                    {messages.map((m) => (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => selectMessage(m)}
                            className={`block w-full border-b border-brand-border/60 p-4 text-left transition last:border-0 ${
                                activeId === m.id ? 'bg-brand-surfaceAlt' : 'hover:bg-brand-surfaceAlt/50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-brand-foreground">{m.name}</span>
                                <span className="text-xs text-brand-foregroundMuted">
                                    {new Date(m.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="mt-1 truncate text-sm text-brand-foregroundMuted">{m.message}</p>
                            <div className="mt-2">
                                <StatusBadge status={m.status} />
                            </div>
                        </button>
                    ))}
                    {messages.length === 0 && (
                        <p className="p-8 text-center text-sm text-brand-foregroundMuted">No messages yet.</p>
                    )}
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
                                    <a
                                        href={mailtoFor(active)}
                                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                                        aria-label="Reply by email"
                                    >
                                        <LuReply className="h-4 w-4" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(active)}
                                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-danger hover:text-brand-danger"
                                        aria-label="Delete"
                                    >
                                        <LuTrash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="mt-6 whitespace-pre-line break-words leading-relaxed text-brand-foreground [overflow-wrap:anywhere]">{active.message}</p>

                            <div className="mt-8 border-t border-brand-border pt-6">
                                <textarea
                                    rows={4}
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    placeholder="Type a reply. It opens in your email app, addressed to the customer."
                                    className="w-full resize-none rounded-sm border border-brand-border bg-brand-background p-4 text-sm text-brand-foreground placeholder:text-brand-foregroundMuted/60 outline-none focus:border-brand-gold"
                                />
                                <a
                                    href={mailtoFor(active, reply)}
                                    className="mt-3 inline-block rounded-sm bg-brand-gold px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight"
                                >
                                    Reply by Email
                                </a>
                            </div>
                        </>
                    )}
                    {!active && (
                        <p className="py-16 text-center text-sm text-brand-foregroundMuted">
                            Messages from the website's contact form will show up here.
                        </p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
