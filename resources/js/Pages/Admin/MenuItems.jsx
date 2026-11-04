import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import SlideOver from '@/Components/Admin/SlideOver';
import FloatingField from '@/Components/FloatingField';
import { LuPlus, LuPencil, LuTrash2, LuSearch } from 'react-icons/lu';
import { Zoomable } from '@/Components/Admin/ImageLightbox';

export default function MenuItems({ menuItems = [], categories = [] }) {
    const [tab, setTab] = useState('items'); // 'items' | 'categories'
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [panelOpen, setPanelOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const [catPanelOpen, setCatPanelOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [catSubmitting, setCatSubmitting] = useState(false);

    const categoryNames = categories.map((c) => c.name);
    const categoryIds = Object.fromEntries(categories.map((c) => [c.name, c.id]));

    const items = menuItems.filter((item) => {
        const matchesCategory = category === 'All' || item.category === category;
        const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
    });

    function openAdd() {
        setEditingItem(null);
        setImagePreview(null);
        setPanelOpen(true);
    }

    function openEdit(item) {
        setEditingItem(item);
        setImagePreview(item.image ?? null);
        setPanelOpen(true);
    }

    function handleImageChange(e) {
        const file = e.target.files?.[0];
        setImagePreview(file ? URL.createObjectURL(file) : editingItem?.image ?? null);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const formEl = e.target;
        const formData = new FormData(formEl);

        // Drop the file field entirely if nothing was chosen so validation
        // treats it as absent rather than an empty file.
        const imageFile = formData.get('image');
        if (imageFile instanceof File && imageFile.size === 0) {
            formData.delete('image');
        }

        setSubmitting(true);
        const onDone = () => {
            setSubmitting(false);
            setPanelOpen(false);
        };

        if (editingItem) {
            formData.append('_method', 'put');
            router.post(`/admin/menu/${editingItem.id}`, formData, {
                forceFormData: true,
                onSuccess: onDone,
                onError: () => setSubmitting(false),
            });
        } else {
            router.post('/admin/menu', formData, {
                forceFormData: true,
                onSuccess: onDone,
                onError: () => setSubmitting(false),
            });
        }
    }

    function handleDelete(item) {
        if (!window.confirm(`Delete "${item.name}"?`)) return;
        router.delete(`/admin/menu/${item.id}`);
    }

    function openAddCategory() {
        setEditingCategory(null);
        setCatPanelOpen(true);
    }

    function openEditCategory(name) {
        setEditingCategory(name);
        setCatPanelOpen(true);
    }

    function handleCategorySubmit(e) {
        e.preventDefault();
        const name = new FormData(e.target).get('name');
        setCatSubmitting(true);
        const onDone = () => {
            setCatSubmitting(false);
            setCatPanelOpen(false);
        };

        if (editingCategory) {
            const id = categoryIds[editingCategory];
            router.put(`/admin/categories/${id}`, { name }, { onSuccess: onDone, onError: () => setCatSubmitting(false) });
        } else {
            router.post('/admin/categories', { name }, { onSuccess: onDone, onError: () => setCatSubmitting(false) });
        }
    }

    function handleDeleteCategory(name) {
        if (!window.confirm(`Delete category "${name}"?`)) return;
        router.delete(`/admin/categories/${categoryIds[name]}`);
    }

    return (
        <AdminLayout title="Menu Items">
            <Head title="Admin — Menu Items" />

            <div className="flex gap-2 border-b border-brand-border">
                <button
                    type="button"
                    onClick={() => setTab('items')}
                    className={`px-4 py-2.5 text-sm uppercase tracking-wider transition ${
                        tab === 'items'
                            ? 'border-b-2 border-brand-gold text-brand-gold'
                            : 'text-brand-foregroundMuted hover:text-brand-foreground'
                    }`}
                >
                    Items
                </button>
                <button
                    type="button"
                    onClick={() => setTab('categories')}
                    className={`px-4 py-2.5 text-sm uppercase tracking-wider transition ${
                        tab === 'categories'
                            ? 'border-b-2 border-brand-gold text-brand-gold'
                            : 'text-brand-foregroundMuted hover:text-brand-foreground'
                    }`}
                >
                    Categories
                </button>
            </div>

            {tab === 'categories' ? (
                <div className="mt-6">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={openAddCategory}
                            className="flex items-center justify-center gap-2 rounded-sm bg-brand-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight"
                        >
                            <LuPlus className="h-4 w-4" />
                            Add Category
                        </button>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                        {categories.map((c) => (
                            <div
                                key={c.id}
                                className="flex items-center justify-between rounded-sm border border-brand-border bg-brand-surface px-4 py-3"
                            >
                                <span className="text-brand-foreground">{c.name}</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openEditCategory(c.name)}
                                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                                        aria-label={`Edit ${c.name}`}
                                    >
                                        <LuPencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteCategory(c.name)}
                                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-danger hover:text-brand-danger"
                                        aria-label={`Delete ${c.name}`}
                                    >
                                        <LuTrash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <p className="rounded-sm border border-brand-border bg-brand-surface p-8 text-center text-sm text-brand-foregroundMuted">
                                No categories yet.
                            </p>
                        )}
                    </div>
                </div>
            ) : (
            <>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:w-56">
                        <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-foregroundMuted" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search menu items..."
                            className="w-full rounded-sm border border-brand-border bg-brand-surface py-2 pl-9 pr-3 text-sm text-brand-foreground placeholder:text-brand-foregroundMuted/60 outline-none focus:border-brand-gold"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-sm border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand-gold sm:w-auto"
                    >
                        <option>All</option>
                        {categoryNames.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={openAdd}
                    className="flex w-full items-center justify-center gap-2 rounded-sm bg-brand-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight sm:w-auto"
                >
                    <LuPlus className="h-4 w-4" />
                    Add Item
                </button>
            </div>

            {/* Mobile: stacked cards */}
            <div className="mt-6 flex flex-col gap-3 sm:hidden">
                {items.slice(0, 40).map((item) => (
                    <div key={item.id} className="rounded-sm border border-brand-border bg-brand-surface p-4">
                        <div className="flex items-start gap-3">
                            <Zoomable
                                src={item.image}
                                alt={item.name}
                                loading="lazy"
                                className="h-12 w-12 shrink-0 rounded-sm object-cover"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-brand-foreground">{item.name}</p>
                                <p className="text-xs text-brand-foregroundMuted">{item.category}</p>
                                <p className="mt-1 text-brand-gold">{item.price}</p>
                            </div>
                            <div className="flex shrink-0 gap-2">
                                <button
                                    type="button"
                                    onClick={() => openEdit(item)}
                                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                                    aria-label={`Edit ${item.name}`}
                                >
                                    <LuPencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item)}
                                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-danger hover:text-brand-danger"
                                    aria-label={`Delete ${item.name}`}
                                >
                                    <LuTrash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <p className="rounded-sm border border-brand-border bg-brand-surface p-8 text-center text-sm text-brand-foregroundMuted">
                        No items match your search.
                    </p>
                )}
            </div>

            {/* Tablet+: table */}
            <div className="mt-6 hidden overflow-x-auto rounded-sm border border-brand-border bg-brand-surface sm:block">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-brand-border text-xs uppercase tracking-wider text-brand-foregroundMuted">
                            <th className="p-4 font-normal">Item</th>
                            <th className="p-4 font-normal">Category</th>
                            <th className="p-4 font-normal">Price</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.slice(0, 40).map((item) => (
                            <tr key={item.id} className="border-b border-brand-border/60 last:border-0">
                                <td className="flex items-center gap-3 p-4">
                                    <Zoomable
                                        src={item.image}
                                        alt={item.name}
                                        loading="lazy"
                                        className="h-10 w-10 rounded-sm object-cover"
                                    />
                                    <span className="text-brand-foreground">{item.name}</span>
                                </td>
                                <td className="p-4 text-brand-foregroundMuted">{item.category}</td>
                                <td className="p-4 text-brand-gold">{item.price}</td>
                                <td className="p-4">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(item)}
                                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-gold hover:text-brand-gold"
                                            aria-label={`Edit ${item.name}`}
                                        >
                                            <LuPencil className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item)}
                                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-brand-border text-brand-foregroundMuted transition hover:border-brand-danger hover:text-brand-danger"
                                            aria-label={`Delete ${item.name}`}
                                        >
                                            <LuTrash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {items.length === 0 && (
                    <p className="p-8 text-center text-sm text-brand-foregroundMuted">No items match your search.</p>
                )}
            </div>

            <SlideOver
                open={panelOpen}
                onClose={() => setPanelOpen(false)}
                title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <FloatingField
                        label="Item name"
                        name="name"
                        defaultValue={editingItem?.name}
                        type="text"
                        placeholder="e.g. Loaded Cheese Fries"
                        required
                    />
                    <FloatingField
                        label="Description"
                        name="description"
                        as="textarea"
                        rows={3}
                        defaultValue={editingItem?.description}
                        className="resize-none"
                        placeholder="Short description shown to customers"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FloatingField
                            label="Price"
                            name="price"
                            defaultValue={editingItem?.price}
                            type="text"
                            placeholder="e.g. Rs. 450"
                            required
                        />
                        <FloatingField
                            label="Category"
                            name="category"
                            as="select"
                            alwaysFloated
                            defaultValue={editingItem?.category ?? categoryNames[0]}
                        >
                            {categoryNames.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </FloatingField>
                    </div>
                    <div>
                        <FloatingField
                            label="Image"
                            name="image"
                            type="file"
                            accept="image/*"
                            alwaysFloated
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <Zoomable
                                src={imagePreview}
                                alt="Preview"
                                className="mt-3 h-32 w-full rounded-sm border border-brand-border object-cover"
                            />
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-sm bg-brand-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight disabled:opacity-60"
                    >
                        {editingItem ? 'Save Changes' : 'Add Item'}
                    </button>
                </form>
            </SlideOver>
            </>
            )}

            <SlideOver
                open={catPanelOpen}
                onClose={() => setCatPanelOpen(false)}
                title={editingCategory ? 'Edit Category' : 'Add Category'}
            >
                <form onSubmit={handleCategorySubmit} className="space-y-5">
                    <FloatingField
                        label="Category name"
                        name="name"
                        defaultValue={editingCategory ?? ''}
                        type="text"
                        placeholder="e.g. Loaded Fries"
                        required
                    />
                    <button
                        type="submit"
                        disabled={catSubmitting}
                        className="w-full rounded-sm bg-brand-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight disabled:opacity-60"
                    >
                        {editingCategory ? 'Save Changes' : 'Add Category'}
                    </button>
                </form>
            </SlideOver>
        </AdminLayout>
    );
}
