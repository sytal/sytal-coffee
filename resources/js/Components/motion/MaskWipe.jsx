import { motion, useReducedMotion } from 'framer-motion';

const HIDDEN = {
    left: 'inset(0 100% 0 0)',
    right: 'inset(0 0 0 100%)',
    up: 'inset(100% 0 0 0)',
    down: 'inset(0 0 100% 0)',
};

/**
 * Dramatic clip-path wipe: media unveils as a hard edge sweeps across, paired
 * with a counter-scale so it settles rather than snaps.
 * Ported from maison-noir-main's components/motion/mask-wipe.tsx.
 */
export default function MaskWipe({ children, className = '', direction = 'up', duration = 1.1, delay = 0, once = true }) {
    const reduce = useReducedMotion();

    if (reduce) {
        return <div className={`overflow-hidden ${className}`}>{children}</div>;
    }

    return (
        <motion.div
            className={`overflow-hidden ${className}`}
            initial={{ clipPath: HIDDEN[direction] }}
            whileInView={{ clipPath: 'inset(0 0 0 0)' }}
            viewport={{ once, amount: 0.45 }}
            transition={{ duration, ease: [0.77, 0, 0.175, 1], delay }}
        >
            <motion.div
                initial={{ scale: 1.16 }}
                whileInView={{ scale: 1 }}
                viewport={{ once, amount: 0.45 }}
                transition={{ duration: duration + 0.3, ease: [0.16, 1, 0.3, 1], delay }}
                className="relative h-full w-full"
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
