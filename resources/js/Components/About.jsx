import { motion } from 'framer-motion';
import CountUp from '@/Components/motion/CountUp';
import KineticText from '@/Components/motion/KineticText';

const STATS = [
    { label: 'Years of Craft', value: '12+' },
    { label: 'Signature Dishes', value: '48' },
    { label: 'Culinary Awards', value: '9' },
    { label: 'Beans Sourced Direct', value: '100%' },
];

const PARAGRAPHS = [
    `Sytal Coffee began as a single roaster in the back of a corner
    kitchen, where the owners refused to rush a bean or a broth. Every
    batch was tended by hand, every pour measured against patience
    rather than the clock.`,
    `Today that same philosophy guides every plate and every pour: slow
    extraction, honest sourcing, and a dining room that feels like a
    quiet indulgence rather than a performance.`,
    `We pair single-origin coffee with a seasonal, chef-driven menu,
    treating the cup and the course as one continuous experience —
    considered, unhurried, and built to be remembered.`,
    `From the first roast to the last course, nothing leaves our kitchen
    until it has earned its place on the table. That standard hasn't
    changed since the day we opened the doors.`,
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
};

export default function About() {
    return (
        <section className="relative bg-brand-background py-24 sm:py-32">
            <div aria-hidden className="bg-noise pointer-events-none absolute inset-0" />
            <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:items-start">
                <div>
                    <motion.p
                        {...fadeUp}
                        transition={{ duration: 0.7 }}
                        className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-brand-gold"
                    >
                        Our Story
                    </motion.p>

                    <KineticText
                        as="h2"
                        text="A House Built on Patience & Fire"
                        className="font-display text-4xl text-brand-foreground sm:text-5xl"
                        stagger={0.1}
                        duration={0.9}
                    />

                    <motion.p
                        {...fadeUp}
                        transition={{ duration: 0.7 }}
                        className="mt-6 leading-relaxed text-brand-foregroundMuted"
                    >
                        {PARAGRAPHS[0]}
                    </motion.p>

                    <motion.blockquote
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="my-10 border-l-2 border-brand-gold py-1 pl-6 font-display text-xl italic text-brand-foreground sm:text-2xl"
                    >
                        &ldquo;Slow extraction, honest sourcing &mdash; a dining room
                        that feels like a quiet indulgence.&rdquo;
                    </motion.blockquote>

                    <motion.p
                        {...fadeUp}
                        transition={{ duration: 0.7 }}
                        className="mt-4 leading-relaxed text-brand-foregroundMuted"
                    >
                        {PARAGRAPHS[1]}
                    </motion.p>

                    <motion.p
                        {...fadeUp}
                        transition={{ duration: 0.7 }}
                        className="mt-4 leading-relaxed text-brand-foregroundMuted"
                    >
                        {PARAGRAPHS[2]}
                    </motion.p>

                    <motion.p
                        {...fadeUp}
                        transition={{ duration: 0.7 }}
                        className="mt-4 leading-relaxed text-brand-foregroundMuted"
                    >
                        {PARAGRAPHS[3]}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="mt-12 grid grid-cols-2 gap-8 border-t border-brand-border pt-10 sm:grid-cols-4"
                    >
                        {STATS.map((stat) => (
                            <div key={stat.label}>
                                <CountUp
                                    value={stat.value}
                                    className="font-display text-3xl text-brand-gold"
                                />
                                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-brand-foregroundMuted">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8 }}
                    className="relative aspect-[4/5] overflow-hidden rounded-sm border border-brand-border lg:sticky lg:top-24"
                >
                    <img
                        src="/images/about.jpg"
                        alt="Inside Sytal Coffee"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-background/70 via-transparent to-brand-goldDark/10" />
                </motion.div>
            </div>
        </section>
    );
}
