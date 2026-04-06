'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Loader2, Image as ImageIcon, Check } from 'lucide-react';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    vendorId: string;
    product?: any;
}

export default function AddProductModal({ isOpen, onClose, onSuccess, vendorId, product }: AddProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        onlinePrice: '',
        mrp: '',
        uom: 'Piece',
        categoryId: '',
        imageUrl: '',
        type: 'Product',
        inStock: true,
        isBestSeller: false,
        description: ''
    });

    const units = ['Piece', 'Kg', 'Litre', 'Pack', 'Box', 'Dozen'];

    useEffect(() => {
        if (isOpen) {
            fetch('/api/vendor/products')
                .then(res => res.json())
                .then(data => setCategories(data.categories || []))
                .catch(err => console.error('Failed to fetch categories:', err));

            if (product) {
                setFormData({
                    name: product.name || '',
                    price: product.price?.toString() || '',
                    onlinePrice: product.online_price?.toString() || '',
                    mrp: product.mrp?.toString() || '',
                    uom: product.uom || 'Piece',
                    categoryId: product.category_id || '',
                    imageUrl: product.image_url || '',
                    type: product.type || product.product_type || 'Product',
                    inStock: product.is_active ?? product.inStock ?? true,
                    isBestSeller: product.is_best_seller ?? product.isBestSeller ?? false,
                    description: product.description || ''
                });
            } else {
                setFormData({
                    name: '',
                    price: '',
                    onlinePrice: '',
                    mrp: '',
                    uom: 'Piece',
                    categoryId: '',
                    imageUrl: '',
                    type: 'Product',
                    inStock: true,
                    isBestSeller: false,
                    description: ''
                });
            }
        }
    }, [isOpen, product]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('Image size should be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setFormData({ ...formData, imageUrl: base64String });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!vendorId) {
            alert('Error: No vendor session found. Please try logging out and in again.');
            return;
        }

        if (!formData.name || !formData.price) {
            alert('Please fill in both name and price.');
            return;
        }

        setLoading(true);

        try {
            const isEditing = !!product?.id;
            const url = isEditing ? `/api/vendor/products/${product.id}` : '/api/vendor/products';
            const method = isEditing ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, vendorId })
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const data = await res.json();
                alert(data.error || `Failed to ${isEditing ? 'update' : 'add'} product`);
            }
        } catch (error) {
            console.error(`Error ${product?.id ? 'updating' : 'adding'} product:`, error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-xl font-black text-slate-900">{product ? 'Edit Item' : 'Add New Item'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto overflow-x-hidden scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image Section */}
                        <div className="space-y-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
                            >
                                {formData.imageUrl ? (
                                    <>
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white text-xs font-bold">Change Photo</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <ImageIcon size={24} className="text-slate-400" />
                                        </div>
                                        <p className="text-xs font-bold text-slate-400">Add Product Photo</p>
                                        <p className="text-[10px] text-slate-300 mt-1">Click to upload from storage</p>
                                    </>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type="url"
                                    placeholder="Or paste image URL..."
                                    value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
                                />
                                {formData.imageUrl.startsWith('data:') && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary uppercase"
                                    >
                                        Clear Upload
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Fields Section */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Item Name *</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Fresh Milk 1L"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Local Price *</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Online Price</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.onlinePrice}
                                        onChange={e => setFormData({ ...formData, onlinePrice: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">MRP</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.mrp}
                                        onChange={e => setFormData({ ...formData, mrp: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Unit</label>
                                    <select
                                        value={formData.uom}
                                        onChange={e => setFormData({ ...formData, uom: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all appearance-none"
                                    >
                                        {units.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Category</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all appearance-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>


                            {/* Type Toggle */}
                            <div className="flex p-1 bg-slate-100 rounded-2xl">
                                {['Product', 'Service'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`flex-1 py-2 text-xs font-black transition-all rounded-xl ${formData.type === type
                                            ? 'bg-white text-primary shadow-sm'
                                            : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Switches */}
                            <div className="flex items-center justify-between px-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.inStock ? 'bg-green-500' : 'bg-slate-200'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.inStock ? 'left-5' : 'left-1'}`} />
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.inStock}
                                            onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">In Stock</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.isBestSeller ? 'bg-orange-500' : 'bg-slate-200'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isBestSeller ? 'left-5' : 'left-1'}`} />
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.isBestSeller}
                                            onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">Best Seller</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Description (Optional)</label>
                        <textarea
                            rows={3}
                            placeholder="Add item details..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                        />
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3.5 border border-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-[2] px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                            {loading ? 'Saving Item...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
