import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import {
    LuLayoutDashboard,
    LuUtensils,
    LuCalendarCheck,
    LuMessageSquare,
    LuImage,
    LuMenu,
    LuX,
    LuBell,
    LuSearch,
    LuLogOut,
    LuReceipt,
    LuFileText,
    LuPalette,
    LuStore,
} from 'react-icons/lu';
import ToastHost from '@/Components/Admin/ToastHost';
import ConfirmHost from '@/Components/Admin/ConfirmHost';
import { LightboxProvider } from '@/Components/Admin/ImageLightbox';
import { showToast } from '@/lib/toast';
import BrandLogo from '@/Components/BrandLogo';

const NOTIF_POLL_MS = 10000;

// Short two-tone chime via Web Audio — no audio file needed.
function playChime() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [880, 1320].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.18);
            gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + i * 0.18 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.18 + 0.35);
            osc.connect(gain).connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.18);
            osc.stop(ctx.currentTime + i * 0.18 + 0.4);
        });
    } catch {
        // Audio blocked until the first click — ignore.
    }
}

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: LuLayoutDashboard },
    { label: 'Menu Items', href: '/admin/menu', icon: LuUtensils },
    { label: 'Orders', href: '/admin/orders', icon: LuReceipt },
    { label: 'Reservations', href: '/admin/reservations', icon: LuCalendarCheck },
    { label: 'Messages', href: '/admin/messages', icon: LuMessageSquare },
    { label: 'Gallery', href: '/admin/gallery', icon: LuImage },
    { label: 'Website Content', href: '/admin/content', icon: LuFileText },
    { label: 'Appearance', href: '/admin/appearance', icon: LuPalette },
    { label: 'Business Info', href: '/admin/business', icon: LuStore },
];

