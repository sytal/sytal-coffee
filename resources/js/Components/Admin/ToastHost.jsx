import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LuCircleCheck, LuCircleX } from 'react-icons/lu';
import { subscribeToast } from '@/lib/toast';

export default function ToastHost() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        return subscribeToast((toast) => {
            setToasts((t) => [...t, toast]);
            setTimeout(() => {
                setToasts((t) => t.filter((x) => x.id !== toast.id));
            }, 3000);
        });
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        className={`flex items-center gap-2 rounded-sm border px-4 py-3 text-sm shadow-lg backdrop-blur ${
                            t.type === 'error'
                                ? 'border-brand-danger/60 bg-brand-danger/10 text-brand-danger'
                                : 'border-brand-success/60 bg-brand-success/10 text-brand-success'
                        }`}
                    >
                        {t.type === 'error' ? (
                            <LuCircleX className="h-4 w-4 shrink-0" />
                        ) : (
                            <LuCircleCheck className="h-4 w-4 shrink-0" />
                        )}
                        {t.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
