import { motion } from 'framer-motion';
import ScrollScale from '@/Components/motion/ScrollScale';

const GALLERY_TILES = [
    { image: '/images/outdoors-of-the-restaurant.jpg', label: 'The Terrace', span: 'sm:row-span-2' },
    { image: '/images/fire-from-wok.jpg', label: 'Open Kitchen', span: '' },
    { image: '/images/gallery/gallery-2.jpg', label: 'The Dining Room', span: '' },
    { image: '/images/gallery/gallery-4.jpg', label: 'Evening Service', span: '' },
    { image: '/images/chef-preparing-the-plates.jpg', label: 'In the Kitchen', span: 'sm:row-span-2' },
    { image: '/images/gallery/gallery-6.jpg', label: 'Private Lounge', span: '' },
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

                <ScrollScale range={[0.82, 1]} className="mt-14">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:[grid-template-rows:repeat(2,14rem)]">
                        {GALLERY_TILES.map((tile, index) => (
                            <motion.div
                                key={tile.label}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                whileHover={{ scale: 1.03, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                                className={`group relative h-40 overflow-hidden rounded-lg border border-brand-border/60 sm:h-full ${tile.span}`}
                            >
                                <img
                                    src={tile.image}
                                    alt={tile.label}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-background/80 via-brand-background/10 to-transparent" />

                                <div className="relative flex h-full flex-col items-end justify-end p-4">
                                    <span className="font-display text-sm uppercase tracking-[0.2em] text-brand-foreground">
                                        {tile.label}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollScale>
            </div>
        </section>
    );
}
