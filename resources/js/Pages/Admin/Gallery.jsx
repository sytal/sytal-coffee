import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { LuUpload, LuTrash2, LuEye } from 'react-icons/lu';

export default function Gallery({ images = [] }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    function handleDelete(img) {
        if (!window.confirm(`Delete "${img.label}"?`)) return;
        router.delete(`/admin/gallery/${img.id}`, { preserveScroll: true });
    }

    function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        const label = window.prompt('Label for this image?', '') ?? '';
        const formData = new FormData();
        formData.append('image', file);
        formData.append('label', label);

        setUploading(true);
        router.post('/admin/gallery', formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    }

    return (
        <AdminLayout title="Gallery">
            <Head title="Admin — Gallery" />

            <div className="flex items-center justify-between">
                <p className="text-sm text-brand-foregroundMuted">{images.length} images</p>
                <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-sm bg-brand-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight disabled:opacity-60"
                >
                    <LuUpload className="h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Upload Images'}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((img) => (
                    <div
                        key={img.id}
                        className="group relative aspect-square overflow-hidden rounded-sm border border-brand-border"
                    >
                        <img
                            src={img.image}
                            alt={img.label}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/0 to-black/0 p-3 opacity-0 transition group-hover:opacity-100">
                            <p className="mb-2 text-xs text-white">{img.label}</p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="flex h-7 w-7 items-center justify-center rounded-sm bg-white/15 text-white backdrop-blur transition hover:bg-brand-gold hover:text-brand-background"
                                    aria-label={`View ${img.label}`}
                                >
                                    <LuEye className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(img)}
                                    className="flex h-7 w-7 items-center justify-center rounded-sm bg-white/15 text-white backdrop-blur transition hover:bg-brand-danger"
                                    aria-label={`Delete ${img.label}`}
                                >
                                    <LuTrash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold">
                    <LuUpload className="h-6 w-6" />
                    <span className="text-xs uppercase tracking-wider">Add Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
            </div>
        </AdminLayout>
    );
}
