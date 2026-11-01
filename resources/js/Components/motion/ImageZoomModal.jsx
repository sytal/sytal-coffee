import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { LuX } from 'react-icons/lu';

/**
 * Full-screen image zoom/pan lightbox. Rendered via a portal into
 * document.body so it always sits above every section regardless of
 * transformed ancestors (Framer Motion/Lenis wrappers elsewhere in the
 * tree would otherwise trap a `fixed` element inside their own box).
 */
export default function ImageZoomModal({ image, onClose }) {
    const rawScale = useMotionValue(1);
    const scale = useSpring(rawScale, { stiffness: 300, damping: 30 });
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!image) return;

        function handleKey(e) {
            if (e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', handleKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [image, onClose]);

    useEffect(() => {
        rawScale.set(1);
        x.set(0);
        y.set(0);
    }, [image, rawScale, x, y]);

    function handleWheel(e) {
        e.preventDefault();
        const next = Math.min(4, Math.max(1, rawScale.get() - e.deltaY * 0.0015));
        rawScale.set(next);
        if (next === 1) {
            x.set(0);
            y.set(0);
        }
    }

    function handleDoubleClick() {
        if (rawScale.get() > 1) {
            rawScale.set(1);
            x.set(0);
            y.set(0);
        } else {
            rawScale.set(2.4);
        }
    }

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {image && (
                <motion.div
                    key="zoom-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-brand-background/95 p-6 backdrop-blur-sm"
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-brand-border/60 text-brand-foreground transition hover:border-brand-gold hover:text-brand-gold"
                        aria-label="Close"
                    >
                        <LuX className="h-5 w-5" />
                    </button>

                    {image.caption && (
                        <p className="absolute left-1/2 top-5 -translate-x-1/2 font-display text-lg text-brand-foreground">
                            {image.caption}
                        </p>
                    )}

                    <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[11px] uppercase tracking-[0.2em] text-brand-foregroundMuted">
                        Scroll to zoom &middot; Drag to pan &middot; Double-click to reset
                    </p>

                    <motion.div
                        ref={containerRef}
                        onClick={(e) => e.stopPropagation()}
                        onWheel={handleWheel}
                        onDoubleClick={handleDoubleClick}
                        className="relative max-h-[78vh] max-w-[90vw] cursor-grab overflow-hidden rounded-lg border border-brand-border/60 active:cursor-grabbing"
                    >
                        <motion.img
                            src={image.src}
                            alt={image.alt}
                            drag
                            dragElastic={0.05}
                            dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
                            style={{ scale, x, y }}
                            className="max-h-[78vh] max-w-[90vw] select-none object-contain"
                            draggable={false}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
