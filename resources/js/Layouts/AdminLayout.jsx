import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
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
} from 'react-icons/lu';

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: LuLayoutDashboard },
    { label: 'Menu Items', href: '/admin/menu', icon: LuUtensils },
    { label: 'Reservations', href: '/admin/reservations', icon: LuCalendarCheck },
    { label: 'Messages', href: '/admin/messages', icon: LuMessageSquare },
    { label: 'Gallery', href: '/admin/gallery', icon: LuImage },
];

export default function AdminLayout({ title, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const user = usePage().props.auth?.user;

    function logout() {
        router.post('/logout');
    }

    function isActive(href) {
        if (href === '/admin') return currentPath === '/admin';
        return currentPath.startsWith(href);
    }

    return (
        <div className="flex min-h-screen bg-brand-background font-sans text-brand-foreground">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 transform border-r border-brand-border bg-brand-surface transition-transform duration-300 lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-brand-border px-6">
                    <Link href="/" className="font-display text-lg tracking-wide text-brand-foreground">
                        Crunches <span className="text-brand-gold">Admin</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="text-brand-foregroundMuted lg:hidden"
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
                            className="text-brand-foregroundMuted lg:hidden"
                            aria-label="Open sidebar"
                        >
                            <LuMenu className="h-5 w-5" />
                        </button>
                        <h1 className="font-display text-xl text-brand-foreground">{title}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-foregroundMuted" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-56 rounded-sm border border-brand-border bg-brand-background py-2 pl-9 pr-3 text-sm text-brand-foreground placeholder:text-brand-foregroundMuted/60 outline-none focus:border-brand-gold"
                            />
                        </div>
                        <button
                            type="button"
                            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                            aria-label="Notifications"
                        >
                            <LuBell className="h-4 w-4" />
                            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-danger" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden p-6">{children}</main>
            </div>
        </div>
    );
}
