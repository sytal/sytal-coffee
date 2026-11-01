import { Link } from '@inertiajs/react';
import { useState } from 'react';

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'About', href: '/about' },
    { label: 'Reservations', href: '/reservations' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-brand-border/60 bg-brand-background/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                <Link href="/" className="font-display text-xl tracking-wide text-brand-foreground">
                    Sytal <span className="text-brand-gold">Coffee</span>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm uppercase tracking-wider text-brand-foregroundMuted transition hover:text-brand-gold"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="text-brand-foreground md:hidden"
                    aria-label="Toggle menu"
                >
                    {open ? '✕' : '☰'}
                </button>
            </div>

            {open && (
                <nav className="flex flex-col gap-4 border-t border-brand-border/60 px-6 py-6 md:hidden">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm uppercase tracking-wider text-brand-foregroundMuted hover:text-brand-gold"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
}
