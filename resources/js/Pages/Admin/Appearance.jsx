import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { LuCheck } from 'react-icons/lu';

export default function Appearance({ presets = {}, active }) {
    const [current, setCurrent] = useState(active);
    const [saving, setSaving] = useState(null);

    function choose(key) {
        setSaving(key);
        router.patch('/admin/appearance', { theme: key }, {
            preserveScroll: true,
            onSuccess: () => setCurrent(key),
            onFinish: () => setSaving(null),
        });
    }

    return (
        <AdminLayout title="Appearance">
            <Head title="Admin — Appearance" />
            <p className="mb-6 max-w-2xl text-sm text-brand-foregroundMuted">
                Pick a color theme for the website. The whole site switches to the new colors the
                next time a page loads.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(presets).map(([key, preset]) => {
                    const isActive = current === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => choose(key)}
                            disabled={saving !== null}
                            className={`group relative overflow-hidden rounded-sm border p-5 text-left transition ${
                                isActive
                                    ? 'border-brand-gold ring-1 ring-brand-gold'
                                    : 'border-brand-border hover:border-brand-gold/60'
                            }`}
                            style={{ backgroundColor: preset.colors.surface }}
                        >
                            {isActive && (
                                <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold text-brand-background">
                                    <LuCheck className="h-3.5 w-3.5" />
                                </span>
                            )}

                            <div className="mb-4 flex gap-1.5">
                                {['background', 'surface', 'gold', 'goldLight', 'foreground'].map((token) => (
                                    <span
                                        key={token}
                                        className="h-8 w-8 rounded-full border border-white/10"
                                        style={{ backgroundColor: preset.colors[token] }}
                                    />
                                ))}
                            </div>

                            <h3 className="font-display text-lg" style={{ color: preset.colors.foreground }}>
                                {preset.name}
                            </h3>
                            <p className="mt-1 text-xs leading-relaxed" style={{ color: preset.colors.foregroundMuted }}>
                                {preset.description}
                            </p>

                            {saving === key && (
                                <p className="mt-3 text-xs uppercase tracking-wider" style={{ color: preset.colors.gold }}>
                                    Saving...
                                </p>
                            )}
                        </button>
                    );
                })}
            </div>
        </AdminLayout>
    );
}
