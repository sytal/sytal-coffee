import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Headline that reveals word-by-word from behind a mask — a film-title resolve.
 * Ported from maison-noir-main's components/motion/kinetic-text.tsx.
 */
export default function KineticText({
    text,
    as: Tag = 'h2',
    className = '',
    delay = 0,
    stagger = 0.08,
    duration = 0.95,
    once = true,
}) {
    const lines = text.split('\n');
    const MotionTag = motion[Tag];
    let wordIndex = 0;

    return (
        <MotionTag
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once, amount: 0.6 }}
            variants={{
                hidden: {},
                show: { transition: { staggerChildren: stagger, delayChildren: delay } },
            }}
            aria-label={text.replace(/\n/g, ' ')}
        >
            {lines.map((line, li) => (
                <span key={li} className="block" aria-hidden="true">
                    {line.split(' ').map((word, wi) => {
                        const k = wordIndex++;
                        return (
                            // The leading space (for every word but the first) is a plain
                            // text node *between* the inline-block word spans below, not
                            // inside one of them — a trailing space placed inside an
                            // inline-block gets trimmed by the browser as "end of line"
                            // whitespace, which was collapsing every heading down to
                            // "WordWordWord" with no visible gaps.
                            <span key={k}>
                                {wi > 0 && ' '}
                                <span
                                    className="inline-block overflow-hidden align-bottom"
                                    style={{ paddingBottom: '0.12em', marginBottom: '-0.12em' }}
                                >
                                    <motion.span
                                        className="inline-block"
                                        variants={{
                                            hidden: { y: '115%', rotate: 2 },
                                            show: { y: '0%', rotate: 0 },
                                        }}
                                        transition={{ duration, ease: EASE }}
                                    >
                                        {word}
                                    </motion.span>
                                </span>
                            </span>
                        );
                    })}
                </span>
            ))}
        </MotionTag>
    );
}
