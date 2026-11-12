import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { LuArrowUp, LuArrowDown, LuUpload, LuSave } from 'react-icons/lu';
import { Zoomable } from '@/Components/Admin/ImageLightbox';

/**
 * One editable card per homepage section (hero, about, crave break,
 * reservations banner, ...). Only text and images are editable here —
 * icons stay code-based, per the owner's instructions. Each section can be
 * reordered with the up/down arrows, which persists sort_order.
 */

function ImageField({ label, value, onChange }) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(value);

    function handleFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        onChange(file);
    }

    return (
        <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-brand-foregroundMuted">
                {label}
            </label>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="h-20 w-full shrink-0 overflow-hidden sm:h-16 sm:w-24 rounded-sm border border-brand-border bg-brand-surfaceAlt">
                    {preview && (
                        <Zoomable src={preview} alt={label} className="h-full w-full object-cover" />
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex min-h-10 items-center justify-center gap-2 rounded-sm border border-brand-border px-3 py-2 text-xs uppercase tracking-wider text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                >
                    <LuUpload className="h-3.5 w-3.5 shrink-0" />
                    Replace Image
                </button>
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
        </div>
    );
}

function SectionCard({ block, isFirst, isLast, onMove, onDirtyChange }) {
    const [fields, setFields] = useState(block.fields);
    const [savedJson, setSavedJson] = useState(() => JSON.stringify(block.fields));
    const [imageUploads, setImageUploads] = useState({}); // dotted-path -> File
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    function setField(path, value) {
        setFields((prev) => {
            const next = structuredClone(prev);
            const parts = path.split('.');
            let obj = next;
            for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
            obj[parts[parts.length - 1]] = value;
            return next;
        });
    }

    const dirty = JSON.stringify(fields) !== savedJson || Object.keys(imageUploads).length > 0;
    useEffect(() => onDirtyChange(block.label, dirty), [dirty]);

    function setImage(path, file) {
        setImageUploads((prev) => ({ ...prev, [path]: file }));
    }

    function save() {
        setSaving(true);
        const formData = new FormData();
        formData.append('fields', JSON.stringify(fields));
        Object.entries(imageUploads).forEach(([path, file]) => {
            formData.append(`upload_${path}`, file);
        });

        setError(null);
        router.post(`/admin/content/${block.section_key}`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                // Uploaded files are now stored server-side: forget them so the
                // next Save doesn't upload them again, and pick up their new
                // paths from the fresh props.
                setImageUploads({});
                const fresh = page.props.blocks?.find((b) => b.section_key === block.section_key);
                if (fresh) setFields(fresh.fields);
                setSavedJson(JSON.stringify(fresh?.fields ?? fields));
            },
            onError: (errors) => setError(Object.values(errors)[0] ?? 'Could not save this section.'),
            onFinish: () => setSaving(false),
        });
    }

    const f = fields;

    return (
        <div className="rounded-sm border border-brand-border bg-brand-surfaceAlt p-6">
            <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-lg text-brand-foreground">
                    {block.label}
                    {dirty && (
                        <span className="ml-3 rounded-full bg-brand-gold/15 px-2 py-0.5 align-middle font-sans text-[11px] uppercase tracking-wider text-brand-gold">
                            Unsaved changes
                        </span>
                    )}
                </h3>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => onMove(block, -1)}
                        aria-label="Move up"
                        className="flex h-10 w-10 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold disabled:opacity-30"
                    >
                        <LuArrowUp className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        disabled={isLast}
                        onClick={() => onMove(block, 1)}
                        aria-label="Move down"
                        className="flex h-10 w-10 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold disabled:opacity-30"
                    >
                        <LuArrowDown className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {block.section_key === 'hero' && (
                    <>
                        <TextInput label="Small heading above title (optional — blank shows a Good Morning/Evening greeting)" value={f.eyebrow} onChange={(v) => setField('eyebrow', v)} />
                        <TextInput label="Headline" value={f.title} onChange={(v) => setField('title', v)} />
                        <Textarea label="Subheadline" value={f.subtitle} onChange={(v) => setField('subtitle', v)} />
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput label="Main button text" value={f.cta_label} onChange={(v) => setField('cta_label', v)} />
                            <TextInput label="Second button text" value={f.secondary_label} onChange={(v) => setField('secondary_label', v)} />
                        </div>
                        <p className="text-xs uppercase tracking-wider text-brand-foregroundMuted">Background Slideshow Images</p>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {(f.images || []).map((img, i) => (
                                <ImageField key={i} label={`Image ${i + 1}`} value={img} onChange={(file) => setImage(`images.${i}`, file)} />
                            ))}
                        </div>
                    </>
                )}

                {block.section_key === 'about' && (
                    <>
                        <TextInput label="Small heading above title (optional)" value={f.eyebrow} onChange={(v) => setField('eyebrow', v)} />
                        <TextInput label="Headline" value={f.heading} onChange={(v) => setField('heading', v)} />
                        <TextInput label="Highlighted Quote" value={f.quote} onChange={(v) => setField('quote', v)} />
                        <Textarea
                            label="About us text (press Enter twice for a new paragraph)"
                            rows={8}
                            value={f.body}
                            onChange={(v) => setField('body', v)}
                        />
                        <ImageField label="Photo" value={f.image} onChange={(file) => setImage('image', file)} />
                    </>
                )}

                {block.section_key === 'crave_break' && (
                    <>
                        <TextInput label="Small heading above title (optional)" value={f.eyebrow} onChange={(v) => setField('eyebrow', v)} />
                        <TextInput label="Headline" value={f.heading} onChange={(v) => setField('heading', v)} />
                        <p className="text-xs uppercase tracking-wider text-brand-foregroundMuted">Photo Tiles</p>
                        <div className="grid grid-cols-2 gap-4">
                            {(f.items || []).map((item, i) => (
                                <div key={i} className="space-y-2 rounded-sm border border-brand-border p-3">
                                    <ImageField label={`Tile ${i + 1} Image`} value={item.image} onChange={(file) => setImage(`items.${i}.image`, file)} />
                                    <TextInput label={`Tile ${i + 1} Caption`} value={item.word} onChange={(v) => setField(`items.${i}.word`, v)} />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {block.section_key === 'reservations_banner' && (
                    <>
                        <TextInput label="Small heading above title (optional)" value={f.eyebrow} onChange={(v) => setField('eyebrow', v)} />
                        <TextInput label="Headline" value={f.heading} onChange={(v) => setField('heading', v)} />
                        <Textarea label="Intro Text" value={f.intro} onChange={(v) => setField('intro', v)} />
                        <ImageField label="Side Photo" value={f.image} onChange={(file) => setImage('image', file)} />
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput label="Text on the photo — line 1 (small)" value={f.panel_eyebrow} onChange={(v) => setField('panel_eyebrow', v)} />
                            <TextInput label="Text on the photo — line 2 (large)" value={f.panel_heading} onChange={(v) => setField('panel_heading', v)} />
                        </div>
                    </>
                )}
            </div>

            <div className="mt-5 flex flex-col items-end gap-2">
                {error && <p className="text-sm text-brand-danger">{error}</p>}
                <button
                    type="button"
                    disabled={saving}
                    onClick={save}
                    className="flex items-center gap-2 rounded-sm bg-brand-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight disabled:opacity-60"
                >
                    <LuSave className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Section'}
                </button>
            </div>
        </div>
    );
}

function TextInput({ label, value, onChange }) {
    return (
        <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-brand-foregroundMuted">{label}</label>
            <input
                type="text"
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-sm border border-brand-border bg-brand-background px-4 py-2.5 text-sm text-brand-foreground outline-none focus:border-brand-gold"
            />
        </div>
    );
}

function Textarea({ label, value, onChange, rows = 3 }) {
    return (
        <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-brand-foregroundMuted">{label}</label>
            <textarea
                rows={rows}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full resize-none rounded-sm border border-brand-border bg-brand-background px-4 py-2.5 text-sm text-brand-foreground outline-none focus:border-brand-gold"
            />
        </div>
    );
}

export default function Content({ blocks = [] }) {
    const [ordered, setOrdered] = useState(blocks);
    const [dirty, setDirty] = useState({}); // section label -> bool
    const unsaved = Object.keys(dirty).filter((k) => dirty[k]);
    const onDirtyChange = (label, isDirty) => setDirty((d) => (d[label] === isDirty ? d : { ...d, [label]: isDirty }));

    // Warn before leaving with unsaved edits (tab close or admin navigation).
    useEffect(() => {
        if (!unsaved.length) return undefined;
        const onUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', onUnload);
        const off = router.on('before', (e) => {
            if (e.detail.visit.method !== 'get' || e.detail.visit.url.pathname === '/admin/content') return true;
            return window.confirm(`You have unsaved changes in: ${unsaved.join(', ')}. Leave without saving?`);
        });
        return () => {
            window.removeEventListener('beforeunload', onUnload);
            off();
        };
    }, [unsaved.join('|')]);

    function move(block, direction) {
        const index = ordered.findIndex((b) => b.section_key === block.section_key);
        const swapIndex = index + direction;
        if (swapIndex < 0 || swapIndex >= ordered.length) return;

        const next = [...ordered];
        [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
        setOrdered(next);

        // Persist the whole order in ONE request. Two parallel requests (one
        // per swapped section) made Inertia cancel the first, so the new
        // order never stuck after a reload.
        router.patch(
            '/admin/content-order',
            { order: next.map((b) => b.section_key) },
            { preserveScroll: true, preserveState: true, onError: () => setOrdered(ordered) }
        );
    }

    return (
        <AdminLayout title="Website Content">
            <Head title="Admin — Website Content" />
            <p className="mb-6 text-sm text-brand-foregroundMuted">
                Edit the text and photos shown on the homepage, section by section. Use the arrows to
                change the order sections appear on the site.
            </p>
            {unsaved.length > 0 && (
                <div className="sticky top-16 z-20 mb-4 rounded-sm border border-brand-gold bg-brand-surface px-4 py-3 text-sm text-brand-gold shadow-lg">
                    Unsaved changes in <strong>{unsaved.join(', ')}</strong> — press that section&rsquo;s Save button.
                </div>
            )}
            <div className="space-y-6">
                {ordered.map((block, i) => (
                    <SectionCard
                        key={block.section_key}
                        block={block}
                        isFirst={i === 0}
                        isLast={i === ordered.length - 1}
                        onMove={move}
                        onDirtyChange={onDirtyChange}
                    />
                ))}
            </div>
        </AdminLayout>
    );
}
