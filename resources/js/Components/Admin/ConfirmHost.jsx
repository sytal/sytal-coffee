import { useEffect, useState } from 'react';

/**
 * In-app replacement for window.confirm(). Call `confirmDialog(message)`
 * anywhere in the admin; it resolves true/false. <ConfirmHost/> is mounted
 * once in AdminLayout.
 */
export function confirmDialog(message, { confirmLabel = 'Delete', danger = true } = {}) {
    return new Promise((resolve) => {
        window.dispatchEvent(new CustomEvent('admin-confirm', { detail: { message, confirmLabel, danger, resolve } }));
    });
}

export default function ConfirmHost() {
    const [req, setReq] = useState(null);

    useEffect(() => {
        const open = (e) => setReq(e.detail);
        window.addEventListener('admin-confirm', open);
        return () => window.removeEventListener('admin-confirm', open);
    }, []);

    useEffect(() => {
        if (!req) return;
        const onKey = (e) => e.key === 'Escape' && close(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    function close(result) {
        req?.resolve(result);
        setReq(null);
    }

    if (!req) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={() => close(false)}>
            <div
                role="alertdialog"
                aria-modal="true"
                className="w-full max-w-sm rounded-sm border border-brand-border bg-brand-surface p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-brand-foreground">{req.message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => close(false)}
                        className="min-h-10 rounded-sm border border-brand-border px-4 text-sm text-brand-foregroundMuted hover:text-brand-foreground"
                    >
                        Keep it
                    </button>
                    <button
                        type="button"
                        autoFocus
                        onClick={() => close(true)}
                        className={`min-h-10 rounded-sm px-4 text-sm font-medium text-white ${req.danger ? 'bg-brand-danger' : 'bg-brand-gold'}`}
                    >
                        {req.confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
