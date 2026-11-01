import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { MENU_CATEGORIES, MENU_ITEMS } from '@/data/menuItems';

function pad(n) {
    return String(n + 1).padStart(2, '0');
}

export default function Menu() {
    const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0]);
    const [activeIndex, setActiveIndex] = useState(0);
    const trackRef = useRef(null);

    const items = useMemo(
        () => MENU_ITEMS.filter((item) => item.category === activeCategory),
        [activeCategory]
    );

    useEffect(() => {
        setActiveIndex(0);
        if (trackRef.current) trackRef.current.scrollTo({ left: 0 });
    }, [activeCategory]);

    const updateActiveFromScroll = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        const panel = el.querySelector('[data-panel]');
        const panelWidth = panel ? panel.offsetWidth + 24 : el.clientWidth;
        const index = Math.round(el.scrollLeft / panelWidth);
        setActiveIndex(Math.max(0, Math.min(items.length - 1, index)));
    }, [items.length]);

    const scrollToIndex = (index) => {
        const el = trackRef.current;
        if (!el) return;
        const panel = el.querySelectorAll('[data-panel]')[index];
        if (panel) {
            el.scrollTo({ left: panel.offsetLeft - el.offsetLeft, behavior: 'smooth' });
        }
    };

    return (
        <section className="overflow-hidden bg-brand-background py-24">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-brand-gold">
                        The Tasting Journey
                    </p>
                    <h2 className="font-display text-4xl text-brand-foreground sm:text-5xl">
                        Crafted to Order
                    </h2>
                    <p className="mt-4 text-brand-foregroundMuted">
                        Drag, swipe, or scroll through the menu — one dish at a time, the
                        way it arrives at the table.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-12 flex flex-wrap justify-center gap-3"
                >
                    {MENU_CATEGORIES.map((category) => {
                        const isActive = category === activeCategory;
                        return (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategory(category)}
                                className={`rounded-full border px-5 py-2 text-sm uppercase tracking-wider transition ${
                                    isActive
                                        ? 'border-brand-gold bg-brand-gold text-brand-background'
                                        : 'border-brand-border text-brand-foregroundMuted hover:border-brand-gold hover:text-brand-gold'
                                }`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </motion.div>
            </div>

            {/* Full-bleed horizontal tasting strip */}
            <div className="relative mt-14">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div
                            ref={trackRef}
                            onScroll={updateActiveFromScroll}
                            className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 sm:px-[8vw]"
                        >
                            {items.map((item, index) => (
                                <div
                                    key={item.name}
                                    data-panel
                                    className="group relative h-[70vh] min-h-[460px] w-[82vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-brand-border/60 sm:w-[48vw] lg:w-[34vw]"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-brand-background/50 to-brand-background/10" />

                                    <span className="absolute left-6 top-6 font-display text-6xl text-brand-foreground/15 sm:text-7xl">
                                        {pad(index)}
                                    </span>

                                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                                        <div className="mb-3 flex flex-wrap gap-1.5">
                                            {item.tags?.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full border border-brand-gold/40 bg-brand-background/50 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-brand-gold"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="font-display text-2xl leading-tight text-brand-foreground sm:text-3xl">
                                            {item.name}
                                        </h3>
                                        <p className="mt-2 text-sm text-brand-foregroundMuted">
                                            {item.description}
                                        </p>
                                        <span className="mt-3 inline-block font-display text-xl text-brand-gold">
                                            {item.price}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* Trailing spacer so the last panel can reach center on wide screens */}
                            <div className="w-px shrink-0 sm:w-[calc(50vw-17vw-24px)]" aria-hidden />
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Nav arrows — desktop only */}
                <button
                    type="button"
                    onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
                    className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border/60 bg-brand-background/80 text-brand-foreground backdrop-blur transition hover:border-brand-gold hover:text-brand-gold lg:flex"
                    aria-label="Previous dish"
                >
                    <LuChevronLeft className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    onClick={() => scrollToIndex(Math.min(items.length - 1, activeIndex + 1))}
                    className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border/60 bg-brand-background/80 text-brand-foreground backdrop-blur transition hover:border-brand-gold hover:text-brand-gold lg:flex"
                    aria-label="Next dish"
                >
                    <LuChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* Progress dots */}
            <div className="mt-6 flex items-center justify-center gap-2">
                {items.map((item, index) => (
                    <button
                        key={item.name}
                        type="button"
                        onClick={() => scrollToIndex(index)}
                        aria-label={`Go to ${item.name}`}
                        className="p-1.5"
                    >
                        <span
                            className={`block h-1.5 rounded-full transition-all duration-300 ${
                                index === activeIndex
                                    ? 'w-6 bg-brand-gold'
                                    : 'w-1.5 bg-brand-border'
                            }`}
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}
