import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import SteamWisps from '@/Components/motion/SteamWisps';
import { colors } from '@/config/colors';

const EYE_SOCKETS = [
    { cx: 21, cy: 29 },
    { cx: 35, cy: 29 },
];
const MAX_PUPIL_OFFSET = 2;

export default function CoffeeMascot() {
    const reduce = useReducedMotion();
    const [canTrack, setCanTrack] = useState(false);
    const [blinking, setBlinking] = useState(false);
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

    useEffect(() => {
        if (reduce) return;
        const id = setInterval(() => {
            setBlinking(true);
            setTimeout(() => setBlinking(false), 140);
        }, 3800);
        return () => clearInterval(id);
    }, [reduce]);

    return (
        <div
            ref={ref}
            aria-hidden
            className="pointer-events-none fixed bottom-5 right-5 z-40 hidden sm:block"
        >
            <motion.div
                animate={reduce ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
            >
                <SteamWisps count={2} trigger="always" className="absolute -top-7 left-1/2 h-8 w-8 -translate-x-1/2" />

                <svg width="56" height="52" viewBox="0 0 56 52" fill="none">
                    <defs>
                        <linearGradient id="mascot-cup" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={colors.goldLight} />
                            <stop offset="100%" stopColor={colors.gold} />
                        </linearGradient>
                    </defs>

                    {/* Saucer shadow */}
                    <ellipse cx="28" cy="47" rx="20" ry="3" fill="black" fillOpacity="0.25" />

                    {/* Handle */}
                    <path
                        d="M44 20c7 0 10 4.5 10 9.5S51 39 44 39"
                        stroke={colors.goldDark}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                    />

                    {/* Cup body — rounded to-go cup silhouette */}
                    <path
                        d="M11 16c0-2.2 1.8-4 4-4h26c2.2 0 4 1.8 4 4l-2.4 21c-.3 2.6-2.5 4.6-5.1 4.6H18.5c-2.6 0-4.8-2-5.1-4.6L11 16z"
                        fill="url(#mascot-cup)"
                    />

                    {/* Lid rim */}
                    <rect x="9" y="11" width="38" height="6" rx="3" fill={colors.goldLight} />

                    {/* Cheeks */}
                    <circle cx="16.5" cy="33" r="2.6" fill={colors.goldDark} fillOpacity="0.45" />
                    <circle cx="39.5" cy="33" r="2.6" fill={colors.goldDark} fillOpacity="0.45" />

                    {/* Eyes (sclera) */}
                    {EYE_SOCKETS.map((eye, i) => (
                        <motion.ellipse
                            key={i}
                            cx={eye.cx}
                            cy={eye.cy}
                            rx="5.4"
                            animate={{ ry: blinking ? 0.5 : 5.4 }}
                            transition={{ duration: 0.1 }}
                            fill={colors.background}
                        />
                    ))}

                    {/* Smile */}
                    <path
                        d="M24 37c1.4 1.6 6.6 1.6 8 0"
                        stroke={colors.background}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>

                {/* Pupils — overlay the sclera, nudged by cursor direction */}
                {!blinking && (
                    <div className="absolute inset-0">
                        {EYE_SOCKETS.map((eye, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    left: eye.cx - 1.6,
                                    top: eye.cy - 1.6,
                                    x: canTrack ? pupilX : 0,
                                    y: canTrack ? pupilY : 0,
                                }}
                                className="absolute h-[3.2px] w-[3.2px] rounded-full"
                            >
                                <span
                                    className="block h-full w-full rounded-full"
                                    style={{ backgroundColor: colors.foreground }}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
