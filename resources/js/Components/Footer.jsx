import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiClock } from 'react-icons/fi';
import { useBusiness, socialLinks } from '@/lib/business';
import useSmoothScroll from '@/lib/useSmoothScroll';
import BrandLogo from '@/Components/BrandLogo';

const QUICK_LINKS = [
    { label: 'Home', href: '#home' },
    { label: 'Menu', href: '#menu' },
    { label: 'About', href: '#about' },
    { label: 'Reservations', href: '#reservations' },
    { label: 'Contact', href: '#contact' },
];


const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

function NewsletterForm() {
    const { data, setData, post, reset, processing } = useForm({ email: '' });
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        if (!data.email) return;
        post('/newsletter', {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                reset();
            },
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <input
                type="email"
                required
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="Where the first bite goes"
                className="w-full min-w-0 flex-1 rounded-sm border border-brand-border bg-brand-background px-4 py-2.5 text-sm text-brand-foreground placeholder:text-brand-foregroundMuted/70 focus:border-brand-gold focus:outline-none"
            />
            <button
                type="submit"
                disabled={processing}
                className="shrink-0 rounded-sm border border-brand-gold px-5 py-2.5 text-sm uppercase tracking-wider text-brand-gold transition hover:bg-brand-gold hover:text-brand-background disabled:opacity-60"
            >
                {submitted ? 'Subscribed' : 'Subscribe'}
            </button>
        </form>
    );
}

export default function Footer() {
    const scrollToSection = useSmoothScroll();
    const business = useBusiness();
    const SOCIALS = socialLinks(business);

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
                        <Link href="/" aria-label="KAVO home">
                            <BrandLogo size="lg" tagline />
                        </Link>
                        <p className="text-sm leading-relaxed text-brand-foregroundMuted">
                            Faisalabad's go-to coffee spot — handcrafted coffee, loaded fries, stacked burgers, and
                            desserts worth the drive. Gulberg's favorite hangout.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            {SOCIALS.map(({ label, href, Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
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
                        <nav className="flex flex-col">
                            {QUICK_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(link.href.slice(1));
                                    }}
                                    className="flex min-h-10 items-center text-sm text-brand-foregroundMuted transition hover:text-brand-gold"
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
                                <span>{business.address}</span>
                            </li>
                            {business.phone && (
                                <li className="flex items-start gap-2">
                                    <FiPhone className="mt-0.5 shrink-0 text-brand-gold" size={15} />
                                    <a href={`tel:${business.phone}`} className="hover:text-brand-gold">{business.phone}</a>
                                </li>
                            )}
                            <li className="flex items-start gap-2">
                                <FiClock className="mt-0.5 shrink-0 text-brand-gold" size={15} />
                                <span>{business.hours_label}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-display text-sm uppercase tracking-widest text-brand-gold">
                            Get First Dibs
                        </h3>
                        <p className="text-sm text-brand-foregroundMuted">
                            New menu drops, secret specials, and deals — straight to your inbox.
                        </p>
                        <NewsletterForm />
                    </div>
                </motion.div>

                <div className="mt-14 flex flex-col items-center gap-2 border-t border-brand-border/60 pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
                    <p className="text-xs text-brand-foregroundMuted">
                        &copy; {new Date().getFullYear()} KAVO. All rights reserved.
                    </p>
                    <p className="text-xs text-brand-foregroundMuted">Built with care.</p>
                </div>
            </div>
        </footer>
    );
}
