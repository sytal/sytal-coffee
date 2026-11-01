import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';

export default function Hero({
    eyebrow = 'Fine Dining & Coffee House',
    title = 'Sytal Coffee',
    subtitle = 'Where every cup and every plate is crafted with intention.',
    ctaLabel = 'Reserve a Table',
    ctaHref = '/reservations',
    image = null,
}) {
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-background">
            {image && (
                <motion.img
                    src={image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-40"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 8, ease: 'easeOut' }}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-brand-background/60 to-brand-background/30" />

            <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-brand-gold"
                >
                    {eyebrow}
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="font-display text-5xl text-brand-foreground sm:text-7xl"
                >
                    {title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mx-auto mt-6 max-w-xl text-brand-foregroundMuted"
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-10"
                >
                    <Link
                        href={ctaHref}
                        className="inline-block border border-brand-gold px-8 py-3 text-sm uppercase tracking-wider text-brand-gold transition hover:bg-brand-gold hover:text-brand-background"
                    >
                        {ctaLabel}
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
