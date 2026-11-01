import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuExpand, LuRotateCcw } from 'react-icons/lu';

/**
 * Reusable 3D flip card used by the Menu grid. Click anywhere on the card
 * to flip it over and reveal the dish's description/tags as text on the
 * back face. A diagonal shimmer sweeps across the card at the moment of
 * flipping, in the same spirit as the hover-shimmer in CraveBreak.jsx.
 *
 * `size` controls image aspect ratio / text scale: 'featured' | 'regular'.
 */
export default function FlipCard({ item, index, size = 'regular', onZoom }) {
    const [flipped, setFlipped] = useState(false);
    const [shimmerKey, setShimmerKey] = useState(0);

    const handleFlip = () => {
        setFlipped((f) => !f);
        setShimmerKey((k) => k + 1);
    };

    const isFeatured = size === 'featured';

    return (
        <div
            className={`group relative [perspective:1600px] ${
                isFeatured ? 'h-[26rem] sm:h-[28rem]' : 'h-72 sm:h-80'
            }`}
        >
            <motion.div
                role="button"
                tabIndex={0}
                aria-label={`${item.name} — tap to ${flipped ? 'hide' : 'show'} details`}
                onClick={handleFlip}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleFlip();
                    }
                }}
                className="relative h-full w-full cursor-pointer [transform-style:preserve-3d]"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.65, ease: [0.4, 0.0, 0.2, 1] }}
            >
                {/* Front face */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl border border-brand-border/60 bg-brand-surface [backface-visibility:hidden]">
                    <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-brand-background/45 to-transparent" />

                    {/* Shimmer sweep, replayed each time the card is clicked */}
                    <AnimatePresence>
                        <motion.div
                            key={shimmerKey}
                            initial={{ x: '-120%', opacity: 0.9 }}
                            animate={{ x: '120%', opacity: 0 }}
                            transition={{ duration: 0.75, ease: 'easeOut' }}
                            className="pointer-events-none absolute inset-0 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent"
                        />
                    </AnimatePresence>

                    {typeof index === 'number' && (
                        <span className="absolute left-3 top-3 font-display text-xl text-brand-foreground/25 sm:text-2xl">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    )}

                    {onZoom && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onZoom();
                            }}
                            aria-label={`Zoom in on ${item.name}`}
                            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-brand-foreground/30 bg-brand-background/60 text-brand-foreground backdrop-blur transition hover:border-brand-gold hover:text-brand-gold"
                        >
                            <LuExpand className="h-4 w-4" />
                        </button>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        {isFeatured && (
                            <div className="mb-2 flex flex-wrap gap-1.5">
                                {item.tags?.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-brand-gold/40 bg-brand-background/50 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-brand-gold"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        <h3
                            className={`font-display leading-tight text-brand-foreground ${
                                isFeatured ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                            }`}
                        >
                            {item.name}
                        </h3>
                        <span
                            className={`mt-1 inline-block font-display text-brand-gold ${
                                isFeatured ? 'text-lg' : 'text-sm'
                            }`}
                        >
                            {item.price}
                        </span>
                    </div>
                </div>

                {/* Back face */}
                <div className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-brand-gold/40 bg-brand-surface p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                        <h3
                            className={`font-display leading-tight text-brand-foreground ${
                                isFeatured ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                            }`}
                        >
                            {item.name}
                        </h3>
                        <LuRotateCcw className="mt-1 h-4 w-4 shrink-0 text-brand-foregroundMuted" />
                    </div>

                    <p className="mt-3 flex-1 overflow-y-auto text-sm leading-relaxed text-brand-foregroundMuted">
                        {item.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.tags?.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-brand-gold/40 bg-brand-background/50 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-brand-gold"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <span className="font-display text-brand-gold">{item.price}</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-brand-foregroundMuted">
                            Tap to flip back
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
