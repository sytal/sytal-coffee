import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Site-wide "order cart" — lets a visitor add menu items anywhere (the Menu
 * grid today) and check out from one floating cart button regardless of
 * which section they're on. The cart is kept in localStorage so it survives
 * a page reload and the trip through /login (a guest's tray isn't lost when
 * they sign in to order). Prices are re-computed server-side on checkout.
 */
const CartContext = createContext(null);
const STORAGE_KEY = 'crunches-cart-v1';
const REOPEN_KEY = 'crunches-cart-reopen';

function loadItems() {
    try {
        const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
        return Array.isArray(parsed) ? parsed.filter((i) => i && i.menu_item_id && i.quantity > 0) : [];
    } catch {
        return [];
    }
}

/** Call before sending a guest to /login so the tray pops open again on return. */
export function rememberToReopenCart() {
    try {
        window.sessionStorage.setItem(REOPEN_KEY, '1');
    } catch {
        // storage unavailable — the cart still survives via localStorage
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => (typeof window === 'undefined' ? [] : loadItems())); // { menu_item_id, name, price, image, quantity }
    const [open, setOpen] = useState(false);

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // private mode / storage blocked: cart just won't persist
        }
    }, [items]);

    useEffect(() => {
        try {
            if (window.sessionStorage.getItem(REOPEN_KEY)) {
                window.sessionStorage.removeItem(REOPEN_KEY);
                if (loadItems().length > 0) setOpen(true);
            }
        } catch {
            // ignore
        }
    }, []);

    const addItem = useCallback((menuItem) => {
        setItems((prev) => {
            // Only auto-open the panel the first time something is added to
            // an empty cart — a little confirmation nudge. Once it's open
            // (or the visitor closed it to keep browsing), further "Add"
            // taps on other dishes shouldn't yank them away from the menu.
            if (prev.length === 0) setOpen(true);

            const existing = prev.find((i) => i.menu_item_id === menuItem.id);
            if (existing) {
                return prev.map((i) =>
                    i.menu_item_id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [
                ...prev,
                {
                    menu_item_id: menuItem.id,
                    name: menuItem.name,
                    price: menuItem.price,
                    image: menuItem.image,
                    quantity: 1,
                },
            ];
        });
    }, []);

    const updateQuantity = useCallback((menuItemId, quantity) => {
        setItems((prev) => {
            if (quantity <= 0) return prev.filter((i) => i.menu_item_id !== menuItemId);
            return prev.map((i) => (i.menu_item_id === menuItemId ? { ...i, quantity } : i));
        });
    }, []);

    const removeItem = useCallback((menuItemId) => {
        setItems((prev) => prev.filter((i) => i.menu_item_id !== menuItemId));
    }, []);

    const clear = useCallback(() => setItems([]), []);

    const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

    const value = useMemo(
        () => ({ items, addItem, updateQuantity, removeItem, clear, totalCount, open, setOpen }),
        [items, addItem, updateQuantity, removeItem, clear, totalCount, open]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
}
