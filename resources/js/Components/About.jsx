import { motion } from 'framer-motion';
import CountUp from '@/Components/motion/CountUp';
import KineticText from '@/Components/motion/KineticText';

// "Menu Items" is the live count from the database, never a guess.
const buildStats = (menuCount) => [
    { label: 'Google Rating', value: '4.2' },
    { label: 'Happy Reviews', value: '38+' },
    { label: 'Menu Items', value: String(menuCount ?? 0) },
    { label: 'Days Open Weekly', value: '7' },
];

const DEFAULT_PARAGRAPHS = [
    `KAVO started on Gulberg Thana Road with one idea: Faisalabad
    deserved a late-night spot that didn't cut corners on flavor. No
    fuss, no pretense — just loaded fries, stacked burgers, and a
    kitchen that doesn't slow down after dark.`,
    `Today it's the spot where the crew lands after a long day — neon
    signage out front, a menu built for sharing (or not), and a
    kitchen that's always running hot.`,
    `From crispy loaded fries to our signature stacked burgers and that
    molten chocolate brownie everyone talks about, every item earns
    its spot on the menu the hard way: by actually being good.`,
    `We're not trying to be fine dining. We're trying to be the place
    you crave at 11pm — and the reviews say we're getting it right.`,
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
};

export default function About({
    eyebrow = 'Our Story',
    heading = 'Built on Late Nights & Loaded Plates',
    quote = "No fuss, no pretense — just a kitchen that doesn't slow down after dark.",
    body,
    image = '/images/about.jpg',
    menuCount,
}) {
    const STATS = buildStats(menuCount);
    const paragraphs = body ? body.split('\n\n') : DEFAULT_PARAGRAPHS;
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
                        {eyebrow}
                    </motion.p>

                    <KineticText
                        as="h2"
                        text={heading}
                        className="font-display text-4xl text-brand-foreground sm:text-5xl"
                        stagger={0.1}
                        duration={0.9}
                    />

                    {paragraphs[0] && (
                        <motion.p
                            {...fadeUp}
                            transition={{ duration: 0.7 }}
                            className="mt-6 leading-relaxed text-brand-foregroundMuted"
                        >
                            {paragraphs[0]}
                        </motion.p>
                    )}

                    <motion.blockquote
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="my-10 border-l-2 border-brand-gold py-1 pl-6 font-display text-xl italic text-brand-foreground sm:text-2xl"
                    >
                        &ldquo;{quote}&rdquo;
                    </motion.blockquote>

                    {paragraphs.slice(1).map((paragraph, i) => (
                        <motion.p
                            key={i}
                            {...fadeUp}
                            transition={{ duration: 0.7 }}
                            className="mt-4 leading-relaxed text-brand-foregroundMuted"
                        >
                            {paragraph}
                        </motion.p>
                    ))}

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
                        src={image}
                        alt="Inside KAVO"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-background/70 via-transparent to-brand-goldDark/10" />
                </motion.div>
            </div>
        </section>
    );
}
