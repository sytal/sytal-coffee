// Minimal pub-sub so any component can fire a toast without a context
// provider wrapping the whole admin tree — ToastHost (mounted once in
// AdminLayout) is the only subscriber.
const listeners = new Set();

export function showToast(message, type = 'success') {
    const toast = { id: Date.now() + Math.random(), message, type };
    listeners.forEach((fn) => fn(toast));
}

export function subscribeToast(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}
