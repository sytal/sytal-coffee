import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { LuCheck, LuSun, LuMoon, LuMonitor } from 'react-icons/lu';

function hexToRgbTriplet(hex) {
    const n = hex.replace('#', '');
    const r = parseInt(n.slice(0, 2), 16);
    const g = parseInt(n.slice(2, 4), 16);
    const b = parseInt(n.slice(4, 6), 16);
    return `${r} ${g} ${b}`;
}

const MODES = [
    { key: 'dark', label: 'Dark', icon: LuMoon },
    { key: 'light', label: 'Light', icon: LuSun },
    { key: 'auto', label: 'Auto (match visitor’s device)', icon: LuMonitor },
];

export default function Appearance({ presets = {}, active, mode: initialMode }) {
    const [current, setCurrent] = useState(active);
    const [mode, setMode] = useState(initialMode ?? 'auto');
    const [saving, setSaving] = useState(null);

    // Inertia's router.patch only swaps the page component — it never
    // re-runs the Blade <style> block that injects --brand-* vars, so
    // without this the new theme wouldn't show until a real page reload.
    // Writing the vars straight onto :root makes the switch instant.
    function applyCssVars(themeKey, modeKey) {
        const preset = presets[themeKey];
        if (!preset) return;
        const resolvedMode = modeKey === 'auto'
            ? (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
            : modeKey;
        const colors = preset[resolvedMode] ?? preset.dark;
        Object.entries(colors).forEach(([name, hex]) => {
            document.documentElement.style.setProperty(`--brand-${name}-rgb`, hexToRgbTriplet(hex));
        });
    }

    function choose(key) {
        setSaving(key);
        setCurrent(key);
        applyCssVars(key, mode);
        router.patch('/admin/appearance', { theme: key }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setSaving(null),
        });
    }

    function chooseMode(key) {
        setSaving(`mode:${key}`);
        setMode(key);
        applyCssVars(current, key);
        router.patch('/admin/appearance', { mode: key }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setSaving(null),
        });
    }

    return (
        <AdminLayout title="Appearance">
            <Head title="Admin — Appearance" />
            <p className="mb-6 max-w-2xl text-sm text-brand-foregroundMuted">
                Pick a color theme for the website, and whether it should always show in Dark
                mode, always in Light mode, or automatically match whatever the visitor's own
                phone or computer prefers. Changes apply the next time a page loads.
            </p>

            <div className="mb-10">
                <h3 className="mb-3 font-display text-base text-brand-foreground">Light / Dark Mode</h3>
                <div className="flex flex-wrap gap-3">
                    {MODES.map(({ key, label, icon: Icon }) => {
                        const isActive = mode === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => chooseMode(key)}
                                disabled={saving !== null}
                                className={`flex items-center gap-2 rounded-sm border px-4 py-2.5 text-sm transition ${
                                    isActive
                                        ? 'border-brand-gold bg-brand-gold text-brand-background'
                                        : 'border-brand-border text-brand-foregroundMuted hover:border-brand-gold hover:text-brand-gold'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                                {saving === `mode:${key}` && <span className="ml-1 text-xs">Saving...</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <h3 className="mb-3 font-display text-base text-brand-foreground">Color Theme</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(presets).map(([key, preset]) => {
                    const isActive = current === key;

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => choose(key)}
                            disabled={saving !== null}
                            className={`group relative overflow-hidden rounded-sm border bg-brand-surface p-5 text-left transition ${
                                isActive
                                    ? 'border-brand-gold ring-1 ring-brand-gold'
                                    : 'border-brand-border hover:border-brand-gold/60'
                            }`}
                        >
                            {isActive && (
                                <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold text-brand-background">
                                    <LuCheck className="h-3.5 w-3.5" />
                                </span>
                            )}

                            <p className="mb-1.5 text-[10px] uppercase tracking-wider text-brand-foregroundMuted">
                                Dark
                            </p>
                            <div className="mb-3 flex gap-1.5">
                                {['background', 'surface', 'gold', 'goldLight', 'foreground'].map((token) => (
                                    <span
                                        key={`dark-${token}`}
                                        className="h-7 w-7 rounded-full border border-white/10"
                                        style={{ backgroundColor: preset.dark[token] }}
                                    />
                                ))}
                            </div>
                            <p className="mb-1.5 text-[10px] uppercase tracking-wider text-brand-foregroundMuted">
                                Light
                            </p>
                            <div className="mb-4 flex gap-1.5">
                                {['background', 'surface', 'gold', 'goldLight', 'foreground'].map((token) => (
                                    <span
                                        key={`light-${token}`}
                                        className="h-7 w-7 rounded-full border border-black/10"
                                        style={{ backgroundColor: preset.light[token] }}
                                    />
                                ))}
                            </div>

                            <h3 className="font-display text-lg text-brand-foreground">{preset.name}</h3>
                            <p className="mt-1 text-xs leading-relaxed text-brand-foregroundMuted">
                                {preset.description}
                            </p>

                            {saving === key && (
                                <p className="mt-3 text-xs uppercase tracking-wider text-brand-gold">Saving...</p>
                            )}
                        </button>
                    );
                })}
            </div>
        </AdminLayout>
    );
}
