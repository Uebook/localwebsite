'use client';

import { useState } from 'react';
import VendorDashboardLayout, { useVendor } from '@/components/VendorDashboardLayout';
import { Plus, Edit, Trash2, Search, Package, Loader2, IndianRupee } from 'lucide-react';
import Image from 'next/image';
import AddProductModal from '@/components/AddProductModal';
import BulkInventoryUpload from '@/components/BulkInventoryUpload';
import { Download as DownloadIcon } from 'lucide-react';

function CatalogueContent() {
  const { products, vendor, loading, refresh } = useVendor();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const filteredProducts = products.filter((p: any) => {
    const name = p.name ?? p.product_name ?? '';
    const cat = p.category_name ?? p.category ?? p.type ?? '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(productId);
    try {
      const res = await fetch(`/api/vendor/products/${productId}`, { method: 'DELETE' });
      if (res.ok) refresh();
    } catch { }
    setDeleting(null);
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center"><Loader2 className="animate-spin" size={24} style={{ color: 'var(--primary)' }} /></div>;
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Product Catalogue</h1>
          <p className="text-slate-400 text-sm mt-0.5">{products.length} products listed</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
          >
            <DownloadIcon size={16} className="rotate-180" /> Bulk Upload
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            style={{ background: 'var(--primary)' }}
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {showBulkUpload && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <BulkInventoryUpload
            vendorId={vendor?.id || ''}
            onSuccess={() => { setShowBulkUpload(false); refresh(); }}
            onCancel={() => setShowBulkUpload(false)}
          />
        </div>
      )}

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        onSuccess={() => refresh()}
        vendorId={vendor?.id || ''}
        product={editingProduct}
      />

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none"
        />
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product: any) => {
            const name = product.name ?? product.product_name ?? 'Product';
            const price = product.price ?? product.selling_price ?? product.rate;
            const mrp = product.mrp ?? product.original_price;
            const image = product.image_url ?? product.imageUrl ?? product.photo_url;
            const inStock = product.is_active ?? product.in_stock ?? product.inStock ?? (product.stock_qty > 0);
            const qty = product.stock_qty ?? product.stockQty ?? product.quantity;
            const cat = product.category_name ?? product.category ?? product.type ?? '';

            return (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
                {/* Image */}
                <div className="relative h-40 bg-slate-50">
                  {image ? (
                    <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={32} className="text-slate-200" />
                    </div>
                  )}
                  {inStock && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      In Stock
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-1">{name}</h3>
                  {cat && <p className="text-xs text-slate-400 mt-0.5 mb-2">{cat}</p>}
                  <div className="flex items-center justify-between mb-3">
                    <div className="space-y-0.5">
                      <p className="font-black text-sm flex items-center gap-0.5" style={{ color: 'var(--primary)' }}>
                        <IndianRupee size={12} />{price ?? 'N/A'} <span className="text-[9px] font-bold text-slate-400 uppercase">(Local)</span>
                      </p>
                      {product.online_price && (
                        <p className="text-slate-400 text-[10px] flex items-center gap-0.5 font-bold">
                          <IndianRupee size={10} />{product.online_price} <span className="text-[8px] uppercase">(Online)</span>
                        </p>
                      )}
                      {mrp && Number(mrp) > 0 && (
                        <p className="text-slate-300 text-[10px] line-through flex items-center gap-0.5">
                          <IndianRupee size={10} />{mrp} <span className="text-[8px] uppercase">(MRP)</span>
                        </p>
                      )}
                    </div>
                    {qty != null && <span className="text-xs text-slate-400">Qty: {qty}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 transition-colors"
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                      className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-colors disabled:opacity-50"
                    >
                      {deleting === product.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <Package className="text-slate-200 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {searchQuery ? 'No Products Found' : 'No Products Yet'}
          </h3>
          <p className="text-slate-400 text-sm mb-5">
            {searchQuery ? 'Try a different search term' : 'Add your first product to start selling'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              style={{ background: 'var(--primary)' }}
            >
              <Plus size={14} className="inline mr-1.5" /> Add First Product
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function VendorCataloguePage() {
  return (
    <VendorDashboardLayout>
      <CatalogueContent />
    </VendorDashboardLayout>
  );
}
