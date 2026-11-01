import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], summary, label';
const TEXT_SELECTOR = 'input, textarea, select, [contenteditable="true"]';

export default function CustomCursor() {
    const reduce = useReducedMotion();
    const [enabled, setEnabled] = useState(false);
    const [variant, setVariant] = useState('default'); // default | hover | drag | view | text
    const [label, setLabel] = useState('');

    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.6 });
    const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.6 });
    const dotX = useSpring(x, { stiffness: 900, damping: 40, mass: 0.3 });
    const dotY = useSpring(y, { stiffness: 900, damping: 40, mass: 0.3 });

    useEffect(() => {
        if (reduce || typeof window === 'undefined') return;
        const isFinePointer = window.matchMedia('(pointer: fine)').matches;
        if (!isFinePointer) return;

        setEnabled(true);
        document.documentElement.classList.add('has-custom-cursor');

        function handleMove(e) {
            x.set(e.clientX);
            y.set(e.clientY);
        }

        function handleOver(e) {
            const target = e.target;
            if (!(target instanceof Element)) return;

            const textEl = target.closest(TEXT_SELECTOR);
            if (textEl) {
                setVariant('text');
                setLabel('');
                return;
            }

            const cursorEl = target.closest('[data-cursor]');
            if (cursorEl) {
                setVariant(cursorEl.getAttribute('data-cursor') || 'hover');
                setLabel(cursorEl.getAttribute('data-cursor-text') || '');
                return;
            }

            const interactiveEl = target.closest(INTERACTIVE_SELECTOR);
            if (interactiveEl) {
                setVariant('hover');
                setLabel('');
                return;
            }

            setVariant('default');
            setLabel('');
        }

        window.addEventListener('mousemove', handleMove, { passive: true });
        document.addEventListener('mouseover', handleOver);

        return () => {
            document.documentElement.classList.remove('has-custom-cursor');
            window.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseover', handleOver);
        };
    }, [reduce, x, y]);

    if (!enabled) return null;

    const isText = variant === 'text';
    const isHover = variant === 'hover';
    const isDrag = variant === 'drag';
    const isView = variant === 'view';
    const ringScale = isText ? 0 : isHover ? 1.6 : isDrag || isView ? 2.6 : 1;

    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
            <motion.div
                style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%', scale: ringScale }}
                className="absolute flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/70 transition-[border-color] duration-200"
            >
                {(isDrag || isView) && label && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-brand-gold">
                        {label}
                    </span>
                )}
            </motion.div>
            <motion.div
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isText ? 0 : isDrag || isView ? 0 : 1,
                }}
                className="absolute h-1.5 w-1.5 rounded-full bg-brand-gold"
            />
        </div>
    );
}
