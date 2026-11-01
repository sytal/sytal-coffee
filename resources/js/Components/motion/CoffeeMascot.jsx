import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import SteamWisps from '@/Components/motion/SteamWisps';

const EYE_SOCKETS = [
    { cx: 22, cy: 26 },
    { cx: 34, cy: 26 },
];
const MAX_PUPIL_OFFSET = 2.2;

export default function CoffeeMascot() {
    const reduce = useReducedMotion();
    const [canTrack, setCanTrack] = useState(false);
    const ref = useRef(null);

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const pupilX = useSpring(rawX, { stiffness: 260, damping: 20 });
    const pupilY = useSpring(rawY, { stiffness: 260, damping: 20 });

    useEffect(() => {
        if (reduce || typeof window === 'undefined') return;
        if (!window.matchMedia('(pointer: fine)').matches) return;
        setCanTrack(true);

        function handleMove(e) {
            const el = ref.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const angle = Math.atan2(dy, dx);
            const distance = Math.min(1, Math.hypot(dx, dy) / 400);
            rawX.set(Math.cos(angle) * MAX_PUPIL_OFFSET * distance);
            rawY.set(Math.sin(angle) * MAX_PUPIL_OFFSET * distance);
        }

        window.addEventListener('mousemove', handleMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMove);
    }, [reduce, rawX, rawY]);

    return (
        <div
            ref={ref}
            aria-hidden
            className="pointer-events-none fixed bottom-5 left-5 z-40 hidden sm:block"
        >
            <motion.div
                animate={reduce ? undefined : { y: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
            >
                <SteamWisps count={2} trigger="always" className="absolute -top-8 left-3" />

                <svg width="56" height="48" viewBox="0 0 56 48" fill="none">
                    {/* Handle */}
                    <path
                        d="M44 16c6 0 9 4 9 9s-3 9-9 9"
                        stroke="#37332a"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                    />
                    {/* Cup body */}
                    <rect x="8" y="12" width="36" height="28" rx="4" fill="#17140f" stroke="#37332a" strokeWidth="2" />
                    {/* Saucer */}
                    <ellipse cx="26" cy="42" rx="22" ry="3" fill="#1f1b15" />

                    {/* Eyes (sclera) */}
                    {EYE_SOCKETS.map((eye, i) => (
                        <circle key={i} cx={eye.cx} cy={eye.cy} r="6" fill="#f5f1e8" />
                    ))}
                </svg>

                {/* Pupils — positioned to overlay the sclera circles, nudged by cursor direction */}
                <div className="absolute inset-0">
                    {EYE_SOCKETS.map((eye, i) => (
                        <motion.div
                            key={i}
                            style={{
                                left: eye.cx - 2,
                                top: eye.cy - 2,
                                x: canTrack ? pupilX : 0,
                                y: canTrack ? pupilY : 0,
                            }}
                            className="absolute h-1 w-1 rounded-full bg-brand-background"
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
