import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Sharp scale-on-scroll: content zooms as it crosses the viewport.
 * Ported from maison-noir-main's components/motion/scroll-scale.tsx.
 * `range` is [enter, exit] scale — e.g. [0.85, 1] grows it into place.
 */
export default function ScrollScale({ children, className = '', range = [0.85, 1] }) {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const scale = useTransform(scrollYProgress, [0, 0.5], range);

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <motion.div style={reduce ? undefined : { scale }} className="relative h-full w-full will-change-transform">
                {children}
            </motion.div>
        </div>
    );
}
