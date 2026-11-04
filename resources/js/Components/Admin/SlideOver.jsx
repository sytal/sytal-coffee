import { AnimatePresence, motion } from 'framer-motion';
import { LuX } from 'react-icons/lu';

export default function SlideOver({ open, onClose, title, children }) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/90"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-brand-border bg-brand-surface p-6"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="font-display text-xl text-brand-foreground">{title}</h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                                aria-label="Close"
                            >
                                <LuX className="h-4 w-4" />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
