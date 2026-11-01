import { motion } from 'framer-motion';
import { LuCoffee, LuFlame, LuLeaf, LuUtensils, LuWine, LuSparkles } from 'react-icons/lu';

// NOTE: These are elegant CSS-only placeholder tiles standing in for real
// restaurant/ambiance photography. Swap each tile's gradient div for an
// <img> (or background-image) once photos are available — keep the same
// grid structure and hover/motion treatment.
const GALLERY_TILES = [
    { icon: LuCoffee, label: 'The Roastery Bar', span: 'sm:row-span-2' },
    { icon: LuFlame, label: 'Open Kitchen', span: '' },
    { icon: LuLeaf, label: 'Garden Terrace', span: '' },
    { icon: LuUtensils, label: 'The Dining Room', span: '' },
    { icon: LuWine, label: 'Evening Service', span: 'sm:row-span-2' },
    { icon: LuSparkles, label: 'Private Lounge', span: '' },
];

const GRADIENTS = [
    'from-brand-surface via-brand-surfaceAlt to-brand-background',
    'from-brand-surfaceAlt via-brand-border to-brand-surface',
    'from-brand-background via-brand-surface to-brand-surfaceAlt',
    'from-brand-surfaceAlt via-brand-background to-brand-surface',
    'from-brand-surface via-brand-background to-brand-surfaceAlt',
    'from-brand-border via-brand-surfaceAlt to-brand-background',
];

export default function Gallery() {
    return (
        <section className="bg-brand-surface py-24">
            <div className="mx-auto max-w-6xl px-6">
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
                    <h2 className="font-display text-4xl text-brand-foreground sm:text-5xl">
                        A Space to Savor
                    </h2>
                    <p className="mt-4 text-brand-foregroundMuted">
                        A glimpse into the atmosphere of Sytal Coffee — warm, considered,
                        and unmistakably ours.
                    </p>
                </motion.div>

                <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:[grid-template-rows:repeat(2,14rem)]">
                    {GALLERY_TILES.map((tile, index) => {
                        const Icon = tile.icon;
                        return (
                            <motion.div
                                key={tile.label}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                                whileHover={{ scale: 1.03 }}
                                className={`group relative h-40 overflow-hidden rounded-lg border border-brand-border/60 sm:h-full ${tile.span}`}
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} transition-transform duration-500 group-hover:scale-110`}
                                />
                                <div className="absolute inset-0 bg-brand-background/20 transition-opacity duration-500 group-hover:bg-brand-background/10" />

                                <div className="relative flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
                                    <Icon className="h-7 w-7 text-brand-gold/80 transition-transform duration-500 group-hover:scale-110" />
                                    <span className="text-xs uppercase tracking-[0.2em] text-brand-foregroundMuted opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                        {tile.label}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
