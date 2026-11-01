import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiInstagram, FiFacebook, FiTwitter, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';

const QUICK_LINKS = [
    { label: 'Home', href: '#home' },
    { label: 'Menu', href: '#menu' },
    { label: 'About', href: '#about' },
    { label: 'Reservations', href: '#reservations' },
    { label: 'Contact', href: '#contact' },
];

function scrollToSection(e, href) {
    e.preventDefault();
    const target = document.getElementById(href.slice(1));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const SOCIALS = [
    { label: 'Instagram', href: 'https://instagram.com', Icon: FiInstagram },
    { label: 'Facebook', href: 'https://facebook.com', Icon: FiFacebook },
    { label: 'Twitter', href: 'https://twitter.com', Icon: FiTwitter },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        if (!email) return;
        setSubmitted(true);
        setEmail('');
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
            <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full flex-1 rounded-sm border border-brand-border bg-brand-background px-4 py-2.5 text-sm text-brand-foreground placeholder:text-brand-foregroundMuted/70 focus:border-brand-gold focus:outline-none"
            />
            <button
                type="submit"
                className="shrink-0 rounded-sm border border-brand-gold px-5 py-2.5 text-sm uppercase tracking-wider text-brand-gold transition hover:bg-brand-gold hover:text-brand-background"
            >
                {submitted ? 'Subscribed' : 'Subscribe'}
            </button>
        </form>
    );
}

export default function Footer() {
    return (
        <footer className="border-t border-brand-border/60 bg-brand-surface">
            <div className="mx-auto max-w-6xl px-6 py-16">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4"
                >
                    <div className="flex flex-col gap-4 lg:col-span-1">
                        <Link href="/" className="font-display text-2xl tracking-wide text-brand-foreground">
                            Sytal <span className="text-brand-gold">Coffee</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-brand-foregroundMuted">
                            A quiet corner of fine coffee and considered dining — crafted with care, served with warmth.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            {SOCIALS.map(({ label, href, Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-display text-sm uppercase tracking-widest text-brand-gold">
                            Quick Links
                        </h3>
                        <nav className="flex flex-col gap-3">
                            {QUICK_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => scrollToSection(e, link.href)}
                                    className="text-sm text-brand-foregroundMuted transition hover:text-brand-gold"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-display text-sm uppercase tracking-widest text-brand-gold">
                            Visit Us
                        </h3>
                        <ul className="flex flex-col gap-3 text-sm text-brand-foregroundMuted">
                            <li className="flex items-start gap-2">
                                <FiMapPin className="mt-0.5 shrink-0 text-brand-gold" size={15} />
                                <span>128 Harborlight Avenue, Suite 4, Rivermark</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <FiPhone className="mt-0.5 shrink-0 text-brand-gold" size={15} />
                                <span>(555) 014-2290</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <FiClock className="mt-0.5 shrink-0 text-brand-gold" size={15} />
                                <span>Tue&ndash;Sun, 8am&ndash;10pm</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-display text-sm uppercase tracking-widest text-brand-gold">
                            Stay in Touch
                        </h3>
                        <p className="text-sm text-brand-foregroundMuted">
                            Seasonal menus, tastings, and news — no spam, just coffee.
                        </p>
                        <NewsletterForm />
                    </div>
                </motion.div>

                <div className="mt-14 flex flex-col items-center gap-2 border-t border-brand-border/60 pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
                    <p className="text-xs text-brand-foregroundMuted">
                        &copy; {new Date().getFullYear()} Sytal Coffee. All rights reserved.
                    </p>
                    <p className="text-xs text-brand-foregroundMuted">Built with care.</p>
                </div>
            </div>
        </footer>
    );
}
