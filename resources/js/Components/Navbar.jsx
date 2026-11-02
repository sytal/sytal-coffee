import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LuMenu, LuX, LuUser, LuLogOut, LuReceipt } from 'react-icons/lu';
import useSmoothScroll from '@/lib/useSmoothScroll';
import { playUiSound } from '@/lib/uiSound';
import SoundToggle from '@/Components/SoundToggle';
import LiveStatusBadge from '@/Components/LiveStatusBadge';

const NAV_LINKS = [
    { label: 'Home', href: '#home' },
    { label: 'Menu', href: '#menu' },
    { label: 'About', href: '#about' },
    { label: 'Reservations', href: '#reservations' },
    { label: 'Contact', href: '#contact' },
];

const panelVariants = {
    hidden: { opacity: 0, y: -12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: 'easeOut', staggerChildren: 0.06, delayChildren: 0.05 },
    },
    exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } },
};

const linkVariants = {
    hidden: { opacity: 0, x: 16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: 16 },
};

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const scrollToSection = useSmoothScroll();
    const { auth } = usePage().props;
    const user = auth?.user;

    function handleLogout() {
        playUiSound('click');
        router.post('/logout');
    }

    useEffect(() => {
        let ticking = false;

        function handleScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                setScrolled(window.scrollY > 80);
                ticking = false;
            });
        }

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const sections = NAV_LINKS.map((link) => document.getElementById(link.href.slice(1))).filter(Boolean);
        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    function handleNavClick(e, href) {
        e.preventDefault();
        setOpen(false);
        playUiSound('click');
        scrollToSection(href.slice(1));
        setActiveSection(href.slice(1));
    }

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
                scrolled
                    ? 'border-brand-border/60 bg-brand-background/95 backdrop-blur'
                    : 'border-transparent bg-transparent backdrop-blur-0'
            }`}
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                <Link href="/" className="font-display text-xl tracking-wide text-brand-foreground">
                    Crunches <span className="text-brand-gold">Cafe</span>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map((link) => {
                        const active = activeSection === link.href.slice(1);
                        return (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className={`relative py-1 text-sm uppercase tracking-wider transition hover:text-brand-gold ${
                                    active ? 'text-brand-gold' : 'text-brand-foregroundMuted'
                                }`}
                            >
                                {link.label}
                                <span
                                    className={`absolute inset-x-0 -bottom-1 h-px bg-brand-gold transition-opacity duration-300 ${
                                        active ? 'opacity-100' : 'opacity-0'
                                    }`}
                                />
                            </a>
                        );
                    })}
                </nav>

                <div className="hidden items-center gap-4 md:flex">
                    <LiveStatusBadge />
                    <SoundToggle />
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/my-orders"
                                className="flex items-center gap-1.5 text-sm text-brand-foregroundMuted transition hover:text-brand-gold"
                            >
                                <LuReceipt className="h-4 w-4" />
                                My Orders
                            </Link>
                            {user.role && ['admin', 'manager'].includes(user.role) && (
                                <Link
                                    href="/admin"
                                    className="text-sm text-brand-foregroundMuted transition hover:text-brand-gold"
                                >
                                    Admin
                                </Link>
                            )}
                            <button
                                type="button"
                                onClick={handleLogout}
                                aria-label="Log out"
                                className="flex items-center gap-1.5 rounded-full border border-brand-border px-4 py-1.5 text-xs uppercase tracking-wider text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                            >
                                <LuLogOut className="h-3.5 w-3.5" />
                                {user.name?.split(' ')[0] ?? 'Sign Out'}
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => playUiSound('click')}
                            className="flex items-center gap-1.5 rounded-full border border-brand-gold/60 px-4 py-1.5 text-xs uppercase tracking-wider text-brand-gold transition hover:bg-brand-gold hover:text-brand-background"
                        >
                            <LuUser className="h-3.5 w-3.5" />
                            Sign In
                        </Link>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="text-2xl text-brand-foreground md:hidden"
                    aria-label="Toggle menu"
                    aria-expanded={open}
                >
                    {open ? <LuX /> : <LuMenu />}
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.nav
                        key="mobile-nav"
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col gap-4 border-t border-brand-border/60 bg-brand-background/95 px-6 py-6 backdrop-blur md:hidden"
                    >
                        {NAV_LINKS.map((link) => {
                            const active = activeSection === link.href.slice(1);
                            return (
                                <motion.div key={link.href} variants={linkVariants}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        className={`block text-sm uppercase tracking-wider transition hover:text-brand-gold ${
                                            active ? 'text-brand-gold' : 'text-brand-foregroundMuted'
                                        }`}
                                    >
                                        {link.label}
                                    </a>
                                </motion.div>
                            );
                        })}
                        <motion.div variants={linkVariants} className="flex items-center justify-between pt-2">
                            <LiveStatusBadge />
                            <SoundToggle />
                        </motion.div>
                        <motion.div variants={linkVariants} className="flex flex-col gap-3 border-t border-brand-border/60 pt-4">
                            {user ? (
                                <>
                                    <Link
                                        href="/my-orders"
                                        className="flex items-center gap-2 text-sm uppercase tracking-wider text-brand-foregroundMuted hover:text-brand-gold"
                                    >
                                        <LuReceipt className="h-4 w-4" />
                                        My Orders
                                    </Link>
                                    {user.role && ['admin', 'manager'].includes(user.role) && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-2 text-sm uppercase tracking-wider text-brand-foregroundMuted hover:text-brand-gold"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-sm uppercase tracking-wider text-brand-foregroundMuted hover:text-brand-gold"
                                    >
                                        <LuLogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 text-sm uppercase tracking-wider text-brand-gold"
                                >
                                    <LuUser className="h-4 w-4" />
                                    Sign In
                                </Link>
                            )}
                        </motion.div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}
