import { useLenis } from 'lenis/react';

/**
 * Scrolls to a section by id using Lenis's own animated scrollTo instead of
 * the native scrollIntoView, which fights Lenis's scroll takeover and causes
 * a jarring snap instead of a smooth animated scroll.
 */
export default function useSmoothScroll() {
    const lenis = useLenis();

    return function scrollToSection(id) {
        const target = document.getElementById(id);
        if (!target) return;

        if (lenis) {
            lenis.scrollTo(target, { offset: -72, duration: 1.3, easing: (t) => 1 - Math.pow(1 - t, 3) });
        } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
}
