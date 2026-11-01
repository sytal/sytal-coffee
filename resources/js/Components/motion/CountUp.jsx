import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-triggered number count-up, powered by GSAP + ScrollTrigger.
 * `value` may include a non-numeric suffix (e.g. "100%", "12+") — the
 * numeric part animates, the suffix is appended as static text.
 */
export default function CountUp({ value, duration = 1.6, className = '' }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const match = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/);
        if (!match) {
            el.textContent = value;
            return;
        }
        const [, numStr, suffix] = match;
        const target = parseFloat(numStr);
        const counter = { n: 0 };

        const tween = gsap.to(counter, {
            n: target,
            duration,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true,
            },
            onUpdate: () => {
                const display = Number.isInteger(target)
                    ? Math.round(counter.n)
                    : counter.n.toFixed(1);
                el.textContent = `${display}${suffix}`;
            },
        });

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, [value, duration]);

    return (
        <span ref={ref} className={className}>
            0
        </span>
    );
}
