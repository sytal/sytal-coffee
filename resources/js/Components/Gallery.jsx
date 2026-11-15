import { motion } from 'framer-motion';
import ScrollScale from '@/Components/motion/ScrollScale';
import TiltCard from '@/Components/motion/TiltCard';

// Bento span pattern repeated across the grid, matching the shape of the
// original hand-picked layout (big hero tile, tall tile, then a mix of
// small/wide tiles).
const SPAN_PATTERN = [
    'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2',
    'col-span-1 row-span-2 sm:col-span-1 sm:row-span-2',
    'col-span-1 row-span-1 sm:col-span-1 sm:row-span-1',
    'col-span-2 row-span-1 sm:col-span-2 sm:row-span-1',
    'col-span-1 row-span-1 sm:col-span-1 sm:row-span-1',
    'col-span-1 row-span-1 sm:col-span-1 sm:row-span-1',
    'col-span-1 row-span-1 sm:col-span-2 sm:row-span-1',
    'col-span-1 row-span-1 sm:col-span-1 sm:row-span-1',
];

export default function Gallery({ galleryImages = [] }) {
    const tiles = galleryImages.map((tile, index) => ({
        ...tile,
        span: SPAN_PATTERN[index % SPAN_PATTERN.length],
    }));

    return (
        <section className="bg-brand-surface py-28">
            <div className="mx-auto max-w-7xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-brand-gold">
                        Ambiance
                    </p>
                    <h2 className="font-display text-5xl text-brand-foreground sm:text-6xl">
                        A Space to Savor
                    </h2>
                    <p className="mt-4 text-lg text-brand-foregroundMuted">
                        A glimpse into the KAVO experience — neon lights, loud energy,
                        and unmistakably ours.
                    </p>
                </motion.div>

                <ScrollScale range={[0.82, 1]} className="mt-16">
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:[grid-auto-rows:12rem] sm:[grid-auto-flow:dense]">
                        {tiles.map((tile, index) => (
                            <motion.div
                                key={tile.id ?? tile.label}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                className={`h-48 cursor-pointer sm:h-auto ${tile.span}`}
                            >
                                <TiltCard
                                    className="group relative h-full w-full overflow-hidden rounded-lg border border-brand-border/60"
                                    maxTilt={7}
                                    scale={1.03}
                                >
                                    <img
                                        src={tile.image}
                                        alt={tile.label}
                                        loading="lazy"
                                        decoding="async"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-background/80 via-brand-background/10 to-transparent" />

                                    <div className="relative flex h-full flex-col items-end justify-end p-4">
                                        <span className="font-display text-sm uppercase tracking-[0.2em] text-brand-foreground">
                                            {tile.label}
                                        </span>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>
                </ScrollScale>
            </div>
        </section>
    );
}
