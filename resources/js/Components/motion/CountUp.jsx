import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, animate, useReducedMotion } from 'framer-motion';

/**
 * Scroll-triggered number count-up, powered by Framer Motion (already a
 * project dependency) instead of pulling in GSAP + ScrollTrigger for just
 * this. `value` may include a non-numeric suffix (e.g. "100%", "12+") —
 * the numeric part animates, the suffix is appended as static text.
 */
export default function CountUp({ value, duration = 1.6, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const reduce = useReducedMotion();
    const count = useMotionValue(0);

    const match = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/);
    const target = match ? parseFloat(match[1]) : null;
    const suffix = match ? match[2] : '';
    const isInteger = target !== null && Number.isInteger(target);

    useEffect(() => {
        const el = ref.current;
        if (!el || target === null) return;

        if (!inView) return;

        if (reduce) {
            el.textContent = `${target}${suffix}`;
            return;
        }

        const controls = animate(count, target, {
            duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => {
                const display = isInteger ? Math.round(latest) : latest.toFixed(1);
                el.textContent = `${display}${suffix}`;
            },
        });

        return () => controls.stop();
    }, [inView, target, suffix, isInteger, duration, reduce, count]);

    if (target === null) {
        return (
            <span ref={ref} className={className}>
                {value}
            </span>
        );
    }

    return (
        <span ref={ref} className={className}>
            0{suffix}
        </span>
    );
}
