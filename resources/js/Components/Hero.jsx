import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import KineticText from '@/Components/motion/KineticText';
import Magnetic from '@/Components/motion/Magnetic';
import FloatingElements from '@/Components/motion/FloatingElements';
import CursorSpotlight from '@/Components/motion/CursorSpotlight';

const EASE = [0.16, 1, 0.3, 1];

const DEFAULT_IMAGES = [
    '/images/hero-bg.jpg',
    '/images/fancy-salmon-dish-with-wine-glasses-in-background.jpg',
    '/images/chef-preparing-the-plates.jpg',
    '/images/outdoors-of-the-restaurant.jpg',
    '/images/nicely-plated-food-served-at-decorated-table.jpg',
];

export default function Hero({
    eyebrow = 'Fine Dining & Coffee House',
    title = 'Sytal Coffee',
    subtitle = 'Where every cup and every plate is crafted with intention — a theatrical menu built on fire, precision, and seasonal craft.',
    ctaLabel = 'Reserve a Table',
    ctaHref = '/reservations',
    secondaryLabel = 'View the Menu',
    secondaryHref = '/menu',
    images = DEFAULT_IMAGES,
}) {
    const reduce = useReducedMotion();
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        if (reduce || images.length <= 1) return;
        const id = setInterval(() => {
            setImageIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(id);
    }, [reduce, images.length]);

    const contentY = useTransform(scrollYProgress, [0, 1], [0, -140]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
    const mediaY = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);

    return (
        <section ref={ref} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-brand-background">
            <motion.div
                style={reduce ? undefined : { y: mediaY, scale: mediaScale }}
                className="absolute inset-0 will-change-transform"
            >
                <AnimatePresence mode="sync">
                    <motion.img
                        key={images[imageIndex]}
                        src={images[imageIndex]}
                        alt=""
                        initial={{ opacity: 0, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.4, ease: 'easeInOut' }}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </AnimatePresence>
            </motion.div>

            {images.length > 1 && (
                <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-28">
                    {images.map((src, i) => (
                        <button
                            key={src}
                            type="button"
                            onClick={() => setImageIndex(i)}
                            aria-label={`Show background ${i + 1}`}
                            className="p-1"
                        >
                            <span
                                className={`block h-1.5 rounded-full transition-all duration-300 ${
                                    i === imageIndex ? 'w-5 bg-brand-gold' : 'w-1.5 bg-brand-foreground/30'
                                }`}
                            />
                        </button>
                    ))}
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-brand-background/70 to-brand-background/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-background/60 via-transparent to-transparent" />
            <div aria-hidden className="bg-noise pointer-events-none absolute inset-0" />
            <FloatingElements />
            <CursorSpotlight />

            <motion.div
                style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
                className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center"
            >
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
                    className="font-mono text-xs uppercase tracking-[0.3em] text-brand-gold"
                >
                    {eyebrow}
                </motion.p>

                <KineticText
                    as="h1"
                    text={title}
                    delay={0.35}
                    stagger={0.12}
                    className="mt-5 font-display text-6xl font-light text-brand-foreground sm:text-8xl"
                />

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: EASE, delay: 0.9 }}
                    className="mx-auto mt-7 max-w-xl leading-relaxed text-brand-foregroundMuted"
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: EASE, delay: 1.05 }}
                    className="mt-10 flex flex-wrap items-center justify-center gap-4"
                >
                    <Magnetic strength={0.3}>
                        <Link
                            href={ctaHref}
                            className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-background transition-all duration-300 hover:scale-[1.02] hover:bg-brand-goldLight hover:shadow-lg hover:shadow-brand-gold/20 active:scale-[0.98]"
                        >
                            {ctaLabel}
                        </Link>
                    </Magnetic>
                    <Magnetic strength={0.3}>
                        <Link
                            href={secondaryHref}
                            className="inline-flex items-center justify-center rounded-full border border-brand-foreground/40 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-foreground transition-all duration-300 hover:scale-[1.02] hover:border-brand-foreground/80 active:scale-[0.98]"
                        >
                            {secondaryLabel}
                        </Link>
                    </Magnetic>
                </motion.div>
            </motion.div>

            {!reduce && (
                <motion.div
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 1 }}
                    className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-xs uppercase tracking-[0.3em] text-brand-foreground/70"
                    >
                        Scroll
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
}
