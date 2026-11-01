import { motion, useScroll } from 'framer-motion';

/**
 * Minimal desktop-only vertical scroll-progress indicator.
 * A thin track pinned to the right edge with a gold fill scaling with scrollYProgress.
 */
export default function ScrollProgressDot() {
    const { scrollYProgress } = useScroll();

    return (
        <div
            className="pointer-events-none fixed right-5 top-1/2 z-40 hidden h-28 w-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-brand-border/40 lg:block"
            aria-hidden="true"
        >
            <motion.div
                className="absolute inset-x-0 top-0 w-full rounded-full bg-brand-gold/70"
                style={{ scaleY: scrollYProgress, originY: 0, height: '100%' }}
            />
        </div>
    );
}
