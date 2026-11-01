import { motion } from 'framer-motion';
import SteamWisps from '@/Components/motion/SteamWisps';
import useSmoothScroll from '@/lib/useSmoothScroll';
import { playUiSound } from '@/lib/uiSound';

const CRAVE_ITEMS = [
    { image: '/images/fire-from-wok.jpg', word: 'Sizzling', steam: true },
    { image: '/images/menu/lobster-roll.jpg', word: 'Loaded', steam: false },
    { image: '/images/menu/cake.jpg', word: 'Molten', steam: false },
    { image: '/images/chef-preparing-the-plates.jpg', word: 'Fresh Off the Grill', steam: true },
];

export default function CraveBreak() {
    const scrollToSection = useSmoothScroll();

    return (
        <section className="relative overflow-hidden bg-brand-surface py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-xl text-center"
                >
                    <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-brand-gold">
                        Before You Order
                    </p>
                    <h2 className="font-display text-3xl text-brand-foreground sm:text-4xl">
                        Still deciding?
                    </h2>
                </motion.div>

                <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {CRAVE_ITEMS.map((item, index) => (
                        <motion.div
                            key={item.word}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            whileHover={{ scale: 1.03 }}
                            onHoverStart={() => playUiSound('sizzle')}
                            className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-brand-border/60"
                        >
                            <img
                                src={item.image}
                                alt={item.word}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {item.steam && (
                                <SteamWisps
                                    count={2}
                                    className="absolute left-1/2 top-3 h-8 w-8 -translate-x-1/2"
                                />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-brand-background/90 via-brand-background/10 to-transparent" />

                            {/* Shimmer sweep on hover */}
                            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

                            <span className="absolute bottom-3 left-3 right-3 font-display text-base leading-tight text-brand-foreground sm:text-xl">
                                {item.word}
                            </span>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-10 text-center"
                >
                    <button
                        type="button"
                        onClick={() => {
                            playUiSound('click');
                            scrollToSection('menu');
                        }}
                        className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-brand-gold transition hover:text-brand-goldLight"
                    >
                        Hungry yet? See the full menu
                        <motion.span
                            animate={{ y: [0, 4, 0] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            &darr;
                        </motion.span>
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
