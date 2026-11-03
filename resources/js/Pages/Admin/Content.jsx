import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { LuArrowUp, LuArrowDown, LuUpload, LuSave } from 'react-icons/lu';

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
            <div className="flex items-center gap-3">
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-sm border border-brand-border bg-brand-surfaceAlt">
                    {preview && (
                        <img src={preview} alt={label} className="h-full w-full object-cover" />
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex items-center gap-2 rounded-sm border border-brand-border px-3 py-2 text-xs uppercase tracking-wider text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                >
                    <LuUpload className="h-3.5 w-3.5" />
                    Replace Image
                </button>
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
        </div>
    );
}

function SectionCard({ block, isFirst, isLast, onMove }) {
    const [fields, setFields] = useState(block.fields);
    const [imageUploads, setImageUploads] = useState({}); // dotted-path -> File
    const [saving, setSaving] = useState(false);

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

        router.post(`/admin/content/${block.section_key}`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    }

    const f = fields;

    return (
        <div className="rounded-sm border border-brand-border bg-brand-surfaceAlt p-6">
            <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-lg text-brand-foreground">{block.label}</h3>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => onMove(block, -1)}
                        aria-label="Move up"
                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold disabled:opacity-30"
                    >
                        <LuArrowUp className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        disabled={isLast}
                        onClick={() => onMove(block, 1)}
                        aria-label="Move down"
                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold disabled:opacity-30"
                    >
                        <LuArrowDown className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {block.section_key === 'hero' && (
                    <>
                        <TextInput label="Eyebrow Text (small text above headline — leave blank for automatic time-of-day greeting)" value={f.eyebrow} onChange={(v) => setField('eyebrow', v)} />
                        <TextInput label="Headline" value={f.title} onChange={(v) => setField('title', v)} />
                        <Textarea label="Subheadline" value={f.subtitle} onChange={(v) => setField('subtitle', v)} />
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput label="Button 1 Label" value={f.cta_label} onChange={(v) => setField('cta_label', v)} />
                            <TextInput label="Button 2 Label" value={f.secondary_label} onChange={(v) => setField('secondary_label', v)} />
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
                        <TextInput label="Eyebrow Text" value={f.eyebrow} onChange={(v) => setField('eyebrow', v)} />
                        <TextInput label="Headline" value={f.heading} onChange={(v) => setField('heading', v)} />
                        <TextInput label="Highlighted Quote" value={f.quote} onChange={(v) => setField('quote', v)} />
                        <Textarea
                            label="Story Text (separate paragraphs with a blank line)"
                            rows={8}
                            value={f.body}
                            onChange={(v) => setField('body', v)}
                        />
                        <ImageField label="Photo" value={f.image} onChange={(file) => setImage('image', file)} />
                    </>
                )}

                {block.section_key === 'crave_break' && (
                    <>
                        <TextInput label="Eyebrow Text" value={f.eyebrow} onChange={(v) => setField('eyebrow', v)} />
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
                        <TextInput label="Eyebrow Text" value={f.eyebrow} onChange={(v) => setField('eyebrow', v)} />
                        <TextInput label="Headline" value={f.heading} onChange={(v) => setField('heading', v)} />
                        <Textarea label="Intro Text" value={f.intro} onChange={(v) => setField('intro', v)} />
                        <ImageField label="Side Photo" value={f.image} onChange={(file) => setImage('image', file)} />
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput label="Photo Overlay Eyebrow" value={f.panel_eyebrow} onChange={(v) => setField('panel_eyebrow', v)} />
                            <TextInput label="Photo Overlay Caption" value={f.panel_heading} onChange={(v) => setField('panel_heading', v)} />
                        </div>
                    </>
                )}
            </div>

            <div className="mt-5 flex justify-end">
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

    function move(block, direction) {
        const index = ordered.findIndex((b) => b.section_key === block.section_key);
        const swapIndex = index + direction;
        if (swapIndex < 0 || swapIndex >= ordered.length) return;

        const next = [...ordered];
        [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
        setOrdered(next);

        // Persist new sort_order for both swapped sections.
        next.forEach((b, i) => {
            if (b.section_key === block.section_key || b.section_key === ordered[swapIndex].section_key) {
                router.patch(`/admin/content/${b.section_key}/order`, { sort_order: i }, { preserveScroll: true, preserveState: true });
            }
        });
    }

    return (
        <AdminLayout title="Website Content">
            <Head title="Admin — Website Content" />
            <p className="mb-6 text-sm text-brand-foregroundMuted">
                Edit the text and photos shown on the homepage, section by section. Use the arrows to
                change the order sections appear on the site.
            </p>
            <div className="space-y-6">
                {ordered.map((block, i) => (
                    <SectionCard
                        key={block.section_key}
                        block={block}
                        isFirst={i === 0}
                        isLast={i === ordered.length - 1}
                        onMove={move}
                    />
                ))}
            </div>
        </AdminLayout>
    );
}
