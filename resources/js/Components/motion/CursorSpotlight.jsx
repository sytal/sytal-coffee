import { useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Soft cursor-follow glow, brand-gold tinted. Drop into any
 * relatively-positioned container; this layer is absolutely positioned,
 * inset-0, and tracks mousemove within its parent via a ref on itself
 * (listens on the nearest offset parent through the wrapping div).
 */
export default function CursorSpotlight() {
    const reduce = useReducedMotion();
    const wrapRef = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { damping: 30, stiffness: 120, mass: 0.5 });
    const springY = useSpring(y, { damping: 30, stiffness: 120, mass: 0.5 });
    const background = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(205, 164, 94, 0.08), transparent 70%)`;

    if (reduce) return null;

    const handleMouseMove = (e) => {
        const el = wrapRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
    };

    return (
        <div
            ref={wrapRef}
            aria-hidden
            onMouseMove={handleMouseMove}
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            <motion.div className="absolute inset-0" style={{ backgroundImage: background }} />
        </div>
    );
}
