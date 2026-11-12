import { usePage } from '@inertiajs/react';
import { FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

// Business info edited in Admin > Business Info (shared by HandleInertiaRequests).
export function useBusiness() {
    return usePage().props.business ?? {};
}

export function socialLinks(b) {
    return [
        b.instagram && { label: 'Instagram', href: b.instagram, Icon: FiInstagram },
        b.facebook && { label: 'Facebook', href: b.facebook, Icon: FiFacebook },
        b.whatsapp_url && { label: 'WhatsApp', href: b.whatsapp_url, Icon: FaWhatsapp },
    ].filter(Boolean);
}

export function formatSlot(t) {
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}
