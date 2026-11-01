import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Subtle 3D tilt-on-hover wrapper. Tracks mouse position within the element
 * and rotates it in perspective space, eased through a spring so it never
 * snaps. No-ops (renders children with no transform) when reduced motion is
 * preferred.
 */
export default function TiltCard({
    children,
    className = '',
    perspective = 900,
    maxTilt = 8,
    scale = 1.02,
    springConfig = { stiffness: 220, damping: 20, mass: 0.5 },
}) {
    const ref = useRef(null);
    const reduce = useReducedMotion();

    const rotateXRaw = useMotionValue(0);
    const rotateYRaw = useMotionValue(0);
    const scaleRaw = useMotionValue(1);

    const rotateX = useSpring(rotateXRaw, springConfig);
    const rotateY = useSpring(rotateYRaw, springConfig);
    const smoothScale = useSpring(scaleRaw, springConfig);

    const handleMouseMove = (event) => {
        if (reduce || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
        const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

        rotateYRaw.set(offsetX * maxTilt * 2);
        rotateXRaw.set(-offsetY * maxTilt * 2);
        scaleRaw.set(scale);
    };

    const handleMouseLeave = () => {
        rotateXRaw.set(0);
        rotateYRaw.set(0);
        scaleRaw.set(1);
    };

    if (reduce) {
        return (
            <div ref={ref} className={className}>
                {children}
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={className}
            style={{ perspective }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    scale: smoothScale,
                    transformStyle: 'preserve-3d',
                }}
                className="h-full w-full"
            >
                {children}
            </motion.div>
        </div>
    );
}
