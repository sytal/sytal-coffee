import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const FIELDS = [
    { section: 'Contact' },
    { key: 'phone', label: 'Phone number', type: 'tel', placeholder: '03001234567', hint: 'Shown on the website and app. Leave blank to hide.' },
    { key: 'whatsapp', label: 'WhatsApp number', type: 'tel', placeholder: '03001234567' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'hello@yourcafe.com' },
    { key: 'address', label: 'Address', placeholder: 'Gulberg Thana Road, Faisalabad' },
    { section: 'Social links' },
    { key: 'instagram', label: 'Instagram link', type: 'url', placeholder: 'https://instagram.com/yourcafe', hint: 'Leave blank to hide the icon.' },
    { key: 'facebook', label: 'Facebook link', type: 'url', placeholder: 'https://facebook.com/yourcafe' },
    { section: 'Opening hours & delivery' },
    { key: 'open_time', label: 'Opens at', type: 'time' },
    { key: 'close_time', label: 'Closes at', type: 'time', hint: 'Closing after midnight (e.g. 1:00 AM) is fine. Table bookings are offered every 30 minutes until 1 hour before closing.' },
    { key: 'delivery_fee', label: 'Delivery fee (Rs.)', type: 'number', placeholder: '0', hint: 'Added to every order total. 0 = free delivery. Payment is cash on delivery.' },
];

export default function Business({ settings }) {
    const { data, setData, put, processing, errors, isDirty } = useForm({
        phone: settings.phone ?? '',
        whatsapp: settings.whatsapp ?? '',
        email: settings.email ?? '',
        address: settings.address ?? '',
        instagram: settings.instagram ?? '',
        facebook: settings.facebook ?? '',
        open_time: settings.open_time ?? '13:00',
        close_time: settings.close_time ?? '01:00',
        delivery_fee: settings.delivery_fee ?? 0,
    });

    return (
        <AdminLayout title="Business Info">
            <Head title="Admin — Business Info" />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    put('/admin/business', { preserveScroll: true });
                }}
                className="max-w-2xl space-y-4 rounded-sm border border-brand-border bg-brand-surface p-5"
                noValidate
            >
                <p className="text-sm text-brand-foregroundMuted">
                    These details appear in the website footer, the contact section and the app.
                </p>
                {FIELDS.map((f) =>
                    f.section ? (
                        <h2 key={f.section} className="pt-3 font-display text-lg text-brand-foreground">{f.section}</h2>
                    ) : (
                        <label key={f.key} className="block">
                            <span className="text-sm text-brand-foreground">{f.label}</span>
                            <input
                                type={f.type ?? 'text'}
                                value={data[f.key]}
                                min={f.type === 'number' ? 0 : undefined}
                                placeholder={f.placeholder}
                                onChange={(e) => setData(f.key, e.target.value)}
                                className="mt-1 w-full rounded-sm border border-brand-border bg-brand-background px-3 py-2.5 text-sm text-brand-foreground outline-none focus:border-brand-gold"
                            />
                            {errors[f.key] ? (
                                <span className="mt-1 block text-xs text-brand-danger">{errors[f.key]}</span>
                            ) : (
                                f.hint && <span className="mt-1 block text-xs text-brand-foregroundMuted">{f.hint}</span>
                            )}
                        </label>
                    ),
                )}
                <div className="sticky bottom-0 -mx-5 -mb-5 border-t border-brand-border bg-brand-surface p-4">
                    <button
                        type="submit"
                        disabled={processing || !isDirty}
                        className="w-full rounded-sm bg-brand-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight disabled:opacity-50 sm:w-auto"
                    >
                        {processing ? 'Saving…' : isDirty ? 'Save changes' : 'All changes saved'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
