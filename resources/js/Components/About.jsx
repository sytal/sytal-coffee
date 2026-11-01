import { motion } from 'framer-motion';
import MaskWipe from '@/Components/motion/MaskWipe';
import CountUp from '@/Components/motion/CountUp';

const STATS = [
    { label: 'Years of Craft', value: '12+' },
    { label: 'Signature Dishes', value: '48' },
    { label: 'Culinary Awards', value: '9' },
    { label: 'Beans Sourced Direct', value: '100%' },
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
};

export default function About() {
    return (
        <section className="bg-brand-background py-24 sm:py-32">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
                <motion.div
                    {...fadeUp}
                    transition={{ duration: 0.7 }}
                >
                    <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-brand-gold">
                        Our Story
                    </p>
                    <h2 className="font-display text-4xl text-brand-foreground sm:text-5xl">
                        A House Built on Patience &amp; Fire
                    </h2>
                    <p className="mt-6 text-brand-foregroundMuted">
                        Sytal Coffee began as a single roaster in the back of a corner
                        kitchen, where the owners refused to rush a bean or a broth.
                        Today that same philosophy guides every plate and every pour:
                        slow extraction, honest sourcing, and a dining room that feels
                        like a quiet indulgence rather than a performance.
                    </p>
                    <p className="mt-4 text-brand-foregroundMuted">
                        We pair single-origin coffee with a seasonal, chef-driven menu,
                        treating the cup and the course as one continuous experience —
                        considered, unhurried, and built to be remembered.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mt-12 grid grid-cols-2 gap-8 border-t border-brand-border pt-10 sm:grid-cols-4"
                    >
                        {STATS.map((stat) => (
                            <div key={stat.label}>
                                <CountUp
                                    value={stat.value}
                                    className="font-display text-3xl text-brand-gold"
                                />
                                <p className="mt-1 text-xs uppercase tracking-wider text-brand-foregroundMuted">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                <MaskWipe
                    direction="up"
                    duration={1.1}
                    className="relative aspect-[4/5] rounded-sm border border-brand-border"
                >
                    <img
                        src="/images/about.jpg"
                        alt="Inside Sytal Coffee"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-background/70 via-transparent to-brand-goldDark/10" />
                </MaskWipe>
            </div>
        </section>
    );
}
