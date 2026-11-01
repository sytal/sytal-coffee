import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { colors } from '@/config/colors';

/**
 * Subtle ambient background wash that breathes between brand-background and
 * brand-surface as the page scrolls. Sits once near the root, fixed and
 * behind all content, at low opacity so it reads as atmosphere rather than
 * competing with the real section backgrounds + SectionDivider hard edges.
 */
export default function BackgroundMorph() {
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll();

    const backgroundColor = useTransform(
        scrollYProgress,
        [0, 0.3, 0.5, 0.7, 0.85, 1],
        [
            colors.background,
            colors.background,
            colors.surface,
            colors.background,
            colors.surface,
            colors.background,
        ]
    );

    if (reduce) return null;

    return (
        <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 opacity-40"
            style={{ backgroundColor }}
        />
    );
}
