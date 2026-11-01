import { motion, useReducedMotion } from 'framer-motion';

/**
 * A few soft rising/fading steam wisps. Pass `trigger="scroll"` (default) to
 * only animate once the component scrolls into view, or `trigger="always"`
 * for a continuously-looping version (e.g. mounted inside a fixed widget).
 */
export default function SteamWisps({ count = 3, className = '', trigger = 'scroll' }) {
    const reduce = useReducedMotion();
    if (reduce) return null;

    const viewportProps =
        trigger === 'scroll' ? { whileInView: 'rise', viewport: { once: false, amount: 0.4 } } : { animate: 'rise' };

    return (
        <div aria-hidden className={`pointer-events-none ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <motion.span
                    key={i}
                    initial="hidden"
                    {...viewportProps}
                    variants={{
                        hidden: { opacity: 0, y: 0, scaleY: 0.8 },
                        rise: {
                            opacity: [0, 0.35, 0],
                            y: [-4, -36],
                            scaleY: [0.8, 1.3],
                            transition: {
                                duration: 3 + i * 0.6,
                                repeat: Infinity,
                                repeatDelay: 0.4,
                                delay: i * 0.5,
                                ease: 'easeInOut',
                            },
                        },
                    }}
                    className="absolute bottom-0 block h-10 w-1.5 rounded-full bg-brand-foreground/40 blur-[3px]"
                    style={{ left: `${i * 10 - (count - 1) * 5}px` }}
                />
            ))}
        </div>
    );
}