export default function AdminLayout({ title, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const seenFlashRef = useRef(null);

    function logout() {
        router.post('/logout');
    }

    // Flash messages set via back()->with('success'/'error', ...) on any
    // admin PATCH/POST (status updates, deletes, etc.) now arrive as shared
    // Inertia props — surface them as a toast instead of silently vanishing.
    // Track the flash *object* of each visit (not its text), so the same
    // message twice in a row (e.g. two deletes) still shows each time, and
    // errors are never masked by an older success message.
    useEffect(() => {
        if (!flash || flash === seenFlashRef.current) return;
        seenFlashRef.current = flash;
        if (flash.error) showToast(flash.error, 'error');
        else if (flash.success) showToast(flash.success, 'success');
    }, [flash]);

    // Header search: an order number ("#12" or "12") opens Orders filtered
    // to it; anything else searches the menu.
    function handleGlobalSearch(e) {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get('q')?.toString().trim();
        if (!q) return;
        const target = /^#?\d+$/.test(q) ? '/admin/orders' : '/admin/menu';
        router.get(target, { search: q });
    }

    useEffect(() => {
        let cancelled = false;

        let seen = null;

        async function poll() {
            try {
                const { data } = await axios.get('/admin/notifications');
                if (cancelled) return;
                setNotifications(data);
                const keys = data.map((n) => `${n.type}-${n.id}`);
                const fresh = seen ? data.filter((n) => !seen.has(`${n.type}-${n.id}`)) : [];
                seen = new Set(keys);
                if (fresh.length) {
                    playChime();
                    showToast(fresh.length === 1 ? fresh[0].title : `${fresh.length} new notifications`);
                    // Keep dashboard numbers and lists current without a manual reload.
                    if (window.location.pathname === '/admin') {
                        router.reload({ preserveScroll: true, preserveState: true });
                    }
                    if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
                        new Notification('KAVO Admin', { body: fresh[0].title, icon: '/favicon.svg' });
                    }
                }
            } catch {
                // Best-effort — notifications are a convenience, not critical.
            }
        }

        poll();
        const timer = setInterval(poll, NOTIF_POLL_MS);
        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, []);

    const unreadCount = notifications.length;

    // "(3) Admin — …" in the browser tab so a busy kitchen notices.
    useEffect(() => {
        const base = document.title.replace(/^\(\d+\)\s*/, '');
        document.title = unreadCount ? `(${unreadCount}) ${base}` : base;
    });

    // Ask once for desktop notifications (only shown while the tab is hidden).
    useEffect(() => {
        const ask = () => {
            if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
            window.removeEventListener('click', ask);
        };
        window.addEventListener('click', ask);
        return () => window.removeEventListener('click', ask);
    }, []);

    async function markRead(n) {
        setNotifications((list) => list.filter((x) => !(x.type === n.type && x.id === n.id)));
        try {
            await axios.post('/admin/notifications/read', { type: n.type, id: n.id });
        } catch {
            // Best-effort — next poll will resync the real state.
        }
    }

    async function markAllRead() {
        setNotifications([]);
        try {
            await axios.post('/admin/notifications/read-all');
        } catch {
            // Best-effort — next poll will resync the real state.
        }
    }

    function isActive(href) {
        if (href === '/admin') return currentPath === '/admin';
        return currentPath.startsWith(href);
    }

    return (
        <LightboxProvider>
        <div className="flex min-h-screen bg-brand-background font-sans text-brand-foreground">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 transform border-r border-brand-border bg-brand-surface transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-brand-border px-6">
                    <Link href="/admin" aria-label="KAVO Admin">
                        <BrandLogo size="sm" suffix="Admin" />
                    </Link>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="flex h-10 w-10 items-center justify-center text-brand-foregroundMuted lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <LuX className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex flex-col gap-1 p-4">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-sm px-4 py-2.5 text-sm transition ${
                                    active
                                        ? 'bg-brand-gold text-brand-background'
                                        : 'text-brand-foregroundMuted hover:bg-brand-surfaceAlt hover:text-brand-foreground'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute inset-x-0 bottom-0 border-t border-brand-border p-4">
                    <div className="flex items-center gap-3 rounded-sm bg-brand-surfaceAlt px-4 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold text-sm font-semibold text-brand-background">
                            {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-brand-foreground">{user?.name ?? 'Admin'}</p>
                            <p className="truncate text-xs text-brand-foregroundMuted">{user?.email ?? ''}</p>
                        </div>
                        <button
                            type="button"
                            onClick={logout}
                            aria-label="Log out"
                            className="shrink-0 text-brand-foregroundMuted transition hover:text-brand-gold"
                        >
                            <LuLogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                    aria-hidden
                />
            )}

            {/* Main */}
            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-20 items-center justify-between border-b border-brand-border bg-brand-surface/60 px-6">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="flex h-10 w-10 items-center justify-center text-brand-foregroundMuted lg:hidden"
                            aria-label="Open sidebar"
                        >
                            <LuMenu className="h-5 w-5" />
                        </button>
                        <h1 className="font-display text-xl text-brand-foreground">{title}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <form onSubmit={handleGlobalSearch} role="search" className="relative hidden sm:block">
                            <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-foregroundMuted" />
                            <input
                                type="search"
                                name="q"
                                aria-label="Search menu items or order number"
                                placeholder="Search dishes or order #"
                                className="w-56 rounded-sm border border-brand-border bg-brand-background py-2 pl-9 pr-3 text-sm text-brand-foreground placeholder:text-brand-foregroundMuted/60 outline-none focus:border-brand-gold"
                            />
                        </form>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setNotifOpen((v) => !v)}
                                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                                aria-label="Notifications"
                            >
                                <LuBell className="h-4 w-4" />
                                {unreadCount > 0 && (
                                    <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-danger text-[9px] font-semibold text-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {notifOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setNotifOpen(false)}
                                            aria-hidden
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className="absolute right-0 top-12 z-50 w-80 max-w-[90vw] overflow-hidden rounded-sm border border-brand-border bg-brand-surface shadow-xl"
                                        >
                                            <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
                                                <span className="text-xs uppercase tracking-wider text-brand-foregroundMuted">
                                                    Notifications
                                                </span>
                                                {notifications.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={markAllRead}
                                                        className="text-xs text-brand-gold hover:underline"
                                                    >
                                                        Mark all read
                                                    </button>
                                                )}
                                            </div>
                                            <div className="scrollbar-hide max-h-80 overflow-y-auto">
                                                {notifications.length === 0 && (
                                                    <p className="p-4 text-center text-sm text-brand-foregroundMuted">
                                                        You're all caught up.
                                                    </p>
                                                )}
                                                {notifications.map((n) => (
                                                    <div
                                                        key={`${n.type}-${n.id}`}
                                                        className="flex items-start gap-2 border-b border-brand-border/60 px-4 py-3 text-sm transition last:border-0 hover:bg-brand-surfaceAlt"
                                                    >
                                                        <Link
                                                            href={n.href}
                                                            onClick={() => {
                                                                setNotifOpen(false);
                                                                markRead(n);
                                                            }}
                                                            className="min-w-0 flex-1"
                                                        >
                                                            <p className="text-brand-foreground">{n.title}</p>
                                                            <p className="mt-0.5 truncate text-xs text-brand-foregroundMuted">
                                                                {n.subtitle}
                                                            </p>
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => markRead(n)}
                                                            className="shrink-0 text-xs text-brand-foregroundMuted hover:text-brand-gold"
                                                            aria-label="Mark as read"
                                                        >
                                                            Read
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.button
                            type="button"
                            onClick={() => setNotifOpen(true)}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex w-full items-center justify-center gap-2 overflow-hidden border-b border-brand-gold bg-brand-gold/10 px-6 py-2.5 text-sm text-brand-gold transition hover:bg-brand-gold/20"
                        >
                            <LuBell className="h-4 w-4" />
                            {unreadCount} new notification{unreadCount === 1 ? '' : 's'} — click to view
                        </motion.button>
                    )}
                </AnimatePresence>

                {auth?.is_demo && (
                    <div className="border-b border-brand-border bg-brand-gold/10 px-6 py-2 text-center text-sm text-brand-gold">
                        You are viewing the <strong>demo admin</strong> — feel free to look around. Changes are disabled.
                    </div>
                )}

                <main className="flex-1 overflow-x-hidden p-6">{children}</main>
            </div>

            <ConfirmHost />
            <ToastHost />
        </div>
        </LightboxProvider>
    );
}
