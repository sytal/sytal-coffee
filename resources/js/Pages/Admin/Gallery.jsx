import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { LuUpload, LuTrash2, LuEye } from 'react-icons/lu';

const GALLERY_IMAGES = [
    { src: '/images/outdoors-of-the-restaurant.jpg', label: 'The Terrace' },
    { src: '/images/fire-from-wok.jpg', label: 'Open Kitchen' },
    { src: '/images/gallery/gallery-2.jpg', label: 'The Dining Room' },
    { src: '/images/gallery/gallery-4.jpg', label: 'Evening Service' },
    { src: '/images/chef-preparing-the-plates.jpg', label: 'In the Kitchen' },
    { src: '/images/gallery/gallery-6.jpg', label: 'Private Lounge' },
    { src: '/images/gallery/gallery-3.jpg', label: 'Afternoon Light' },
    { src: '/images/gallery/gallery-7.jpg', label: 'Bar Service' },
];

export default function Gallery() {
    return (
        <AdminLayout title="Gallery">
            <Head title="Admin — Gallery" />

            <div className="flex items-center justify-between">
                <p className="text-sm text-brand-foregroundMuted">{GALLERY_IMAGES.length} images</p>
                <button
                    type="button"
                    className="flex items-center gap-2 rounded-sm bg-brand-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight"
                >
                    <LuUpload className="h-4 w-4" />
                    Upload Images
                </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {GALLERY_IMAGES.map((img) => (
                    <div
                        key={img.src}
                        className="group relative aspect-square overflow-hidden rounded-sm border border-brand-border"
                    >
                        <img
                            src={img.src}
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
                    <input type="file" className="hidden" accept="image/*" />
                </label>
            </div>
        </AdminLayout>
    );
}
