import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LuChevronLeft,
    LuChevronRight,
    LuSearch,
    LuX,
    LuFlame,
    LuBeef,
    LuCupSoda,
    LuCakeSlice,
    LuExpand,
} from 'react-icons/lu';
import { MENU_CATEGORIES, MENU_ITEMS } from '@/data/menuItems';
import SteamWisps from '@/Components/motion/SteamWisps';
import ImageZoomModal from '@/Components/motion/ImageZoomModal';

const CATEGORY_ICONS = {
    'Loaded Fries': LuFlame,
    Burgers: LuBeef,
    'Shakes & Drinks': LuCupSoda,
    Desserts: LuCakeSlice,
};

function pad(n) {
    return String(n + 1).padStart(2, '0');
}

export default function Menu() {
    const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0]);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [showHint, setShowHint] = useState(true);
    const [zoomImage, setZoomImage] = useState(null);
    const trackRef = useRef(null);
    const dragState = useRef({ isDown: false, moved: false, startX: 0, startScrollLeft: 0 });

    const isSearching = query.trim().length > 0;

    const items = useMemo(() => {
        if (isSearching) {
            const q = query.trim().toLowerCase();
            return MENU_ITEMS.filter(
                (item) =>
                    item.name.toLowerCase().includes(q) ||
                    item.description.toLowerCase().includes(q) ||
                    item.tags?.some((tag) => tag.toLowerCase().includes(q))
            );
        }
        return MENU_ITEMS.filter((item) => item.category === activeCategory);
    }, [activeCategory, query, isSearching]);

    useEffect(() => {
        setActiveIndex(0);
        if (trackRef.current) trackRef.current.scrollTo({ left: 0 });
    }, [activeCategory, query]);

    const updateActiveFromScroll = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        const panel = el.querySelector('[data-panel]');
        const panelWidth = panel ? panel.offsetWidth + 24 : el.clientWidth;
        const index = Math.round(el.scrollLeft / panelWidth);
        setActiveIndex(Math.max(0, Math.min(items.length - 1, index)));
        if (showHint) setShowHint(false);
    }, [items.length, showHint]);

    const scrollToIndex = (index) => {
        const el = trackRef.current;
        if (!el) return;
        const panel = el.querySelectorAll('[data-panel]')[index];
        if (panel) {
            el.scrollTo({ left: panel.offsetLeft - el.offsetLeft, behavior: 'smooth' });
        }
        setShowHint(false);
    };

    // Mouse click-and-drag to scroll the strip — native overflow-x-auto only
    // responds to touch/trackpad swipe, not a mouse grab, so this fills that in.
    const handlePointerDown = (e) => {
        const el = trackRef.current;
        if (!el) return;
        dragState.current = { isDown: true, moved: false, startX: e.pageX, startScrollLeft: el.scrollLeft };
    };

    const handlePointerMove = (e) => {
        const state = dragState.current;
        const el = trackRef.current;
        if (!state.isDown || !el) return;
        const delta = e.pageX - state.startX;
        if (Math.abs(delta) > 4) state.moved = true;
        el.scrollLeft = state.startScrollLeft - delta;
        if (showHint) setShowHint(false);
    };

    const endDrag = () => {
        dragState.current.isDown = false;
    };

    const handleTrackClickCapture = (e) => {
        // Suppress click-through (e.g. accidentally opening the zoom button)
        // when the pointer actually dragged rather than tapped.
        if (dragState.current.moved) {
            e.preventDefault();
            e.stopPropagation();
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
                    <p className="relative mb-3 inline-block font-mono text-xs uppercase tracking-[0.3em] text-brand-gold">
                        <SteamWisps count={3} className="absolute -top-8 left-1/2 h-10 w-10 -translate-x-1/2" />
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
                        {MENU_CATEGORIES.map((category) => {
                            const Icon = CATEGORY_ICONS[category];
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

            {/* Full-bleed horizontal tasting strip */}
            <div className="relative mt-14">
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
                            <div
                                ref={trackRef}
                                onScroll={updateActiveFromScroll}
                                onMouseDown={handlePointerDown}
                                onMouseMove={handlePointerMove}
                                onMouseUp={endDrag}
                                onMouseLeave={endDrag}
                                onClickCapture={handleTrackClickCapture}
                                className="scrollbar-hide flex cursor-grab select-none snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 active:cursor-grabbing sm:px-[8vw]"
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
                                            draggable={false}
                                            loading="lazy"
                                            decoding="async"
                                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-brand-background/50 to-brand-background/10" />

                                        <span className="absolute left-6 top-6 font-display text-6xl text-brand-foreground/15 sm:text-7xl">
                                            {pad(index)}
                                        </span>

                                        {isSearching && (
                                            <span className="absolute right-6 top-6 rounded-full border border-brand-gold/40 bg-brand-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-brand-gold">
                                                {item.category}
                                            </span>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setZoomImage({ src: item.image, alt: item.name, caption: item.name })
                                            }
                                            aria-label={`Zoom in on ${item.name}`}
                                            className={`absolute right-4 flex h-9 w-9 items-center justify-center rounded-full border border-brand-foreground/30 bg-brand-background/60 text-brand-foreground backdrop-blur transition hover:border-brand-gold hover:text-brand-gold ${
                                                isSearching ? 'top-16' : 'top-6'
                                            }`}
                                        >
                                            <LuExpand className="h-4 w-4" />
                                        </button>

                                        {/* Swipe cue — only on the very first panel, dismisses on first interaction */}
                                        {index === 0 && (
                                            <AnimatePresence>
                                                {showHint && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center"
                                                    >
                                                        <motion.div
                                                            animate={{ x: [0, 14, 0] }}
                                                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                                                            className="flex items-center gap-2 rounded-full border border-brand-foreground/30 bg-brand-background/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-brand-foreground/80 backdrop-blur"
                                                        >
                                                            <LuChevronLeft className="h-3.5 w-3.5 opacity-60" />
                                                            Swipe to explore
                                                            <LuChevronRight className="h-3.5 w-3.5" />
                                                        </motion.div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        )}

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
                        )}
                    </motion.div>
                </AnimatePresence>

                {items.length > 0 && (
                    <>
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
                    </>
                )}
            </div>

            {/* Progress dots */}
            {items.length > 0 && (
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
            )}

            <ImageZoomModal image={zoomImage} onClose={() => setZoomImage(null)} />
        </section>
    );
}
