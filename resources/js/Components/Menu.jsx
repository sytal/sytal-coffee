import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_CATEGORIES, MENU_ITEMS } from '@/data/menuItems';

export default function Menu() {
    const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0]);

    const items = useMemo(
        () => MENU_ITEMS.filter((item) => item.category === activeCategory),
        [activeCategory]
    );

    const [activeName, setActiveName] = useState(items[0]?.name);

    useEffect(() => {
        setActiveName(items[0]?.name);
    }, [activeCategory]);

    const activeItem = items.find((item) => item.name === activeName) ?? items[0];

    return (
        <section className="bg-brand-background py-24">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-brand-gold">
                        Our Menu
                    </p>
                    <h2 className="font-display text-4xl text-brand-foreground sm:text-5xl">
                        Crafted to Order
                    </h2>
                    <p className="mt-4 text-brand-foregroundMuted">
                        From morning brews to evening plates, every item is prepared with
                        intention and the finest seasonal ingredients.
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

                <div className="mt-14 grid gap-10 lg:grid-cols-5 lg:items-start lg:gap-12">
                    {/* Sticky showcase image — desktop only */}
                    <div className="hidden lg:sticky lg:top-28 lg:col-span-2 lg:block">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-brand-border/60">
                            <AnimatePresence mode="wait">
                                {activeItem && (
                                    <motion.img
                                        key={activeItem.name}
                                        src={activeItem.image}
                                        alt={activeItem.name}
                                        initial={{ opacity: 0, scale: 1.06 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                )}
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-brand-background/20 to-transparent" />

                            <div className="absolute inset-x-0 bottom-0 p-6">
                                <AnimatePresence mode="wait">
                                    {activeItem && (
                                        <motion.div
                                            key={activeItem.name}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.4, delay: 0.1 }}
                                        >
                                            <div className="mb-3 flex flex-wrap gap-2">
                                                {activeItem.tags?.map((tag, i) => (
                                                    <motion.span
                                                        key={tag}
                                                        initial={{ opacity: 0, scale: 0.85 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
                                                        className="rounded-full border border-brand-gold/40 bg-brand-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-brand-gold"
                                                    >
                                                        {tag}
                                                    </motion.span>
                                                ))}
                                            </div>
                                            <h3 className="font-display text-2xl text-brand-foreground">
                                                {activeItem.name}
                                            </h3>
                                            <p className="mt-1 text-sm text-brand-foregroundMuted">
                                                {activeItem.description}
                                            </p>
                                            <span className="mt-2 inline-block font-display text-xl text-brand-gold">
                                                {activeItem.price}
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable list */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="divide-y divide-brand-border/60"
                            >
                                {items.map((item, index) => {
                                    const isActive = item.name === activeName;
                                    return (
                                        <motion.button
                                            key={item.name}
                                            type="button"
                                            onMouseEnter={() => setActiveName(item.name)}
                                            onFocus={() => setActiveName(item.name)}
                                            onClick={() => setActiveName(item.name)}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.05 }}
                                            className={`group flex w-full flex-col gap-2 py-5 text-left transition sm:flex-row sm:items-start sm:justify-between sm:gap-6 ${
                                                isActive ? 'px-4 -mx-4 rounded-lg bg-brand-surface/60' : ''
                                            }`}
                                        >
                                            {/* Mobile-only thumbnail since there's no sticky panel below lg */}
                                            <div className="flex items-start gap-4 sm:contents">
                                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-brand-border lg:hidden">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-baseline justify-between gap-4">
                                                        <h3
                                                            className={`font-display text-xl transition-colors ${
                                                                isActive ? 'text-brand-gold' : 'text-brand-foreground'
                                                            }`}
                                                        >
                                                            {item.name}
                                                        </h3>
                                                        <span className="shrink-0 font-display text-lg text-brand-gold sm:hidden">
                                                            {item.price}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-sm text-brand-foregroundMuted">
                                                        {item.description}
                                                    </p>

                                                    {/* Ingredient tags — pop in on hover/active, compact on mobile */}
                                                    <AnimatePresence>
                                                        {isActive && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.25 }}
                                                                className="mt-2 flex flex-wrap gap-1.5 overflow-hidden lg:hidden"
                                                            >
                                                                {item.tags?.map((tag) => (
                                                                    <span
                                                                        key={tag}
                                                                        className="rounded-full border border-brand-gold/40 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-brand-gold"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            <span className="hidden shrink-0 font-display text-lg text-brand-gold sm:block">
                                                {item.price}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
