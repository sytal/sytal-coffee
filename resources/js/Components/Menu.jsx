import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LuSearch,
    LuX,
    LuFlame,
    LuBeef,
    LuCupSoda,
    LuCakeSlice,
    LuIceCreamCone,
    LuUtensilsCrossed,
    LuChevronDown,
} from 'react-icons/lu';
import SteamWisps from '@/Components/motion/SteamWisps';
import ImageZoomModal from '@/Components/motion/ImageZoomModal';
import FlipCard from '@/Components/motion/FlipCard';
import { useCart } from '@/lib/CartContext';
import { playUiSound } from '@/lib/uiSound';

const CATEGORY_ICONS = {
    'Loaded Fries': LuFlame,
    Burgers: LuBeef,
    'Shakes & Drinks': LuCupSoda,
    Desserts: LuCakeSlice,
    'Ice Cream': LuIceCreamCone,
};

const FEATURED_COUNT = 3;
const GRID_ROW_CAP = 5;
const GRID_COLS = 3;
const GRID_CAP = GRID_ROW_CAP * GRID_COLS;

export default function Menu({ menuItems = [], menuCategories = [] }) {
    const [activeCategory, setActiveCategory] = useState(menuCategories[0]);
    const [query, setQuery] = useState('');
    const [zoomImage, setZoomImage] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const { addItem } = useCart();

    const handleAddToOrder = (item) => {
        playUiSound('click');
        addItem(item);
    };

    useEffect(() => {
        if (!activeCategory && menuCategories.length > 0) {
            setActiveCategory(menuCategories[0]);
        }
    }, [menuCategories, activeCategory]);

    const isSearching = query.trim().length > 0;

    const items = useMemo(() => {
        if (isSearching) {
            const q = query.trim().toLowerCase();
            return menuItems.filter(
                (item) =>
                    item.name.toLowerCase().includes(q) ||
                    item.description.toLowerCase().includes(q) ||
                    item.tags?.some((tag) => tag.toLowerCase().includes(q))
            );
        }
        return menuItems.filter((item) => item.category === activeCategory);
    }, [activeCategory, query, isSearching, menuItems]);

    useEffect(() => {
        setShowAll(false);
    }, [activeCategory, query]);

    const featuredItems = items.slice(0, FEATURED_COUNT);
    const regularItems = items.slice(FEATURED_COUNT);
    const visibleRegularItems = showAll ? regularItems : regularItems.slice(0, GRID_CAP);
    const hasMore = !showAll && regularItems.length > GRID_CAP;

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
                    <span className="relative mb-3 inline-block font-mono text-xs uppercase tracking-[0.3em] text-brand-gold">
                        <SteamWisps count={3} className="absolute -top-8 left-1/2 h-10 w-10 -translate-x-1/2" />
                        The Tasting Journey
                    </span>
                    <h2 className="font-display text-4xl text-brand-foreground sm:text-5xl">
                        Crafted to Order
                    </h2>
                    <p className="mt-4 text-brand-foregroundMuted">
                        Drag, swipe, or scroll through the menu — one dish at a time, the
                        way it arrives at the table.
                    </p>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="mx-auto mt-10 max-w-md"
                >
                    <div className="relative">
                        <LuSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-foregroundMuted" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search dishes, ingredients…"
                            className="w-full rounded-full border border-brand-border bg-brand-surface py-2.5 pl-11 pr-10 text-sm text-brand-foreground placeholder:text-brand-foregroundMuted/60 outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/40"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-foregroundMuted transition hover:text-brand-gold"
                                aria-label="Clear search"
                            >
                                <LuX className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Category tiles */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`mt-8 transition-opacity ${
                        isSearching ? 'pointer-events-none opacity-40' : 'opacity-100'
                    }`}
                >
                    <div className="scrollbar-hide flex justify-start gap-4 overflow-x-auto px-1 py-1 sm:justify-center">
                        {menuCategories.map((category) => {
                            const Icon = CATEGORY_ICONS[category] ?? LuUtensilsCrossed;
                            const isActive = !isSearching && category === activeCategory;
                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => {
                                        setQuery('');
                                        setActiveCategory(category);
                                    }}
                                    className={`flex shrink-0 flex-col items-center gap-2.5 rounded-2xl px-5 py-4 transition-all duration-300 ${
                                        isActive
                                            ? 'bg-brand-gold shadow-lg shadow-brand-gold/20'
                                            : 'hover:bg-brand-surface'
                                    }`}
                                >
                                    <span
                                        className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
                                            isActive
                                                ? 'border-transparent bg-brand-background text-brand-gold'
                                                : 'border-brand-border bg-brand-surface text-brand-foregroundMuted'
                                        }`}
                                    >
                                        {Icon && <Icon className="h-5 w-5" />}
                                    </span>
                                    <span
                                        className={`text-xs font-semibold uppercase tracking-wider ${
                                            isActive ? 'text-brand-background' : 'text-brand-foregroundMuted'
                                        }`}
                                    >
                                        {category}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {isSearching && (
                    <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-brand-foregroundMuted">
                        {items.length} {items.length === 1 ? 'result' : 'results'} for “{query}”
                    </p>
                )}
            </div>

            {/* Menu grid */}
            <div className="mx-auto mt-14 max-w-6xl px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isSearching ? `search-${query}` : activeCategory}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {items.length === 0 ? (
                            <p className="py-16 text-center text-brand-foregroundMuted">
                                No dishes match your search.
                            </p>
                        ) : (
                            <>
                                {/* Featured dishes */}
                                {featuredItems.length > 0 && (
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {featuredItems.map((item, index) => (
                                            <FlipCard
                                                key={item.id ?? item.name}
                                                item={item}
                                                index={index}
                                                size="featured"
                                                onZoom={() =>
                                                    setZoomImage({ src: item.image, alt: item.name, caption: item.name })
                                                }
                                                onAddToOrder={handleAddToOrder}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Remaining dishes */}
                                {visibleRegularItems.length > 0 && (
                                    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        {visibleRegularItems.map((item, index) => (
                                            <FlipCard
                                                key={item.id ?? item.name}
                                                item={item}
                                                index={index}
                                                size="regular"
                                                onZoom={() =>
                                                    setZoomImage({ src: item.image, alt: item.name, caption: item.name })
                                                }
                                                onAddToOrder={handleAddToOrder}
                                            />
                                        ))}
                                    </div>
                                )}

                                {hasMore && (
                                    <div className="mt-8 flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowAll(true)}
                                            className="flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-brand-foreground transition hover:border-brand-gold hover:text-brand-gold"
                                        >
                                            View All in {isSearching ? 'Results' : activeCategory}
                                            <LuChevronDown className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <ImageZoomModal image={zoomImage} onClose={() => setZoomImage(null)} />
        </section>
    );
}
