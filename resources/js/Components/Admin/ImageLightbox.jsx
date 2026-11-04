import { createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LuX } from 'react-icons/lu';

const LightboxContext = createContext(() => {});

export function LightboxProvider({ children }) {
    const [src, setSrc] = useState(null);

    return (
        <LightboxContext.Provider value={setSrc}>
            {children}
            <AnimatePresence>
                {src && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSrc(null)}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-6"
                    >
                        <button
                            type="button"
                            onClick={() => setSrc(null)}
                            aria-label="Close"
                            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-brand-foreground transition hover:border-brand-gold hover:text-brand-gold"
                        >
                            <LuX className="h-5 w-5" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.92 }}
                            animate={{ scale: 1 }}
                            src={src}
                            alt="Full size"
                            onClick={(e) => e.stopPropagation()}
                            className="max-h-[90vh] max-w-[90vw] rounded-sm object-contain"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </LightboxContext.Provider>
    );
}

// Use on any <img>: `<Zoomable src={item.image} alt={item.name} className="..." />`
// — click to expand full size, same open/close behavior everywhere.
export function Zoomable({ src, alt = '', className = '', ...props }) {
    const open = useContext(LightboxContext);
    if (!src) return <div className={className} />;

    return (
        <img
            src={src}
            alt={alt}
            onClick={() => open(src)}
            className={`cursor-zoom-in ${className}`}
            {...props}
        />
    );
}
