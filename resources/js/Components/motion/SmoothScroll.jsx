import { ReactLenis } from 'lenis/react';
import { useReducedMotion } from 'framer-motion';

/**
 * Lenis-driven smooth scrolling for the whole document. Disabled when the
 * user prefers reduced motion so native scrolling (and a11y) is preserved.
 * Ported from maison-noir-main's components/motion/smooth-scroll.tsx.
 */
export default function SmoothScroll({ children }) {
    const reduce = useReducedMotion();

    if (reduce) return children;

    return (
        <ReactLenis root options={{ lerp: 0.09, duration: 1.1, smoothWheel: true, wheelMultiplier: 1 }}>
            {children}
        </ReactLenis>
    );
}
