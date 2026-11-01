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

/**
 * Grow-then-shrink scroll-linked scale for whole sections.
 *
 * Unlike ScrollScale above (which grows once as the element enters and then
 * holds at full size), this maps the section's full enter→exit scroll
 * progress onto a three-point scale curve: small while entering, full size
 * while centered in the viewport, small again as it exits off the top.
 *
 * `peak` is the in-view scale (default 1), `edge` is the scale at both the
 * entry and exit extremes (default 0.88). Pass `amount` to tighten/loosen
 * how much the section shrinks at the edges.
 */
export function ScrollScaleSection({ children, className = '', edge = 0.88, peak = 1 }) {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [edge, peak, edge]);

    return (
        <div ref={ref} className={className}>
            <motion.div style={reduce ? undefined : { scale }} className="will-change-transform">
                {children}
            </motion.div>
        </div>
    );
}
