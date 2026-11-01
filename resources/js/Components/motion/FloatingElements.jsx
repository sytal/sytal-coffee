import { motion, useReducedMotion } from 'framer-motion';

/**
 * Self-contained decorative layer: a handful of thin gold line-art shapes
 * (circles, arcs, a coffee-bean silhouette) drifting slowly and
 * independently. Very low opacity, purely ambient. Drop into any
 * relatively-positioned section.
 */
const SHAPES = [
    {
        style: { top: '12%', left: '6%', width: 90, height: 90 },
        duration: 22,
        rotateRange: [0, 14],
        yRange: [0, -18],
        opacity: 0.14,
        node: (
            <circle cx="45" cy="45" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
        ),
    },
    {
        style: { top: '62%', left: '4%', width: 70, height: 70 },
        duration: 26,
        rotateRange: [0, -10],
        yRange: [0, 20],
        opacity: 0.12,
        node: (
            <path
                d="M35 5 C10 5 5 30 5 35 C5 60 30 65 35 65 C60 65 65 40 65 35 C65 10 40 5 35 5 Z M35 10 C10 22 10 48 35 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
            />
        ),
    },
    {
        style: { top: '20%', right: '8%', width: 60, height: 60 },
        duration: 18,
        rotateRange: [0, 20],
        yRange: [0, 14],
        opacity: 0.16,
        node: (
            <path
                d="M5 30 A25 25 0 0 1 55 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
            />
        ),
    },
    {
        style: { top: '75%', right: '10%', width: 100, height: 100 },
        duration: 30,
        rotateRange: [0, -16],
        yRange: [0, -22],
        opacity: 0.1,
        node: (
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
        ),
    },
    {
        style: { top: '42%', left: '48%', width: 50, height: 50 },
        duration: 20,
        rotateRange: [0, 24],
        yRange: [0, 16],
        opacity: 0.1,
        node: (
            <path d="M5 25 A20 20 0 1 1 45 25" fill="none" stroke="currentColor" strokeWidth="1" />
        ),
    },
    {
        style: { top: '8%', right: '30%', width: 44, height: 44 },
        duration: 24,
        rotateRange: [0, -22],
        yRange: [0, 18],
        opacity: 0.14,
        node: (
            <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
        ),
    },
];

export default function FloatingElements() {
    const reduce = useReducedMotion();

    if (reduce) return null;

    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden text-brand-gold">
            {SHAPES.map((shape, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{ ...shape.style, opacity: shape.opacity }}
                    animate={{
                        rotate: shape.rotateRange,
                        y: shape.yRange,
                    }}
                    transition={{
                        duration: shape.duration,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                    }}
                >
                    <svg viewBox="0 0 90 90" width="100%" height="100%">
                        {shape.node}
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}
