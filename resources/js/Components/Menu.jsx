import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuSparkles } from 'react-icons/lu';
import { MENU_CATEGORIES, MENU_ITEMS } from '@/data/menuItems';
import TiltCard from '@/Components/motion/TiltCard';

export default function Menu() {
    const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0]);

    const items = useMemo(
        () => MENU_ITEMS.filter((item) => item.category === activeCategory),
        [activeCategory]
    );

    const featured = items[0];
    const rest = items.slice(1);

    return (
        <section className="bg-brand-background py-24">
            <div className="mx-auto max-w-5xl px-6">
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

                <div className="mt-14">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {featured && (
                                <motion.div
                                    key={`featured-${activeCategory}-${featured.name}`}
                                    initial={{ opacity: 0, y: 32, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className="mb-10"
                                >
                                    <TiltCard
                                        className="group relative overflow-hidden rounded-2xl border border-brand-border/60"
                                        maxTilt={6}
                                        scale={1.015}
                                    >
                                        <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
                                            <img
                                                src={featured.image}
                                                alt={featured.name}
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-brand-background/40 to-transparent" />
                                            <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end gap-2 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
                                                <div className="max-w-xl">
                                                    <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-brand-gold/50 bg-brand-background/60 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-brand-gold">
                                                        <LuSparkles className="h-3 w-3" />
                                                        Chef's Pick
                                                    </span>
                                                    <h3 className="font-display text-3xl text-brand-foreground sm:text-4xl">
                                                        {featured.name}
                                                    </h3>
                                                    <p className="mt-2 max-w-md text-sm text-brand-foregroundMuted sm:text-base">
                                                        {featured.description}
                                                    </p>
                                                </div>
                                                <span className="shrink-0 font-display text-2xl text-brand-gold sm:text-3xl">
                                                    {featured.price}
                                                </span>
                                            </div>
                                        </div>
                                    </TiltCard>
                                </motion.div>
                            )}

                            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                                {rest.map((item, index) => (
                                    <motion.div
                                        key={`${activeCategory}-${item.name}`}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                                        className="group flex items-start gap-4 border-b border-brand-border/60 pb-4"
                                    >
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-brand-border">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex flex-1 items-start justify-between gap-4">
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
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
