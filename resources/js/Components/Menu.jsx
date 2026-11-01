import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_CATEGORIES, MENU_ITEMS } from '@/data/menuItems';

export default function Menu() {
    const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0]);

    const items = useMemo(
        () => MENU_ITEMS.filter((item) => item.category === activeCategory),
        [activeCategory]
    );

    return (
        <section className="bg-brand-background py-24">
            <div className="mx-auto max-w-5xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
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
                    viewport={{ once: true }}
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

                <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                    <AnimatePresence mode="wait">
                        {items.map((item, index) => (
                            <motion.div
                                key={`${activeCategory}-${item.name}`}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="flex items-start justify-between gap-4 border-b border-brand-border/60 pb-4"
                            >
                                <div>
                                    <h3 className="font-display text-xl text-brand-foreground">
                                        {item.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-brand-foregroundMuted">
                                        {item.description}
                                    </p>
                                </div>
                                <span className="shrink-0 font-display text-lg text-brand-gold">
                                    {item.price}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
