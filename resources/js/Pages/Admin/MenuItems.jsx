import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import SlideOver from '@/Components/Admin/SlideOver';
import FloatingField from '@/Components/FloatingField';
import { MENU_CATEGORIES, MENU_ITEMS } from '@/data/menuItems';
import { LuPlus, LuPencil, LuTrash2, LuSearch } from 'react-icons/lu';

export default function MenuItems() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [panelOpen, setPanelOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const items = MENU_ITEMS.filter((item) => {
        const matchesCategory = category === 'All' || item.category === category;
        const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
    });

    function openAdd() {
        setEditingItem(null);
        setPanelOpen(true);
    }

    function openEdit(item) {
        setEditingItem(item);
        setPanelOpen(true);
    }

    return (
        <AdminLayout title="Menu Items">
            <Head title="Admin — Menu Items" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-foregroundMuted" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search menu items..."
                            className="w-56 rounded-sm border border-brand-border bg-brand-surface py-2 pl-9 pr-3 text-sm text-brand-foreground placeholder:text-brand-foregroundMuted/60 outline-none focus:border-brand-gold"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-sm border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-foreground outline-none focus:border-brand-gold"
                    >
                        <option>All</option>
                        {MENU_CATEGORIES.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={openAdd}
                    className="flex items-center justify-center gap-2 rounded-sm bg-brand-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight"
                >
                    <LuPlus className="h-4 w-4" />
                    Add Item
                </button>
            </div>

            <div className="mt-6 overflow-x-auto rounded-sm border border-brand-border bg-brand-surface">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-brand-border text-xs uppercase tracking-wider text-brand-foregroundMuted">
                            <th className="p-4 font-normal">Item</th>
                            <th className="p-4 font-normal">Category</th>
                            <th className="p-4 font-normal">Price</th>
                            <th className="p-4 font-normal">Tags</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.slice(0, 40).map((item) => (
                            <tr key={item.name} className="border-b border-brand-border/60 last:border-0">
                                <td className="flex items-center gap-3 p-4">
                                    <img
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
                                    <div className="flex flex-wrap gap-1">
                                        {item.tags?.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full border border-brand-border px-2 py-0.5 text-[10px] text-brand-foregroundMuted"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
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
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setPanelOpen(false);
                    }}
                    className="space-y-5"
                >
                    <FloatingField label="Item name" defaultValue={editingItem?.name} type="text" />
                    <FloatingField
                        label="Description"
                        as="textarea"
                        rows={3}
                        defaultValue={editingItem?.description}
                        className="resize-none"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FloatingField label="Price" defaultValue={editingItem?.price} type="text" />
                        <FloatingField
                            label="Category"
                            as="select"
                            alwaysFloated
                            defaultValue={editingItem?.category ?? MENU_CATEGORIES[0]}
                        >
                            {MENU_CATEGORIES.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </FloatingField>
                    </div>
                    <FloatingField label="Tags (comma separated)" defaultValue={editingItem?.tags?.join(', ')} type="text" />
                    <button
                        type="submit"
                        className="w-full rounded-sm bg-brand-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-brand-background transition hover:bg-brand-goldLight"
                    >
                        {editingItem ? 'Save Changes' : 'Add Item'}
                    </button>
                </form>
            </SlideOver>
        </AdminLayout>
    );
}
