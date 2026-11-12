import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
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
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [label, setLabel] = useState('');
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    function openUpload() {
        setFile(null);
        setPreview(null);
        setLabel('');
        setErrors({});
        setPanel({ mode: 'upload' });
    }

    function openEdit(image) {
        setLabel(image.label ?? '');
        setErrors({});
        setPanel({ mode: 'edit', image });
    }

    function handleFile(e) {
        const chosen = e.target.files?.[0] ?? null;
        setErrors({});
        if (chosen && chosen.size > MAX_IMAGE_MB * 1024 * 1024) {
            setErrors({ image: `The image must be ${MAX_IMAGE_MB} MB or smaller.` });
            e.target.value = '';
            return;
        }
        setFile(chosen);
        setPreview(chosen ? URL.createObjectURL(chosen) : null);
    }

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

        if (!file) {
            setSaving(false);
            setErrors({ image: 'Choose an image to upload.' });
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        formData.append('label', label);
        router.post('/admin/gallery', formData, { ...options, forceFormData: true });
    }

    function handleDelete(img) {
        if (!window.confirm(`Delete "${img.label}"?`)) return;
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
                                label={`Image (JPG, PNG or WebP, up to ${MAX_IMAGE_MB} MB)`}
                                type="file"
                                accept="image/*"
                                onChange={handleFile}
                                error={errors.image}
                            />
                            {preview && (
                                <img src={preview} alt="Preview" className="mt-3 h-40 w-full rounded-sm border border-brand-border object-cover" />
                            )}
                        </div>
                    )}
                    <FloatingField
                        id="gallery-label"
                        label="Label"
                        value={label}
                        maxLength={150}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="e.g. The Terrace"
                        error={errors.label}
                    />
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full rounded-sm bg-brand-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight disabled:opacity-60"
                    >
                        {saving ? 'Saving…' : panel?.mode === 'edit' ? 'Save Label' : 'Upload'}
                    </button>
                </form>
            </SlideOver>
        </AdminLayout>
    );
}
