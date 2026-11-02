import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Site-wide "order cart" — lets a visitor add menu items anywhere (the Menu
 * grid today) and check out from one floating cart button regardless of
 * which section they're on. State lives in memory only (cleared on reload)
 * since there's no "saved cart" requirement; it's just enough to let someone
 * pick a few dishes and place one order in a single pass.
 */
const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState([]); // { menu_item_id, name, price, image, quantity }
    const [open, setOpen] = useState(false);

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
