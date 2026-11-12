import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { confirmDialog } from '@/Components/Admin/ConfirmHost';
import SlideOver from '@/Components/Admin/SlideOver';
import FloatingField from '@/Components/FloatingField';
import { LuUpload, LuTrash2, LuPencil } from 'react-icons/lu';
import { Zoomable } from '@/Components/Admin/ImageLightbox';

const MAX_IMAGE_MB = 4;

/**
 * Upload and label images in a proper drawer (no browser prompt()), and
 * edit a label later with the pencil button. Errors from the server (wrong
 * file type, too large, upload failed) are shown inside the drawer.
 */
export default function Gallery({ images = [] }) {
    const [panel, setPanel] = useState(null); // null | { mode: 'upload' } | { mode: 'edit', image }
    const [files, setFiles] = useState([]); // [{ file, preview, label }]
    const [label, setLabel] = useState('');
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    function openUpload() {
        setFiles([]);
        setLabel('');
        setErrors({});
        setPanel({ mode: 'upload' });
    }

    function openEdit(image) {
        setLabel(image.label ?? '');
        setErrors({});
        setPanel({ mode: 'edit', image });
    }

    // Several photos can be picked at once; each gets an optional label.
    function handleFile(e) {
        const chosen = Array.from(e.target.files ?? []);
        const tooBig = chosen.filter((f) => f.size > MAX_IMAGE_MB * 1024 * 1024);
        setErrors(tooBig.length ? { image: `Skipped ${tooBig.map((f) => f.name).join(', ')} — images must be ${MAX_IMAGE_MB} MB or smaller.` } : {});
        setFiles((prev) => [
            ...prev,
            ...chosen.filter((f) => !tooBig.includes(f)).map((file) => ({ file, preview: URL.createObjectURL(file), label: '' })),
        ]);
        e.target.value = '';
    }

    const setFileLabel = (i, value) => setFiles((list) => list.map((f, j) => (j === i ? { ...f, label: value } : f)));
    const removeFile = (i) => setFiles((list) => list.filter((_, j) => j !== i));

    function submit(e) {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        const options = {
            preserveScroll: true,
            onSuccess: () => setPanel(null),
            onError: (errs) => setErrors(errs),
            onFinish: () => setSaving(false),
        };

        if (panel?.mode === 'edit') {
            router.patch(`/admin/gallery/${panel.image.id}`, { label }, options);
            return;
        }

        if (!files.length) {
            setSaving(false);
            setErrors({ image: 'Choose at least one image to upload.' });
            return;
        }
        const formData = new FormData();
        files.forEach(({ file, label: l }) => {
            formData.append('images[]', file);
            formData.append('labels[]', l);
        });
        router.post('/admin/gallery', formData, { ...options, forceFormData: true });
    }

    async function handleDelete(img) {
        if (!(await confirmDialog(`Delete "${img.label}"?`))) return;
        router.delete(`/admin/gallery/${img.id}`, { preserveScroll: true });
    }

    return (
        <AdminLayout title="Gallery">
            <Head title="Admin — Gallery" />

            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-brand-foregroundMuted">{images.length} images</p>
                <button
                    type="button"
                    onClick={openUpload}
                    className="flex items-center gap-2 rounded-sm bg-brand-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight"
                >
                    <LuUpload className="h-4 w-4" />
                    Upload Image
                </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((img) => (
                    <div
                        key={img.id}
                        className="group relative aspect-square overflow-hidden rounded-sm border border-brand-border"
                    >
                        <Zoomable
                            src={img.image}
                            alt={img.label}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
                        />
                        {/* Always visible on touch screens; revealed on hover with a mouse. */}
                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/0 to-black/0 p-3 transition sm:opacity-0 sm:group-hover:opacity-100">
                            <p className="mb-2 truncate text-xs text-white">{img.label}</p>
                            <div className="pointer-events-auto flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => openEdit(img)}
                                    className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/15 text-white backdrop-blur transition hover:bg-brand-gold hover:text-brand-background"
                                    aria-label={`Edit label of ${img.label}`}
                                >
                                    <LuPencil className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(img)}
                                    className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/15 text-white backdrop-blur transition hover:bg-brand-danger"
                                    aria-label={`Delete ${img.label}`}
                                >
                                    <LuTrash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={openUpload}
                    className="flex aspect-square flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                >
                    <LuUpload className="h-6 w-6" />
                    <span className="text-xs uppercase tracking-wider">Add Image</span>
                </button>
            </div>

            <SlideOver
                open={Boolean(panel)}
                onClose={() => setPanel(null)}
                title={panel?.mode === 'edit' ? 'Edit Image Label' : 'Upload Image'}
            >
                <form key={panel?.mode === 'edit' ? panel.image.id : 'upload'} onSubmit={submit} className="space-y-5" noValidate>
                    {panel?.mode === 'edit' ? (
                        <img src={panel.image.image} alt="" className="h-40 w-full rounded-sm border border-brand-border object-cover" />
                    ) : (
                        <div>
                            <FloatingField
                                id="gallery-image"
                                label="Images"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFile}
                                error={errors.image}
                            />
                            {Object.entries(errors)
                                .filter(([k]) => k.startsWith('images'))
                                .slice(0, 1)
                                .map(([k, msg]) => (
                                    <p key={k} className="mt-2 text-xs text-brand-danger">{msg}</p>
                                ))}
                            <ul className="mt-3 space-y-3">
                                {files.map((f, i) => (
                                    <li key={f.preview} className="flex items-center gap-3">
                                        <img src={f.preview} alt="" className="h-14 w-14 shrink-0 rounded-sm border border-brand-border object-cover" />
                                        <input
                                            value={f.label}
                                            maxLength={150}
                                            onChange={(e) => setFileLabel(i, e.target.value)}
                                            placeholder="Label (optional)"
                                            className="min-w-0 flex-1 rounded-sm border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand-gold"
                                        />
                                        <button type="button" onClick={() => removeFile(i)} aria-label="Remove" className="flex h-10 w-10 items-center justify-center text-brand-foregroundMuted hover:text-brand-danger">
                                            <LuTrash2 className="h-4 w-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {panel?.mode === 'edit' && <FloatingField
                        id="gallery-label"
                        label="Label"
                        value={label}
                        maxLength={150}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="e.g. The Terrace"
                        error={errors.label}
                    />}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full rounded-sm bg-brand-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight disabled:opacity-60"
                    >
                        {saving ? 'Saving…' : panel?.mode === 'edit' ? 'Save Label' : files.length > 1 ? `Upload ${files.length} images` : 'Upload'}
                    </button>
                </form>
            </SlideOver>
        </AdminLayout>
    );
}
