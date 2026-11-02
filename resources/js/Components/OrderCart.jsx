import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { LuShoppingBag, LuX, LuMinus, LuPlus, LuTrash2, LuMapPin, LuCircleCheck } from 'react-icons/lu';
import { useCart } from '@/lib/CartContext';
import { playUiSound } from '@/lib/uiSound';

const numericPrice = (label) => {
    const match = String(label ?? '').match(/[\d,]+(\.\d+)?/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
};

/**
 * Floating cart button + slide-over panel. Anyone can add items while
 * browsing the menu, but submitting the order requires an account —
 * placing an order is the one thing on this site that's gated behind auth,
 * per the brief ("browsing stays public, ordering requires sign-in").
 */
export default function OrderCart() {
    const { items, updateQuantity, removeItem, clear, totalCount, open, setOpen } = useCart();
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);

    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(null);
    const [errors, setErrors] = useState({});

    const total = items.reduce((sum, i) => sum + numericPrice(i.price) * i.quantity, 0);

    function submitOrder(e) {
        e.preventDefault();
        if (!isAuthenticated || items.length === 0) return;

        setProcessing(true);
        setErrors({});

        router.post(
            '/orders',
            {
                delivery_address: address,
                phone,
                notes,
                items: items.map((i) => ({ menu_item_id: i.menu_item_id, quantity: i.quantity })),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    playUiSound('success');
                    setSuccess('Order placed! We will start preparing it shortly.');
                    clear();
                    setAddress('');
                    setPhone('');
                    setNotes('');
                },
                onError: (errs) => setErrors(errs),
                onFinish: () => setProcessing(false),
            }
        );
    }

    return (
        <>
            {totalCount > 0 && (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-brand-gold px-5 py-3.5 text-sm font-semibold uppercase tracking-wider text-brand-background shadow-lg shadow-brand-gold/30 transition-transform hover:scale-105 active:scale-95"
                    aria-label="Open your order"
                >
                    <LuShoppingBag className="h-4 w-4" />
                    Your Order
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-background px-1 text-xs text-brand-gold">
                        {totalCount}
                    </span>
                </button>
            )}

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 z-50 bg-black/70"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-brand-border bg-brand-surface"
                        >
                            <div className="flex items-center justify-between border-b border-brand-border p-5">
                                <h2 className="font-display text-xl text-brand-foreground">Your Order</h2>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    aria-label="Close"
                                    className="text-brand-foregroundMuted transition hover:text-brand-gold"
                                >
                                    <LuX className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5">
                                {success ? (
                                    <div className="flex flex-col items-center gap-3 py-12 text-center">
                                        <LuCircleCheck className="h-12 w-12 text-brand-success" />
                                        <p className="text-brand-foreground">{success}</p>
                                        <Link
                                            href="/my-orders"
                                            className="mt-2 text-sm text-brand-gold hover:underline"
                                        >
                                            View my orders
                                        </Link>
                                    </div>
                                ) : items.length === 0 ? (
                                    <p className="py-12 text-center text-sm text-brand-foregroundMuted">
                                        Your order is empty. Add dishes from the menu to get started.
                                    </p>
                                ) : (
                                    <>
                                        <ul className="flex flex-col gap-4">
                                            {items.map((item) => (
                                                <li key={item.menu_item_id} className="flex gap-3">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt=""
                                                            className="h-16 w-16 shrink-0 rounded-sm object-cover"
                                                        />
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm text-brand-foreground">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-xs text-brand-foregroundMuted">
                                                            {item.price}
                                                        </p>
                                                        <div className="mt-1.5 flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateQuantity(item.menu_item_id, item.quantity - 1)
                                                                }
                                                                aria-label={`Decrease ${item.name} quantity`}
                                                                className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                                                            >
                                                                <LuMinus className="h-3 w-3" />
                                                            </button>
                                                            <span className="w-4 text-center text-sm text-brand-foreground">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateQuantity(item.menu_item_id, item.quantity + 1)
                                                                }
                                                                aria-label={`Increase ${item.name} quantity`}
                                                                className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                                                            >
                                                                <LuPlus className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.menu_item_id)}
                                                        aria-label={`Remove ${item.name}`}
                                                        className="shrink-0 self-start text-brand-foregroundMuted transition hover:text-brand-danger"
                                                    >
                                                        <LuTrash2 className="h-4 w-4" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-5 flex items-center justify-between border-t border-brand-border pt-4 text-sm">
                                            <span className="text-brand-foregroundMuted">Total</span>
                                            <span className="font-display text-lg text-brand-gold">
                                                Rs. {total.toLocaleString()}
                                            </span>
                                        </div>

                                        {!isAuthenticated ? (
                                            <div className="mt-6 rounded-sm border border-brand-gold/40 bg-brand-background/50 p-4 text-center">
                                                <p className="text-sm text-brand-foregroundMuted">
                                                    Sign in to place your order and track it in your account.
                                                </p>
                                                <Link
                                                    href={`/login?redirect=${encodeURIComponent('/#menu')}`}
                                                    className="mt-3 inline-block rounded-full bg-brand-gold px-6 py-2 text-xs font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight"
                                                >
                                                    Sign In to Order
                                                </Link>
                                            </div>
                                        ) : (
                                            <form onSubmit={submitOrder} className="mt-6 flex flex-col gap-4">
                                                <div>
                                                    <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-foregroundMuted">
                                                        <LuMapPin className="h-3.5 w-3.5" />
                                                        Delivery Address *
                                                    </label>
                                                    <textarea
                                                        value={address}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                        rows={2}
                                                        required
                                                        placeholder="House #, street, area, Faisalabad"
                                                        className="w-full resize-none rounded-sm border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/40"
                                                    />
                                                    {errors.delivery_address && (
                                                        <p className="mt-1 text-xs text-brand-danger">
                                                            {errors.delivery_address}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-brand-foregroundMuted">
                                                        Phone *
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        required
                                                        placeholder="03xx-xxxxxxx"
                                                        className="w-full rounded-sm border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/40"
                                                    />
                                                    {errors.phone && (
                                                        <p className="mt-1 text-xs text-brand-danger">{errors.phone}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-brand-foregroundMuted">
                                                        Notes (optional)
                                                    </label>
                                                    <textarea
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                        rows={2}
                                                        placeholder="Less spicy, extra sauce, etc."
                                                        className="w-full resize-none rounded-sm border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/40"
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight disabled:opacity-60"
                                                >
                                                    {processing ? 'Placing Order…' : 'Place Order'}
                                                </button>
                                            </form>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
