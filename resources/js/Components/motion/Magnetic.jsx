import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Magnetic hover: the element drifts toward the cursor and springs back on leave.
 * Ported from maison-noir-main's components/motion/magnetic.tsx.
 */
export default function Magnetic({ children, className = '', strength = 0.35 }) {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

    function onMove(e) {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
    }

    function reset() {
        x.set(0);
        y.set(0);
    }

    if (reduce) return <div className={`inline-block ${className}`}>{children}</div>;

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={reset}
            style={{ x: sx, y: sy }}
            className={`inline-block ${className}`}
        >
            {children}
        </motion.div>
    );
}
