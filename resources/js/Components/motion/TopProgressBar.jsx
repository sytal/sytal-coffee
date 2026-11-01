import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';

/**
 * Thin top-of-viewport progress bar that fills during Inertia navigations.
 * Infrastructure for multi-page growth — this is a single-page app today,
 * so it may rarely be visible, but it will fire on every router visit.
 */
export default function TopProgressBar() {
    const [active, setActive] = useState(false);
    const [done, setDone] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const removeStart = router.on('start', () => {
            clearTimeout(timeoutRef.current);
            setDone(false);
            setActive(true);
        });

        const removeFinish = router.on('finish', () => {
            setDone(true);
            timeoutRef.current = setTimeout(() => {
                setActive(false);
                setDone(false);
            }, 400);
        });

        return () => {
            removeStart();
            removeFinish();
            clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
                >
                    <motion.div
                        className="h-full bg-brand-gold shadow-[0_0_8px_rgba(205,164,94,0.6)]"
                        initial={{ width: '0%' }}
                        animate={{ width: done ? '100%' : '90%' }}
                        transition={{
                            duration: done ? 0.25 : 0.6,
                            ease: done ? 'easeOut' : 'easeInOut',
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
